# VibeSketch — Viva Q&A Preparation Guide

---

## 🔵 SECTION 1: Project Basics

**Q: What is VibeSketch?**
A: VibeSketch is a Generative AI-based system that converts natural language descriptions into working UI prototypes. Users type plain English descriptions, and the system uses Claude AI to generate complete HTML, CSS, and JavaScript code that is immediately rendered in the browser as an interactive prototype.

**Q: What problem does it solve?**
A: Traditional UI prototyping requires design skills (Figma, Adobe XD) or coding skills (HTML/CSS). VibeSketch eliminates both barriers — anyone can create a professional UI prototype just by describing it in plain English, reducing prototyping time from hours to seconds.

**Q: What is "vibe coding"?**
A: Vibe coding is a prompt-driven development approach where the developer communicates with an AI using natural language instead of writing code manually. The workflow is: describe → generate → preview → refine → repeat. There is zero manual coding involved.

**Q: Is this project free to use?**
A: Yes, 100% free. We use Claude claude-haiku-4-5 which is Anthropic's free-tier model. The app runs entirely in the browser with no backend, no database, no cloud hosting, and no subscriptions required.

---

## 🔵 SECTION 2: Technical Questions

**Q: What is your tech stack?**
A:
- **AI Model:** Claude claude-haiku-4-5 by Anthropic — free, fast, excellent at code generation
- **Frontend:** HTML5, CSS3, Vanilla JavaScript — no frameworks needed
- **Preview:** Sandboxed iframe for secure real-time rendering
- **Storage:** Browser localStorage for prompt history persistence
- **Fonts/Icons:** Google Fonts + Font Awesome CDN
- **Figma:** Plugin API + Tokens Studio for design handoff
- **Server:** Python's built-in `http.server` module (free, zero install)

**Q: How does the AI generate the UI?**
A: We call the Anthropic Claude API's `/v1/messages` endpoint with a carefully crafted system prompt that instructs the model to return only valid HTML files with embedded CSS and JS. The user's natural language description is sent as the user message. The response is extracted and injected into a sandboxed iframe for immediate rendering.

**Q: What is a sandboxed iframe and why do you use it?**
A: An iframe is a nested browser window within the main page. "Sandboxed" means it has restricted permissions — it can run scripts and render HTML but cannot access the parent page's data or DOM. We use it to safely render AI-generated code without security risks, and it also acts like a real browser preview, making the prototype genuinely interactive.

**Q: How does the refinement loop work?**
A: After initial generation, we maintain a conversation history: [user: original prompt → assistant: generated code → user: refinement instruction]. By sending this full history to Claude, the model understands the existing design and only applies the requested changes, preserving everything else. This is standard multi-turn conversation with LLMs.

**Q: How does the Figma export work?**
A: We have two methods:
1. **Design Tokens JSON** — We parse the generated HTML/CSS using regex to extract all hex colors, font families, font sizes, and border radii. These are structured in the Tokens Studio format (W3C Design Tokens spec) and exported as a JSON file that Figma plugins can read.
2. **Plugin Code** — We generate JavaScript code targeting Figma's Plugin API that creates frames with Auto Layout, applies color styles, and organizes layers semantically.

**Q: What is localStorage and how do you use it?**
A: localStorage is a browser API that stores key-value pairs persistently on the user's device. We use it to save the prompt history (up to 30 entries) so users can revisit and restore previous prototypes even after refreshing the page. It requires no backend or database.

---

## 🔵 SECTION 3: AI & Research Questions

**Q: What is the "Attention Is All You Need" paper about?**
A: Published by Vaswani et al. at Google in 2017, this paper introduced the Transformer architecture — the foundation of all modern large language models including GPT, Claude, and Gemini. The key innovation was the self-attention mechanism, which allows models to understand the relationship between all words in a sequence simultaneously (unlike RNNs which process sequentially). Every LLM we use today is built on this architecture.

**Q: How is Claude different from ChatGPT/Gemini?**
A: Claude is developed by Anthropic using Constitutional AI — a training approach focused on safety, helpfulness, and harmlessness. For code generation tasks, Claude is particularly strong at following precise formatting instructions (like "return only HTML, no markdown") which is critical for VibeSketch to function correctly.

**Q: What is prompt engineering?**
A: Prompt engineering is the practice of designing input instructions to get the best output from an AI model. In VibeSketch, our system prompt instructs Claude to: return only HTML (no markdown), use Google Fonts, make interactive UIs, use CSS variables, avoid placeholder images, and produce production-quality code. Good prompt engineering is the difference between useful and useless AI output.

**Q: What is a Large Language Model (LLM)?**
A: An LLM is a deep learning model trained on massive amounts of text data to understand and generate human language. They are based on the Transformer architecture. Examples include Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google). They can perform tasks like code generation, translation, summarization, and reasoning.

**Q: What are the limitations of your system?**
A: 
1. **Complex layouts:** Very complex UIs with many components may exceed the token limit
2. **CORS:** Direct browser API calls face CORS restrictions — requires a local server
3. **Images:** AI cannot generate real images, so we use CSS gradients as placeholders
4. **No persistence:** Generated UIs are not saved to a server — only as downloadable files
5. **Hallucination:** AI may occasionally generate incorrect or non-functional code

---

## 🔵 SECTION 4: Design & Architecture Questions

**Q: Explain your system architecture.**
A: The architecture is a single-tier browser-based system:
- **Input Layer:** The prompt textarea collects user's natural language description
- **Processing Layer:** JavaScript calls the Claude API with the prompt + system instructions
- **Generation Layer:** Claude returns complete HTML/CSS/JS code
- **Rendering Layer:** The code is injected into a sandboxed iframe for live preview
- **Export Layer:** Users can download HTML or export to Figma
- **Persistence Layer:** Prompt history stored in localStorage
There is no backend server, no database, and no cloud infrastructure.

**Q: What design patterns did you use?**
A: 
1. **Single Page Application (SPA):** Everything in one HTML file
2. **State Management:** A central `state` object manages current code, history, device mode
3. **Event-driven architecture:** All UI interactions are handled via event listeners
4. **Multi-turn conversation:** Refinement uses conversation history for context
5. **Modular functions:** Separated concerns — generate(), refine(), renderPreview(), exportHTML()

**Q: Why didn't you use React or Vue?**
A: The project requirement specifies HTML/CSS/JS only, no frameworks. Using Vanilla JS also keeps the project simple, teachable, and runs without any build tools or npm. It demonstrates that AI-powered applications don't require complex infrastructure.

---

## 🔵 SECTION 5: Novelty & Contribution Questions

**Q: What is novel about your project?**
A: 
1. **Integrated refinement loop** — Unlike simple code generators, VibeSketch maintains conversation context for iterative refinement
2. **Figma bridge** — Automatic design token extraction and Figma plugin code generation closes the prototype-to-design gap
3. **Device preview modes** — Desktop/tablet/mobile responsive testing built in
4. **Zero-dependency** — Works entirely in browser with no build tools, backends, or accounts
5. **Educational transparency** — Code view shows exactly what AI generated, useful for learning

**Q: How does this compare to existing tools like Framer AI or Vercel v0?**
A: Those are commercial, cloud-hosted, paid products. VibeSketch is:
- Completely free and open
- Runs locally with no data leaving the device (except the API call)
- Has Figma export built-in
- Designed specifically for educational/academic demonstration
- Simpler and more transparent in its workings

---

*Prepared for Mini Project Viva · VibeSketch · 2025*
