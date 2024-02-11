import http  from 'node:http';

import { usersMatch } from './routes.js';
import { resolveUsers } from './controllers/users.js';

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (usersMatch.test(req.url)) {
    resolveUsers(req, res);
  } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
  }
});

server.listen(port);
