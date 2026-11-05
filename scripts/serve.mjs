import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('out');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/') {
        res.writeHead(302, { Location: '/portofolio/' });
        res.end();
        return;
      }
      if (!url.pathname.startsWith('/portofolio/'))
        throw new Error('Not found');
      let file = path.resolve(
        root,
        '.' + decodeURIComponent(url.pathname.slice('/portofolio'.length)),
      );
      if (!file.startsWith(root + path.sep) && file !== root)
        throw new Error('Not found');
      if ((await stat(file)).isDirectory())
        file = path.join(file, 'index.html');
      res.writeHead(200, {
        'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        await readFile(path.join(root, '404.html')).catch(
          () => 'Page introuvable',
        ),
      );
    }
  })
  .listen(4173, '127.0.0.1', () =>
    console.log('Local: http://127.0.0.1:4173/portofolio/'),
  );
