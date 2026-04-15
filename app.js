/* =============================================
   VibeSketch — app.js
   Core: Prompt → Claude API → HTML → Preview
   + Refinement loop, History, Figma Export
   FREE: Uses Anthropic claude-haiku-4-5, no key needed
   ============================================= */

// ─── STATE ────────────────────────────────────
const state = {
  currentCode: '',
  currentPrompt: '',
  history: JSON.parse(localStorage.getItem('vs_history') || '[]'),
  isLoading: false,
  currentDevice: 'desktop',
  activeTab: 'preview',
};

// ─── DOM REFS ─────────────────────────────────
const $ = id => document.getElementById(id);
const promptInput = $('promptInput');
const refineInput = $('refineInput');
const generateBtn = $('generateBtn');
const refineBtn = $('refineBtn');
const clearBtn = $('clearBtn');
const btnLoader = $('btnLoader');
const statusBar = $('statusBar');
const statusText = $('statusText');
const previewFrame = $('previewFrame');
const previewPlaceholder = $('previewPlaceholder');
const codeBlock = $('codeBlock');
const codeContainer = $('codeContainer');
const previewContainer = $('previewContainer');
const refinementSection = $('refinementSection');

// ─── SYSTEM PROMPT ────────────────────────────
const SYSTEM_PROMPT = `You are VibeSketch — an expert UI code generator.

When the user describes a UI, respond with ONLY a single complete HTML file.
Rules:
1. Return ONLY valid HTML. No explanation, no markdown, no backticks.
2. Include all CSS inside a <style> tag in <head>.
3. Include all JavaScript inside a <script> tag before </body>.
4. Make the UI visually polished, modern, and beautiful.
5. Use Google Fonts (link in head). Prefer unique fonts like Syne, Outfit, Plus Jakarta Sans, DM Sans.
6. Use CSS variables, gradients, smooth transitions.
7. Make it fully interactive (hover effects, focus states, basic JS behavior where appropriate).
8. The design must be responsive.
9. Do NOT include placeholder images from external services. Use CSS gradients or SVG shapes instead.
10. Make every UI prototype worthy of a real product demo.`;

// ─── STATUS HELPERS ───────────────────────────
function setStatus(msg, type = '') {
  statusText.textContent = msg;
  statusBar.className = `status-bar ${type}`;
}

// ─── LOADING STATE ────────────────────────────
function setLoading(on) {
  state.isLoading = on;
  generateBtn.disabled = on;
  refineBtn.disabled = on;
  const btnText = generateBtn.querySelector('.btn-text');
  btnText.textContent = on ? 'Generating...' : 'Generate UI';
  btnLoader.style.display = on ? 'inline' : 'none';

  // Show/hide loading overlay on preview
  const existing = previewContainer.querySelector('.loading-overlay');
  if (on && !existing) {
    const ov = document.createElement('div');
    ov.className = 'loading-overlay';
    ov.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-label">✦ Generating your UI...</div>`;
    previewContainer.appendChild(ov);
  } else if (!on && existing) {
    existing.remove();
  }
}

// ─── CALL CLAUDE API ──────────────────────────
async function callClaude(messages) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ─── RENDER PREVIEW ───────────────────────────
function renderPreview(html) {
  state.currentCode = html;

  // Show iframe, hide placeholder
  previewPlaceholder.style.display = 'none';
  previewFrame.style.display = 'block';

  // Apply device sizing
  applyDevice(state.currentDevice);

  // Write into sandboxed iframe
  const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  // Update code block
  codeBlock.textContent = html;

  // Show refinement panel
  refinementSection.style.display = 'flex';
}

// ─── GENERATE ─────────────────────────────────
async function generate() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    setStatus('⚠ Please enter a prompt first.', 'error');
    promptInput.focus();
    return;
  }

  setLoading(true);
  setStatus('✦ Sending to Claude...', 'loading');

  try {
    const messages = [{ role: 'user', content: `Create this UI: ${prompt}` }];
    const html = await callClaude(messages);
    const cleaned = extractHTML(html);

    renderPreview(cleaned);
    state.currentPrompt = prompt;
    saveToHistory(prompt, cleaned);

    setStatus(`✦ UI generated! (${cleaned.length.toLocaleString()} chars) — Refine below ↓`, 'success');

    // Switch to preview tab
    switchTab('preview');

  } catch (err) {
    console.error(err);
    setStatus(`✗ Error: ${err.message}`, 'error');

    // Fallback: show helpful message in preview
    renderPreview(fallbackHTML(err.message));
  } finally {
    setLoading(false);
  }
}

// ─── REFINE ───────────────────────────────────
async function refine() {
  const refinePrompt = refineInput.value.trim();
  if (!refinePrompt) {
    setStatus('⚠ Please enter refinement instructions.', 'error');
    refineInput.focus();
    return;
  }
  if (!state.currentCode) {
    setStatus('⚠ Generate a UI first before refining.', 'error');
    return;
  }

  setLoading(true);
  setStatus('✦ Applying refinement...', 'loading');

  try {
    const messages = [
      { role: 'user', content: `Create this UI: ${state.currentPrompt}` },
      { role: 'assistant', content: state.currentCode },
      { role: 'user', content: `Refine the UI with these changes: ${refinePrompt}. Return the complete updated HTML file only.` },
    ];
    const html = await callClaude(messages);
    const cleaned = extractHTML(html);

    renderPreview(cleaned);
    saveToHistory(`[Refined] ${refinePrompt}`, cleaned);
    refineInput.value = '';

    setStatus(`✦ Refinement applied! Keep refining or export.`, 'success');

  } catch (err) {
    console.error(err);
    setStatus(`✗ Refinement failed: ${err.message}`, 'error');
  } finally {
    setLoading(false);
  }
}

// ─── EXTRACT HTML ─────────────────────────────
function extractHTML(raw) {
  // Strip markdown code fences if model adds them
  let html = raw.trim();
  html = html.replace(/^```html\s*/i, '').replace(/\s*```\s*$/, '');
  html = html.replace(/^```\s*/, '').replace(/\s*```\s*$/, '');
  return html;
}

// ─── FALLBACK HTML ────────────────────────────
function fallbackHTML(errMsg) {
  return `<!DOCTYPE html><html><head>
<style>
  body { font-family: sans-serif; display:flex; align-items:center; justify-content:center;
         height:100vh; margin:0; background:#0a0a14; color:#f0eeff; text-align:center; }
  .box { max-width:460px; padding:32px; border:1px solid #ff6060; border-radius:16px;
         background:rgba(255,80,80,0.06); }
  h3 { color:#ff6060; margin-bottom:12px; }
  p  { color:#8b8aaa; font-size:14px; line-height:1.6; }
  code { background:rgba(255,255,255,0.08); padding:2px 8px; border-radius:4px;
         color:#ffe066; font-size:12px; word-break:break-all; }
  .tip { margin-top:16px; padding:12px; background:rgba(255,255,255,0.04);
         border-radius:8px; font-size:13px; }
</style></head><body>
<div class="box">
  <h3>⚠ Generation Failed</h3>
  <p>${errMsg}</p>
  <div class="tip">
    💡 Tip: If you see a CORS or API error, this project needs to be 
    run via a local server. See <code>README.md</code> for setup instructions.
  </div>
</div>
</body></html>`;
}

// ─── HISTORY ──────────────────────────────────
function saveToHistory(prompt, code) {
  const entry = {
    id: Date.now(),
    prompt,
    code,
    time: new Date().toLocaleString(),
  };
  state.history.unshift(entry);
  if (state.history.length > 30) state.history.pop();
  localStorage.setItem('vs_history', JSON.stringify(state.history));
}

function renderHistory() {
  const list = $('historyList');
  if (!state.history.length) {
    list.innerHTML = '<p class="empty-state">No prompts yet. Generate your first UI!</p>';
    return;
  }
  list.innerHTML = state.history.map(e => `
    <div class="history-item" data-id="${e.id}">
      <div class="history-prompt">${escHtml(e.prompt)}</div>
      <div class="history-meta">
        <span>${e.time}</span>
        <span>${(e.code?.length || 0).toLocaleString()} chars</span>
        <span class="history-restore">Click to restore →</span>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const entry = state.history.find(h => h.id == el.dataset.id);
      if (entry) {
        renderPreview(entry.code);
        promptInput.value = entry.prompt.replace('[Refined] ', '');
        state.currentPrompt = promptInput.value;
        closeModal('historyModal');
        switchTab('preview');
        setStatus(`✦ Restored: "${entry.prompt.slice(0, 50)}..."`, 'success');
      }
    });
  });
}

// ─── TABS ─────────────────────────────────────
function switchTab(tab) {
  state.activeTab = tab;
  $('tabPreview').classList.toggle('active', tab === 'preview');
  $('tabCode').classList.toggle('active', tab === 'code');

  if (tab === 'preview') {
    previewContainer.style.display = 'flex';
    codeContainer.style.display = 'none';
  } else {
    previewContainer.style.display = 'none';
    codeContainer.style.display = 'flex';
  }
}

// ─── DEVICE ───────────────────────────────────
function applyDevice(device) {
  state.currentDevice = device;
  previewFrame.dataset.device = device;
  previewFrame.removeAttribute('width');
  previewFrame.removeAttribute('height');
  previewFrame.style.cssText = '';

  if (device === 'desktop') {
    previewFrame.style.width = '100%';
    previewFrame.style.height = '100%';
  } else if (device === 'tablet') {
    previewFrame.style.width = '768px';
    previewFrame.style.height = '90%';
    previewFrame.style.borderRadius = '12px';
    previewFrame.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
  } else if (device === 'mobile') {
    previewFrame.style.width = '390px';
    previewFrame.style.height = '844px';
    previewFrame.style.borderRadius = '36px';
    previewFrame.style.border = '8px solid #222';
    previewFrame.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
  }

  document.querySelectorAll('.icon-btn[data-device]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.device === device);
  });
}

// ─── EXPORT HTML ──────────────────────────────
function exportHTML() {
  if (!state.currentCode) {
    setStatus('⚠ Generate a UI first.', 'error');
    return;
  }
  const blob = new Blob([state.currentCode], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `vibesketch-ui-${Date.now()}.html`;
  a.click();
  setStatus('✦ HTML exported!', 'success');
}

// ─── FIGMA EXPORT ─────────────────────────────
function openFigmaExport() {
  if (!state.currentCode) {
    setStatus('⚠ Generate a UI first to export.', 'error');
    return;
  }

  const tokens = extractDesignTokens(state.currentCode);
  const plugin = generateFigmaPluginCode(state.currentCode, tokens);

  $('tokensOutput').textContent = JSON.stringify(tokens, null, 2);
  $('pluginOutput').textContent = plugin;

  openModal('figmaModal');
}

function extractDesignTokens(html) {
  const colors = new Set();
  const fontFamilies = new Set();
  const fontSizes = new Set();
  const radii = new Set();

  // Extract hex colors
  const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
  let m;
  while ((m = hexRe.exec(html)) !== null) colors.add(m[0].toUpperCase());

  // Extract rgb/rgba
  const rgbRe = /rgba?\([^)]+\)/g;
  while ((m = rgbRe.exec(html)) !== null) colors.add(m[0]);

  // Font families
  const fontRe = /font-family:\s*['"]?([^;'"]+)['"]?/gi;
  while ((m = fontRe.exec(html)) !== null) fontFamilies.add(m[1].trim());

  // Font sizes
  const sizeRe = /font-size:\s*([0-9.]+(?:px|rem|em))/gi;
  while ((m = sizeRe.exec(html)) !== null) fontSizes.add(m[1]);

  // Border radii
  const radRe = /border-radius:\s*([0-9.]+(?:px|rem|em|%))/gi;
  while ((m = radRe.exec(html)) !== null) radii.add(m[1]);

  // Build token object (Tokens Studio format)
  const colorTokens = {};
  [...colors].slice(0, 30).forEach((c, i) => {
    const name = `color-${(i + 1).toString().padStart(2, '0')}`;
    colorTokens[name] = { value: c, type: 'color' };
  });

  const typTokens = {};
  [...fontFamilies].forEach((f, i) => {
    typTokens[`fontFamily-${i + 1}`] = { value: f, type: 'fontFamilies' };
  });
  [...fontSizes].forEach((s, i) => {
    typTokens[`fontSize-${i + 1}`] = { value: s, type: 'fontSizes' };
  });

  const otherTokens = {};
  [...radii].forEach((r, i) => {
    otherTokens[`borderRadius-${i + 1}`] = { value: r, type: 'borderRadius' };
  });

  return {
    global: {
      ...colorTokens,
      ...typTokens,
      ...otherTokens,
    },
    $metadata: {
      tokenSetOrder: ['global'],
    },
  };
}

function generateFigmaPluginCode(html, tokens) {
  const colorEntries = Object.entries(tokens.global)
    .filter(([, v]) => v.type === 'color')
    .map(([name, v]) => ({ name, value: v.value }));

  const fontEntries = Object.entries(tokens.global)
    .filter(([, v]) => v.type === 'fontFamilies')
    .map(([name, v]) => ({ name, value: v.value }));

  return `// VibeSketch — Auto-generated Figma Plugin Code
// Paste this into Figma → Plugins → Development → New Plugin → "Run once"
// -------------------------------------------------------------------

const colors = ${JSON.stringify(colorEntries, null, 2)};

const fonts  = ${JSON.stringify(fontEntries, null, 2)};

// ── Load all fonts first ──
async function loadFonts() {
  const toLoad = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Bold" },
  ];
  fonts.forEach(f => {
    toLoad.push({ family: f.value.replace(/['"]/g, '').split(',')[0].trim(), style: "Regular" });
  });
  for (const f of toLoad) {
    try { await figma.loadFontAsync(f); } catch(e) {}
  }
}

// ── Create Color Styles ──
function createColorStyles() {
  colors.forEach(({ name, value }) => {
    try {
      // Parse hex
      let r = 0, g = 0, b = 0, a = 1;
      const hex = value.replace('#', '');
      if (hex.length >= 6) {
        r = parseInt(hex.slice(0,2), 16) / 255;
        g = parseInt(hex.slice(2,4), 16) / 255;
        b = parseInt(hex.slice(4,6), 16) / 255;
        if (hex.length === 8) a = parseInt(hex.slice(6,8), 16) / 255;
      }
      const style = figma.createPaintStyle();
      style.name  = "VibeSketch/" + name;
      style.paints = [{ type: 'SOLID', color: { r, g, b }, opacity: a }];
    } catch(e) { console.error('Color style error:', name, e); }
  });
}

// ── Create Main Frame ──
function createMainFrame() {
  const frame = figma.createFrame();
  frame.name  = "VibeSketch — Generated UI";
  frame.resize(1440, 900);
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.paddingTop    = 0;
  frame.paddingBottom = 0;
  frame.paddingLeft   = 0;
  frame.paddingRight  = 0;
  frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 1 } }];

  // Add a title annotation
  const label = figma.createText();
  label.characters = "Generated by VibeSketch";
  label.fontSize = 14;
  label.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.6 } }];
  label.x = 24;
  label.y = -30;
  figma.currentPage.appendChild(label);
  figma.currentPage.appendChild(frame);

  return frame;
}

// ── Main ──
(async () => {
  await loadFonts();
  createColorStyles();
  const frame = createMainFrame();

  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.notify("✦ VibeSketch: " + ${colorEntries.length} + " color styles created! Import tokens.json into Tokens Studio for full fidelity.", { timeout: 6000 });
  figma.closePlugin();
})();
`;
}

// ─── COPY TO CLIPBOARD ────────────────────────
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-check"></i> Copied!';
    btn.style.color = 'var(--g-cyan)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 2000);
  });
}

// ─── MODAL HELPERS ────────────────────────────
function openModal(id) { $(id).style.display = 'flex'; }
function closeModal(id) { $(id).style.display = 'none'; }

// ─── ESCAPE HTML ──────────────────────────────
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── EVENT LISTENERS ──────────────────────────
generateBtn.addEventListener('click', generate);

promptInput.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') generate();
});

refineBtn.addEventListener('click', refine);

refineInput.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') refine();
});

clearBtn.addEventListener('click', () => {
  promptInput.value = '';
  promptInput.focus();
  setStatus('Ready to generate your first UI ✦', '');
});

// Chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    promptInput.value = chip.dataset.prompt;
    promptInput.focus();
    setStatus(`✦ Template loaded. Hit Generate!`, 'success');
  });
});

// Tabs
$('tabPreview').addEventListener('click', () => switchTab('preview'));
$('tabCode').addEventListener('click', () => switchTab('code'));

// Device buttons
document.querySelectorAll('.icon-btn[data-device]').forEach(btn => {
  btn.addEventListener('click', () => applyDevice(btn.dataset.device));
});

// History
$('historyBtn').addEventListener('click', () => {
  renderHistory();
  openModal('historyModal');
});
$('closeHistory').addEventListener('click', () => closeModal('historyModal'));
$('clearHistoryBtn').addEventListener('click', () => {
  state.history = [];
  localStorage.removeItem('vs_history');
  renderHistory();
  setStatus('✦ History cleared.', '');
});

// Export HTML
$('exportHtmlBtn').addEventListener('click', exportHTML);

// Figma
$('figmaBtn').addEventListener('click', openFigmaExport);
$('closeFigma').addEventListener('click', () => closeModal('figmaModal'));

// Copy Code
$('copyCodeBtn').addEventListener('click', () => {
  copyText(state.currentCode, $('copyCodeBtn'));
});

// Figma copy/download
$('copyTokensBtn').addEventListener('click', () => {
  copyText($('tokensOutput').textContent, $('copyTokensBtn'));
});
$('copyPluginBtn').addEventListener('click', () => {
  copyText($('pluginOutput').textContent, $('copyPluginBtn'));
});
$('downloadTokensBtn').addEventListener('click', () => {
  const blob = new Blob([$('tokensOutput').textContent], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vibesketch-tokens.json';
  a.click();
});

// Figma tab switching
document.querySelectorAll('.figma-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.figma-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.figma-tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    $('ftab-' + tab.dataset.ftab).classList.add('active');
  });
});

// Fullscreen
$('fullscreenBtn').addEventListener('click', () => {
  if (!state.currentCode) return;
  const win = window.open('', '_blank');
  win.document.write(state.currentCode);
  win.document.close();
});

// Close modals on overlay click
['historyModal', 'figmaModal'].forEach(id => {
  $(id).addEventListener('click', e => {
    if (e.target === $(id)) closeModal(id);
  });
});

// ─── INIT ─────────────────────────────────────
setStatus('Ready — describe a UI and hit Generate (Ctrl+Enter) ✦', '');
applyDevice('desktop');
console.log('✦ VibeSketch loaded. Powered by Claude claude-haiku-4-5.');