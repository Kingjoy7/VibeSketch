# ✦ VibeSketch — Natural Language to Interactive UI Prototyping

> **Mini Project | Generative AI | Dept. of Computer Science**
> 
> Convert plain English descriptions into working UI prototypes using Claude AI.

---

## 📁 Project Structure

```
vibesketch/
│
├── index.html              ← Main application (open this in browser)
├── style.css               ← App styles (colorful gradient theme)
├── app.js                  ← Core logic: AI generation, preview, history, Figma
│
├── figma-plugin/
│   ├── manifest.json       ← Figma plugin configuration
│   ├── plugin.js           ← Plugin logic (color styles, frames)
│   └── ui.html             ← Plugin UI panel
│
├── samples/
│   ├── login-page.html     ← Sample: Login UI
│   ├── dashboard.html      ← Sample: Dashboard UI
│   └── landing-page.html   ← Sample: Landing Page
│
├── docs/
│   ├── architecture.md     ← System architecture
│   ├── viva-qa.md          ← Viva Q&A preparation
│   └── prompt-guide.md     ← Prompt writing guide
│
└── README.md               ← This file
```

---

## 🚀 How to Run (Local — Completely Free)

### Option 1: Direct Browser (Quickest)
```
1. Download/extract this project folder
2. Double-click index.html → opens in browser
```
> ⚠️ Note: The Claude API call requires a CORS-enabled environment.
> If you see a CORS error, use Option 2 below.

### Option 2: Local Server (Recommended for API calls)

**Using Python (built into most systems):**
```bash
# Navigate to project folder
cd vibesketch

# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```
Then open: `http://localhost:8080`

**Using VS Code:**
- Install the "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

**Using Node.js:**
```bash
npx serve .
```

---

## 🤖 AI Model Used
- **Model:** `claude-haiku-4-5-20251001` (Anthropic)
- **Cost:** FREE — called via the Anthropic API
- **API Key:** Not required when running inside Claude's environment
- **Tokens:** Up to 4096 per generation

---

## 🎯 How to Use VibeSketch

### Step 1 — Describe your UI
Type in the left panel:
```
Create a login page with email and password fields,
a gradient background, and a glowing Sign In button
```

### Step 2 — Generate
Click **Generate UI** or press `Ctrl + Enter`

### Step 3 — Preview
The generated UI appears in the preview pane instantly.
Switch between **Desktop / Tablet / Mobile** views.

### Step 4 — Refine (Vibe Coding)
Use the Refine panel to iterate:
```
Make the background darker, add a logo placeholder at the top,
and change the button to a purple gradient
```

### Step 5 — Export
- **Export HTML** → Downloads working `.html` file
- **Figma Export** → Design tokens JSON + Plugin code
- **Open in new tab** → Full browser preview

---

## 🎨 Figma Export Guide

### Method 1 — Design Tokens (Easy)
1. Generate a UI in VibeSketch
2. Click **Figma Export** → **Design Tokens JSON** tab
3. Click **Download** to save `vibesketch-tokens.json`
4. In Figma, install **Tokens Studio for Figma** (free plugin)
5. Load your tokens file → all colors and typography sync automatically

### Method 2 — Figma Plugin
1. In Figma: **Plugins → Development → New Plugin → Run once**
2. Copy code from **Figma Export → Figma Plugin Code** tab
3. Paste and run → frames with auto layout + color styles created

### Method 3 — Install the Plugin Locally
1. In Figma: **Plugins → Development → Import plugin from manifest**
2. Select `figma-plugin/manifest.json`
3. Run the plugin from Figma's plugin menu

---

## 📝 Sample Prompts to Try

| Prompt | Expected Output |
|--------|----------------|
| `Create a login page with email, password, and a glowing button` | Login form |
| `Build a dashboard with sidebar, 4 stat cards, and a bar chart` | Analytics dashboard |
| `Design a pricing table with 3 tiers: Free, Pro, Enterprise` | Pricing page |
| `Make a product card with image, title, price, rating, add to cart` | E-commerce card |
| `Create a dark-themed music player with album art and controls` | Media player |
| `Build a landing page for an AI startup with hero section and features` | Landing page |
| `Design a settings page with profile, notifications, and security sections` | Settings panel |

---

## 🔄 Vibe Coding Workflow

```
Prompt → Generate → Preview → Refine → Repeat → Export
```

**Refinement examples:**
- `"Make it dark themed"`
- `"Add a navigation bar at the top"`
- `"Change all buttons to rounded pill shapes"`
- `"Add a success toast notification"`
- `"Make it mobile-friendly"`

---

## ⚙️ Tech Stack

| Component | Technology |
|-----------|-----------|
| AI Model | Claude claude-haiku-4-5 (Anthropic) |
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Fonts | Google Fonts (Syne + DM Sans) |
| Icons | Font Awesome 6 |
| Preview | Sandboxed iframe |
| Storage | localStorage (prompt history) |
| Figma | Plugin API + Tokens Studio |
| Server | None / Python http.server |
| Cost | 100% Free |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER BROWSER                      │
│                                                       │
│  ┌──────────────┐     ┌─────────────────────────┐    │
│  │  Prompt Panel│────▶│    Claude API (Free)     │    │
│  │  (index.html)│     │  claude-haiku-4-5       │    │
│  └──────────────┘     └────────────┬────────────┘    │
│                                    │ HTML/CSS/JS      │
│  ┌─────────────────────────────────▼──────────────┐  │
│  │           Preview Iframe (Sandboxed)            │  │
│  │           Real-time UI Rendering                │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
│  ┌─────────────────┐   ┌───────────────────────────┐ │
│  │  Prompt History │   │   Figma Export             │ │
│  │  (localStorage) │   │   tokens.json + plugin.js  │ │
│  └─────────────────┘   └───────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 🎓 Academic Information

- **Project Title:** VibeSketch: Natural Language to Interactive UI Prototyping using Generative AI
- **Category:** Mini Project
- **Domain:** Generative AI, Human-Computer Interaction
- **Core Concept:** Vibe Coding (prompt-driven development)
- **Implementation:** 100% free, browser-based, local execution

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Run via `python -m http.server 8080` |
| API not responding | Check internet connection |
| Preview blank | Click "Open in new tab" button |
| Figma tokens empty | Generate a UI first, then export |
| History lost | Check browser localStorage settings |

---

## 📚 Related Research Papers

1. "Attention Is All You Need" — Vaswani et al., 2017
2. PrototypeFlow — Multimodal UI Generation (2024)
3. GUIDE — Text-to-GUI Systems (2023)
4. FrontendBench — LLM UI Evaluation (2024)
5. WebBench — Browser-based Code Generation (2025)

---

