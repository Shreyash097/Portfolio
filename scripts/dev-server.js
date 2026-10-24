// Local dev server: serves the site and the /api/chat function on ONE port (default 3000).
// Usage: npm run dev   (PORT=4000 npm run dev to change the port)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = parseInt(process.env.PORT, 10) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8',
};

// Load api/*.js like Vercel does; reload when the files change so edits apply without restarting.
const apiCache = {};
function loadApi(name) {
  const file = path.join(ROOT, 'api', name + '.js');
  if (!fs.existsSync(file)) return null;
  const stamp = ['api/' + name + '.js', 'api/_facts.js']
    .map(f => { try { return fs.statSync(path.join(ROOT, f)).mtimeMs; } catch (e) { return 0; } }).join('|');
  if (!apiCache[name] || apiCache[name].stamp !== stamp) {
    Object.keys(require.cache).filter(k => k.startsWith(path.join(ROOT, 'api'))).forEach(k => delete require.cache[k]);
    apiCache[name] = { stamp, fn: require(file) };
  }
  return apiCache[name].fn;
}

function runApi(fn, req, res) {
  let raw = '';
  req.on('data', c => { raw += c; if (raw.length > 1e6) req.destroy(); });
  req.on('end', async () => {
    try { req.body = raw ? JSON.parse(raw) : {}; } catch (e) { req.body = raw; }
    let code = 200;
    const out = {
      setHeader: (k, v) => res.setHeader(k, v),
      status(c) { code = c; return out; },
      json(o) { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); return out; },
      send(b) { res.writeHead(code); res.end(b); return out; },
    };
    try { await fn(req, out); } catch (e) { console.error(e); if (!res.headersSent) { res.writeHead(500); res.end('server error'); } }
  });
}

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const t0 = Date.now();
  res.on('finish', () => console.log(`${req.method} ${url} -> ${res.statusCode} (${Date.now() - t0}ms)`));

  const api = url.match(/^\/api\/([a-z0-9-]+)\/?$/i);
  if (api) {
    const fn = loadApi(api[1]);
    if (!fn) { res.writeHead(404); return res.end('not found'); }
    return runApi(fn, req, res);
  }

  // static files; never serve dotfiles (.env, .git) or folders outside the project
  let file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT) || file.split(path.sep).some(p => p.startsWith('.'))) { res.writeHead(403); return res.end('forbidden'); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  });
}).on('error', e => {
  if (e.code === 'EADDRINUSE') console.error(`\nPort ${PORT} is already in use. Stop the other server (Ctrl + C in its terminal) or run: PORT=${PORT + 1} npm run dev\n`);
  else console.error(e);
  process.exit(1);
}).listen(PORT, () => {
  console.log(`\n  Portfolio running at http://localhost:${PORT}  (site + AI chat)\n  Press Ctrl + C to stop.\n`);
});
