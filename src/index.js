import http  from 'node:http';

const port = process.env.PORT || 3000;

let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

const GET = (req, res) => {
  if (/api\/users\/?$/.test(req.url)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
  } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
  }
}

const  POST = (req, res) => {
  let requestBody = '';
  req.on('data', (chunk) => {
      requestBody += chunk.toString();
  });

  req.on('end', () => {
      const userData = requestBody;
      const { name, email } = JSON.parse(userData);
      const newUser = { id: users.length + 1, name, email };
      users.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
      GET(req, res);
  } else if (req.method === 'POST') {
      POST(req, res);
  } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
  }
});

server.listen(port);
