// tiny static server for the stage page
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const types = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png' };
export function serve(root, port = 0) {
  return new Promise((res) => {
    const s = http.createServer((req, rsp) => {
      const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(p, (e, d) => { if (e) { rsp.writeHead(404); rsp.end(); return; } rsp.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); rsp.end(d); });
    }).listen(port, () => res(s));
  });
}
