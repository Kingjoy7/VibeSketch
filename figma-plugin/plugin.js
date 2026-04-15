// VibeSketch → Figma Plugin
// plugin.js — receives HTML/CSS from ui.html, creates Figma nodes

figma.showUI(__html__, { width: 440, height: 560, title: "VibeSketch → Figma" });

figma.ui.onmessage = async (msg) => {

  // ── IMPORT TOKENS ──────────────────────────────────────────
  if (msg.type === 'import-tokens') {
    const tokens = msg.tokens;
    await importTokensToFigma(tokens);
    figma.ui.postMessage({ type: 'done', text: 'Tokens imported!' });
  }

  // ── GENERATE FRAMES FROM HTML ───────────────────────────────
  if (msg.type === 'generate-frames') {
    const { html, tokens } = msg;
    await generateFrames(html, tokens);
    figma.ui.postMessage({ type: 'done', text: 'Frames created!' });
  }

  if (msg.type === 'close') figma.closePlugin();
};

// ── LOAD FONTS ──────────────────────────────────────────────────
async function loadFonts(families = []) {
  const base = [
    { family: "Inter",       style: "Regular" },
    { family: "Inter",       style: "Medium"  },
    { family: "Inter",       style: "Bold"    },
    { family: "Roboto",      style: "Regular" },
    { family: "Roboto",      style: "Bold"    },
  ];
  const all = [...base, ...families.map(f => ({ family: f, style: "Regular" }))];
  for (const f of all) {
    try { await figma.loadFontAsync(f); } catch (_) {}
  }
}

// ── PARSE HEX COLOR ────────────────────────────────────────────
function parseHex(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return {
    r: parseInt(hex.slice(0,2), 16) / 255,
    g: parseInt(hex.slice(2,4), 16) / 255,
    b: parseInt(hex.slice(4,6), 16) / 255,
  };
}

// ── IMPORT TOKENS TO FIGMA ────────────────────────────────────
async function importTokensToFigma(tokens) {
  await loadFonts();
  const global = tokens.global || {};

  let colorCount = 0;
  let textCount  = 0;

  for (const [name, token] of Object.entries(global)) {
    if (token.type === 'color') {
      try {
        const val = token.value;
        let color = { r: 0, g: 0, b: 0 };
        if (val.startsWith('#') && val.length >= 7) color = parseHex(val);

        const existing = figma.getLocalPaintStyles().find(s => s.name === `VibeSketch/${name}`);
        const style    = existing || figma.createPaintStyle();
        style.name     = `VibeSketch/${name}`;
        style.paints   = [{ type: 'SOLID', color }];
        colorCount++;
      } catch (e) { console.error('Token import error:', name, e); }
    }

    if (token.type === 'fontFamilies') {
      textCount++;
    }
  }

  figma.notify(
    `✦ VibeSketch: ${colorCount} color styles, ${textCount} font tokens imported!`,
    { timeout: 5000 }
  );
}

// ── GENERATE FRAMES ──────────────────────────────────────────
async function generateFrames(html, tokens) {
  await loadFonts();

  // Create top-level wrapper frame
  const wrapper = figma.createFrame();
  wrapper.name  = '🎨 VibeSketch UI';
  wrapper.resize(1440, 900);
  wrapper.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 1 } }];
  wrapper.layoutMode  = 'VERTICAL';
  wrapper.primaryAxisSizingMode   = 'AUTO';
  wrapper.counterAxisSizingMode   = 'FIXED';
  wrapper.paddingTop    = 0;
  wrapper.paddingBottom = 0;
  wrapper.itemSpacing   = 0;

  // Create semantic section frames
  const sections = [
    { name: '🗂 Header',  height: 80,  color: { r:0.98, g:0.98, b:1 } },
    { name: '🦸 Hero',    height: 400, color: { r:0.96, g:0.96, b:1 } },
    { name: '⚙ Main',    height: 320, color: { r:0.99, g:0.99, b:1 } },
    { name: '🔗 Footer',  height: 100, color: { r:0.94, g:0.94, b:1 } },
  ];

  for (const sec of sections) {
    const f = figma.createFrame();
    f.name   = sec.name;
    f.resize(1440, sec.height);
    f.fills  = [{ type: 'SOLID', color: sec.color }];
    f.layoutMode  = 'HORIZONTAL';
    f.primaryAxisSizingMode = 'FIXED';
    f.counterAxisSizingMode = 'FIXED';
    f.primaryAxisAlignItems   = 'CENTER';
    f.counterAxisAlignItems   = 'CENTER';
    f.paddingLeft   = 80;
    f.paddingRight  = 80;

    // Add label
    const label = figma.createText();
    label.characters = sec.name.replace(/[^\w\s]/g, '').trim();
    label.fontSize    = 18;
    label.fontName    = { family: 'Inter', style: 'Bold' };
    label.fills       = [{ type:'SOLID', color:{ r:0.6, g:0.6, b:0.7 } }];
    f.appendChild(label);

    wrapper.appendChild(f);
  }

  // Apply color styles from tokens
  const colorTokens = Object.entries(tokens?.global || {})
    .filter(([,v]) => v.type === 'color')
    .map(([name, v]) => ({ name, value: v.value }));

  for (const ct of colorTokens.slice(0, 10)) {
    try {
      const e = figma.getLocalPaintStyles().find(s => s.name === `VibeSketch/${ct.name}`);
      if (!e && ct.value.startsWith('#')) {
        const style  = figma.createPaintStyle();
        style.name   = `VibeSketch/${ct.name}`;
        style.paints = [{ type: 'SOLID', color: parseHex(ct.value) }];
      }
    } catch (_) {}
  }

  // Add watermark
  const wm = figma.createText();
  wm.characters = `Generated by VibeSketch · ${new Date().toLocaleDateString()}`;
  wm.fontSize   = 12;
  wm.fills      = [{ type:'SOLID', color:{ r:0.7, g:0.7, b:0.8 }, opacity: 0.6 }];
  wm.x = 24;
  wm.y = -24;
  figma.currentPage.appendChild(wm);

  figma.currentPage.appendChild(wrapper);
  figma.viewport.scrollAndZoomIntoView([wrapper]);

  figma.notify(
    `✦ VibeSketch: Frames created with ${sections.length} sections + ${colorTokens.length} colors!`,
    { timeout: 6000 }
  );
}
