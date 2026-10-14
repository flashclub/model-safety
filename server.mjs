#!/usr/bin/env node
// model-safety（REDLINE）：模型安全评估概念站，纯静态单页。
// 零依赖，仅用 Node 内置模块（Node >= 20）。页面为仓库根目录的 index.html。
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = __dirname;
const PORT = Number(process.env.PORT || 3030);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

async function serveStatic(res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/') rel = '/index.html';
  // 本地服务顺带兜底仓库根目录，跳过点文件（.git 等）
  if (path.basename(rel).startsWith('.')) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== PUBLIC_DIR) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      'content-type': MIME[path.extname(filePath)] || 'application/octet-stream',
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const started = Date.now();
  try {
    if (req.method === 'GET' || req.method === 'HEAD') {
      await serveStatic(res, url.pathname);
    } else {
      res.writeHead(405, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } catch (error) {
    console.error(`[${req.method} ${url.pathname}] 未捕获错误:`, error);
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Internal error');
    } else {
      res.destroy();
    }
  }
  console.log(`${new Date().toISOString()} ${req.method} ${url.pathname} -> ${res.statusCode} (${Date.now() - started}ms)`);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`model-safety（REDLINE）已启动: http://127.0.0.1:${PORT}`);
});
