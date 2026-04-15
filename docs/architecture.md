# VibeSketch — System Architecture

## Overview

VibeSketch is a single-tier, browser-based AI prototyping system with no backend infrastructure.

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                  │
│  ┌──────────────────┐    HTTP POST     ┌────────────────────┐   │
│  │   index.html     │─────────────────▶│  Anthropic API     │   │
│  │   (Prompt Panel) │                  │  claude-haiku-4-5 │   │
│  │                  │◀─────────────────│  /v1/messages      │   │
│  │   app.js         │  HTML/CSS/JS     └────────────────────┘   │
│  └────────┬─────────┘                                           │
│           │ inject code                                          │
│  ┌────────▼─────────────────────────────────────────────────┐   │
│  │         Sandboxed iframe (sandbox.html)                   │   │
│  │         Real-time Interactive UI Rendering                │   │
│  │         ┌──────────┐  ┌────────────┐  ┌─────────────┐   │   │
│  │         │ Desktop  │  │  Tablet    │  │   Mobile    │   │   │
│  │         │ (1440px) │  │  (768px)   │  │   (390px)   │   │   │
│  │         └──────────┘  └────────────┘  └─────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────┐    ┌─────────────────────────────────┐  │
│  │  Prompt History    │    │  Figma Export Module            │  │
│  │  (localStorage)    │    │  ┌─────────┐  ┌─────────────┐  │  │
│  │  Up to 30 entries  │    │  │ Tokens  │  │  Plugin.js  │  │  │
│  │  Persist on reload │    │  │  .json  │  │  (API code) │  │  │
│  └────────────────────┘    │  └─────────┘  └─────────────┘  │  │
│                            └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Prompt Layer (`index.html` + `app.js`)
- Textarea input for natural language description
- Quick-start chip buttons (Login, Dashboard, Landing Page, etc.)
- Generate button triggers API call
- Refinement panel for iterative changes

### 2. AI Layer (Anthropic Claude API)
- **Model:** `claude-haiku-4-5-20251001`
- **Max tokens:** 4096 per response
- **System prompt:** Instructs model to return only valid HTML
- **Conversation history:** Maintained for refinement context

### 3. Preview Layer (Sandboxed iframe)
- Receives raw HTML string from AI
- Renders it as a real browser page
- Sandboxed for security (`sandbox="allow-scripts allow-same-origin"`)
- Three responsive device modes

### 4. Persistence Layer (localStorage)
- Key: `vs_history`
- Value: Array of {id, prompt, code, time} objects
- Max 30 entries, oldest removed automatically
- Survives page refresh

### 5. Export Layer
- **HTML export:** Blob URL download
- **Tokens JSON:** CSS parsing → W3C token format → Tokens Studio compatible
- **Plugin code:** Auto-generated Figma Plugin API JavaScript

## Data Flow Diagram

```
User Input (Natural Language)
         │
         ▼
System Prompt + User Message
         │
         ▼
  Claude API Request
  {model, max_tokens, system, messages}
         │
         ▼
  Claude API Response
  {content: [{type: "text", text: "<!DOCTYPE html>..."}]}
         │
         ▼
  extractHTML() — strip markdown fences
         │
         ▼
  ┌──────┴──────────────────────────┐
  │              │                  │
  ▼              ▼                  ▼
iframe        codeBlock         saveToHistory()
(render)      (display)         (localStorage)
```

## Security Considerations

1. **Sandboxed iframe** — AI-generated code cannot access parent window
2. **No server-side execution** — All code runs client-side only
3. **No data storage** — Only localStorage on user's own device
4. **API calls** — Go directly to Anthropic's secure HTTPS endpoint

## Scalability Notes

Since this is a local-only prototype:
- No multi-user support needed
- No rate limiting implemented
- For production: add API key management, user auth, cloud storage

---

*VibeSketch Architecture Document · Mini Project 2025*
