# Shreyash Pandey — 3D Developer Portfolio

A fast, animated portfolio built with plain HTML, CSS and JavaScript, with a **Three.js 3D background** and an **AI chat assistant** that answers questions about me in English, Hindi or Hinglish.

**Repo:** https://github.com/Shreyash097/Portfolio

<!-- Add a screenshot or GIF here once deployed:
![Portfolio preview](./preview.png)
-->

## What's inside

- **3D hero and background** (Three.js): a glowing wireframe core, torus knot and orbit rings that follow the mouse. While you scroll, the camera flies through a starfield with floating shapes.
- **Skills inventory:** filterable cards (Programming, Frontend, Backend, Cloud & DevOps, Data, Tools, Learning) with proficiency levels.
- **Experience timeline and project cards** with 3D tilt on hover.
- **"Hire me" side drawer:** pick Email, WhatsApp, Call, LinkedIn or GitHub.
- **WhatsApp message form** that opens a pre-filled chat.
- **AI chat assistant:** answers from Gemini (free tier) or Claude (via a Vercel serverless function). If the API is not configured, it falls back to a built-in knowledge base, so the chat never breaks.
- Typing roles, scroll reveal, glow cursor, magnetic buttons, mobile layout, and `prefers-reduced-motion` support.

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | HTML5, CSS3, vanilla JavaScript (no build step) |
| 3D / animation | [Three.js](https://threejs.org) r128 (loaded from cdnjs), CSS animations, IntersectionObserver |
| Fonts | Inter, JetBrains Mono (Google Fonts) |
| AI chat | Google Gemini API (free tier) or Anthropic Claude API, through a Vercel serverless function |
| Hosting | Vercel (static site + `api/` function) |

## Project structure

```
.
├── index.html      # page markup and sections
├── style.css       # theme, layout, components
├── main.js         # 3D scene, animations, skills inventory, drawer, WhatsApp form
├── package.json    # npm scripts (dev, dev:static)
├── scripts/dev-server.js  # local server: site + /api/chat on one port
├── .env.example    # all configurable settings (copy to .env)
├── chatbot.js      # chat UI, calls /api/chat, offline knowledge-base fallback
└── api/
    ├── chat.js     # Vercel serverless function (Gemini / Claude)
    └── _facts.js   # facts the AI is allowed to use
```

## Run it on your machine

You only need a browser and Node.js. There are no dependencies and no build step, so there is nothing to `npm install`.

```bash
# 1. Clone
git clone https://github.com/Shreyash097/Portfolio.git
cd Portfolio

# 2. Start the dev server: site + AI chat on one port (no install needed)
npm run dev

# 3. Open the site
# http://localhost:3000
```

No Node.js? `python3 -m http.server 8000` works too. Opening `index.html` by double-click also works for most of the page, but a local server is recommended. An internet connection is needed for the Three.js CDN and Google Fonts.

The chat assistant works locally using the **built-in knowledge base** (no setup). The Claude-powered answers need the serverless function, see below.

### Run the AI chat locally (optional)

```bash
cp .env.example .env     # then open .env and paste your key (free: aistudio.google.com/apikey)
npm run dev
```

Then open http://localhost:3000. No Vercel login is needed for local development.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Set **Framework Preset** to **Other**. Leave build command and output directory empty.
4. Under **Environment Variables**, add `GEMINI_API_KEY` (free, from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)) or `ANTHROPIC_API_KEY`. If both are set, Gemini is used first. Without any key the chat falls back to the built-in answers.
5. Click **Deploy**.

Never put an API key in any frontend file. It must only live in the Vercel environment variables.

## Make it your own

| What to change | Where |
| --- | --- |
| Name, text, experience, projects, contact links | `index.html` |
| Skills and proficiency (`'high'`, `'op'`, `'dev'`) | `SKILLS` array in `main.js` |
| Colors and theme | CSS variables at the top of `style.css` |
| Chat answers when the API is off | `KB` array in `chatbot.js` |
| Facts the AI is allowed to use | `api/_facts.js` |
| AI provider, models, answer length | `.env` (see `.env.example`) |
| WhatsApp number | search for `918887984720` in `index.html` and `main.js` |

Keep `api/_facts.js` and `KB` in `chatbot.js` consistent with your resume, because the assistant only answers from them.

## Browser support

Latest Chrome, Edge, Safari and Firefox with WebGL enabled. If WebGL is unavailable, the site still works without the 3D background.

## Contact

- Email: pandeyshreyash790@gmail.com
- LinkedIn: https://www.linkedin.com/in/shreyash-pandey-a6b749253
- GitHub: https://github.com/Shreyash097
