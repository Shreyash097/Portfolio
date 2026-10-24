/* Client-side "mini RAG" assistant: retrieves the best-matching facts about Shreyash
   from the knowledge base below and answers from them. No API key, no backend. */
(() => {
  const KB = [
    { id: 'Future', tags: 'future plan plans goal goals next aim aage vision learning learn sikh seekh sikhna seekhna sikhta currently abhi want career',
      text: "Shreyash is deepening his skills in **system design** and **agentic AI**, and is also learning automation concepts and machine learning fundamentals. He is open to new opportunities where he can build and ship real products." },
    { id: 'Projects', tags: 'walk through project projects built made work portfolio showcase best',
      text: "Shreyash's standout projects are **Tools-Hub**, an engineering wiki with a RAG chatbot; **After Stars**, a food donation platform with real-time pickup tracking; and a full-featured **eCommerce website** with an admin dashboard. Ask me about any of them for details, or browse https://github.com/Shreyash097" },
    { id: 'Summary', tags: 'who about introduce yourself shreyash pandey developer profile summary tell me',
      text: "Shreyash Pandey is a **Full Stack Developer** from Lucknow, India, currently working at **Trackier** as an SDE-1 in the Performance Team. In a little over a year he has built backend services and client-facing features with Node.js, Express, MongoDB and React, and also created an internal RAG-powered knowledge chatbot." },
    { id: 'Current role', tags: 'current role job work company trackier sde sde-1 performance team position now working',
      text: "Shreyash is currently working at **Trackier** as a **Software Development Engineer I (SDE-1)** in the Performance Team, a role he has held since March 2026. He builds major client-facing features across multiple production projects end to end, and has also led the MongoDB 3 to 7 migration, contributed to the PHP to Node.js migration, and built a zero-cost Periskope–Vitally integration." },
    { id: 'Internship', tags: 'intern internship trackier started aug 2025 before earlier past experience',
      text: "Shreyash joined Trackier as a **Software Development Engineer Intern** in August 2025 and worked there until February 2026. During the internship he built **Tools-Hub**, an engineering wiki with a RAG chatbot, implemented semantic search with Pinecone, and Dockerized the company web application." },
    { id: 'MongoDB migration', tags: 'mongodb mongo migration v3 v7 database upgrade',
      text: "Shreyash led the **MongoDB migration from v3 to v7** for production services at Trackier, upgrading the database layer that the company's applications depend on." },
    { id: 'PHP to Node.js', tags: 'php node nodejs migration legacy backend modernize',
      text: "Shreyash contributed to the **PHP to Node.js migration** of Trackier's backend services, moving legacy modules onto a modern and more maintainable stack." },
    { id: 'Periskope-Vitally', tags: 'periskope vitally connector integration automation zero cost paid tool sync',
      text: "Shreyash built a **Periskope–Vitally connector** that replaced a paid third-party integration tool. It delivers the same sync between the two products at **zero cost**." },
    { id: 'Docker', tags: 'docker container setup one command dockerize environment devops',
      text: "Shreyash created the **Docker setup** for Trackier's web application, so any developer can get it running with a **single command**. It removed environment setup issues and saved a lot of developer time." },
    { id: 'Tools-Hub', tags: 'tools hub toolhub toolshub wiki engineering chatbot project',
      text: "**Tools-Hub** is a centralized engineering wiki that Shreyash built at Trackier. It puts every project's tech stack, GitHub, Notion and Jira details in one place, and includes a **RAG-based AI chatbot** that answers questions about repositories, documents and task history with source references. It is built with the MERN stack and Pinecone.\n\nCode: https://github.com/Shreyash097/ToolHubs" },
    { id: 'RAG & AI', tags: 'rag ai agentic agent llm chatbot semantic search vector embeddings pinecone retrieval generation artificial intelligence',
      text: "Shreyash designed a **RAG (Retrieval-Augmented Generation) chatbot** trained on Trackier's own data. It answers questions about repositories, documents and task history, and cites its sources. For retrieval he used **semantic search with vector embeddings in Pinecone**, pulling knowledge from Notion, Confluence, GitHub READMEs and Jira." },
    { id: 'After Stars', tags: 'after stars afterstars food donation ngo project redistribution',
      text: "**After Stars** is a food donation and redistribution platform that connects donors and event organizers with NGOs and delivery partners, so leftover food from weddings and parties reaches people in need. It has role-based dashboards, **real-time pickup tracking**, and optimized database queries that cut response time by about **30%**.\n\nCode: https://github.com/Shreyash097/AfterStars" },
    { id: 'eCommerce', tags: 'ecommerce e-commerce shop store admin dashboard orders project react',
      text: "Shreyash's **eCommerce website** is a full-featured online store built with React. It includes an **admin dashboard**, real-time analytics and order management workflows.\n\nCode: https://github.com/Shreyash097/E-commerce-website" },
    { id: 'Other projects', tags: 'projects other trello clone solar system gemini clone side projects github repos portfolio',
      text: "Besides his main work, Shreyash has built a **Trello Clone** (task management in React.js), a **Solar System Explorer** (planets orbiting the Sun in real time, in HTML, CSS and JavaScript) and a **Gemini Clone**.\n\nAll repositories: https://github.com/Shreyash097" },
    { id: 'Skills', tags: 'skills tech stack technologies languages tools know frameworks expertise',
      text: "Shreyash works mainly with **JavaScript, Node.js, Express and React**, with **MongoDB and MySQL** for data and **Docker, Git and GitHub** for DevOps. He also knows Java, SQL, HTML/CSS, Tailwind CSS, REST APIs and Pinecone, and uses Postman, Jira and Notion day to day. He is currently learning system design, agentic AI, automation concepts and machine learning fundamentals." },
    { id: 'Education', tags: 'education degree college university btech b.tech study graduated bbdniit',
      text: "Shreyash holds a **B.Tech in Computer Science and Engineering** from Babu Banarasi Das Northern India Institute of Technology, Lucknow, completed in July 2025." },
    { id: 'Contact', tags: 'contact email reach hire linkedin github connect available opportunities open work talk call',
      text: "The easiest way to reach Shreyash is by email at **pandeyshreyash790@gmail.com**. You can also find him on LinkedIn (http://www.linkedin.com/in/shreyash-pandey-a6b749253) or GitHub (https://github.com/Shreyash097), or tap **Hire me** at the top of the page. He is open to new opportunities." },
    { id: 'Location', tags: 'location where live based city india lucknow from',
      text: "Shreyash is based in **Lucknow, India**." },
  ];

  const STOP = new Set('a an the is are was were of in on at to for and or with about me tell what who how does do did his he him her she it this that can you your i my please shreyash pandey kya hai hain ka ki ke ko se mein me batao bata'.split(' '));
  const tok = s => s.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w));
  const stem = w => w.replace(/(ing|ed|es|s)$/, '');
  const docs = KB.map(d => ({ ...d, words: new Set(tok(d.tags + ' ' + d.id + ' ' + d.text).map(stem)), tagw: new Set(tok(d.tags).map(stem)) }));
  const df = {}; docs.forEach(d => d.words.forEach(w => df[w] = (df[w] || 0) + 1));

  const GREET = /^(hi|hii|hello|hey|namaste|yo|hola)\b/i;
  const THANKS = /\b(thanks|thank you|thx|shukriya|dhanyavad)\b/i;

  function retrieve(q) {
    const qw = tok(q).map(stem);
    if (!qw.length) return [];
    return docs.map(d => {
      let s = 0;
      qw.forEach(w => { if (d.words.has(w)) s += Math.log(1 + docs.length / df[w]) * (d.tagw.has(w) ? 2 : 1); });
      return { d, s };
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  }

  function answer(q) {
    if (GREET.test(q.trim())) return { text: "Hi! 👋 I'm Shreyash's portfolio assistant. Ask me about his experience, projects, skills or how to contact him." };
    if (THANKS.test(q)) return { text: "Anytime! If you'd like to talk to Shreyash directly, his email is pandeyshreyash790@gmail.com." };
    const hits = retrieve(q);
    if (!hits.length || hits[0].s < 1.2)
      return { text: "I couldn't find that in Shreyash's resume or GitHub. Try asking about his current work, projects, tech stack, education or how to contact him." };
    const top = hits.slice(0, 1);
    return { text: top.map(h => h.d.text).join('\n\n'), sources: top.map(h => h.d.id) };
  }

  const $ = id => document.getElementById(id);
  const box = $('chat'), log = $('chatLog'), input = $('chatInput'), fab = $('chatFab');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false, greeted = false;

  const linkify = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(https?:\/\/[^\s)<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  // Render assistant text: **bold**, links, "- " bullet lists, paragraphs.
  const render = s => {
    const inline = t => linkify(t);
    return s.split(/\n{2,}/).map(block => {
      const lines = block.split('\n'); let out = '', list = [];
      const flush = () => { if (list.length) { out += '<ul>' + list.map(l => '<li>' + inline(l) + '</li>').join('') + '</ul>'; list = []; } };
      lines.forEach(l => { const m = l.match(/^\s*[-•*]\s+(.*)/); if (m) list.push(m[1]); else { flush(); if (l.trim()) out += '<p>' + inline(l) + '</p>'; } });
      flush(); return out;
    }).join('');
  };
  const add = (cls, html) => { const m = document.createElement('div'); m.className = cls; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; };

  const DEFAULT_FU = ['What is he working on right now?', 'Walk me through a project', 'How can I contact him?'];
  const FU = {
    'Current role': ['What did he build at Trackier?', "What's his tech stack?", 'What is he learning next?'],
    'Internship': ['Tell me about Tools-Hub', 'What is he working on right now?', 'What are his skills?'],
    'Tools-Hub': ['How does the RAG chatbot work?', 'What other projects has he built?', 'How can I contact him?'],
    'After Stars': ['Tell me about Tools-Hub', 'What other projects has he built?', "What's his tech stack?"],
    'eCommerce': ['Tell me about After Stars', 'What other projects has he built?', 'How can I contact him?'],
    'Projects': ['Tell me about Tools-Hub', 'Tell me about After Stars', 'How can I contact him?'],
    'Skills': ['What is he learning next?', 'Walk me through a project', 'How can I contact him?'],
    'Future': ['What is he working on right now?', 'Walk me through a project', 'How can I contact him?'],
    'Contact': ['What is he working on right now?', "What's his tech stack?", 'Walk me through a project'],
  };
  const setChips = (label, list) => {
    $('chatTry').firstElementChild.textContent = label;
    const wrap = $('chatChips'); wrap.innerHTML = '';
    list.forEach(item => { const [ic, q] = Array.isArray(item) ? item : ['↳', item]; const b = document.createElement('button'); b.type = 'button'; b.innerHTML = '<em>' + ic + '</em>'; b.append(q); b.onclick = () => ask(q); wrap.appendChild(b); });
  };
  const history = [];
  async function remote() {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8) }), signal: ctl.signal });
      clearTimeout(t);
      if (!r.ok) return null;
      const d = await r.json();
      return d.text ? { text: d.text, followups: d.followups || [] } : null;
    } catch (e) { return null; }
  }

  async function ask(q) {
    if (busy || !q.trim()) return;
    busy = true; input.value = '';
    add('msg user', linkify(q));
    history.push({ role: 'user', content: q });
    const tr = add('trace', '● ● ●  thinking…');
    // 1) real AI (Vercel function), 2) fallback to the built-in knowledge base
    let res = await remote(), text, fu;
    if (res) { text = res.text; fu = res.followups; }
    else { await new Promise(r => setTimeout(r, 400)); const a = answer(q); text = a.text; fu = FU[(a.sources || [])[0]] || DEFAULT_FU; }
    if (!fu || !fu.length) fu = DEFAULT_FU;
    tr.remove();
    history.push({ role: 'assistant', content: text });
    const m = add('msg bot', '');
    if (reduce) m.innerHTML = render(text);
    else for (let i = 1; i <= text.length; i += 3) { m.innerHTML = render(text.slice(0, i)); log.scrollTop = log.scrollHeight; await new Promise(res => setTimeout(res, 8)); }
    m.innerHTML = render(text);
    setChips('Keep going', fu);
    log.scrollTop = log.scrollHeight;
    busy = false;
  }

  setChips('Try asking', [['🚀', 'What is he working on right now?'], ['</>', "What's his tech stack?"], ['📁', 'Walk me through a project'], ['✉', 'How can I contact him?']]);

  function open() {
    box.hidden = false; fab.hidden = true; setTimeout(() => input.focus(), 50);
    if (!greeted) { greeted = true; add('msg bot', "Hi, I'm Shreyash's AI assistant. Ask about his work, skills, or projects."); }
  }
  function close() { box.hidden = true; fab.hidden = false; }
  fab.onclick = open; $('chatClose').onclick = close;
  document.querySelectorAll('[data-open-chat]').forEach(b => b.addEventListener('click', open));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) close(); });
  $('chatForm').addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
})();
