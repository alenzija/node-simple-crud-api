import http from 'node:http';

import { userIdMatch, usersMatch } from './routes';
import { resolveUsers } from './controllers/users';
import { resolveUserId } from './controllers/userId';

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (!req.url) {
    return;
  }
  if (usersMatch.test(req.url)) {
    resolveUsers(req, res);
  } else if (userIdMatch.test(req.url)) {
    resolveUserId(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint Not Allowed');
  }
});

server.listen(port);

export default server;
