import http from 'node:http';

import { addUsers, readUsers } from '../services/users';

export const resolveUsers = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  try {
    if (req.method === 'GET') {
      await getUsers(res);
    } else if (req.method === 'POST') {
      await createUser(req, res);
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
};

export const getUsers = async (res: http.ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(await readUsers()));
};

export const createUser = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  let requestBody = '';
  req.on('data', (chunk) => {
    requestBody += chunk.toString();
  });

  req.on('end', async () => {
    const userData = requestBody;
    const { name, age, hobbies } = JSON.parse(userData);
    if (!name || !age || !hobbies) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end("Body doesn't contain required  fields");
    } else if (
      typeof name !== 'string' ||
      typeof age !== 'number' ||
      !Array.isArray(hobbies) ||
      hobbies.some((item) => typeof item !== 'string')
    ) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end('Wrong type');
    } else {
      const users = await addUsers({ name, age, hobbies });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users[users.length - 1]));
    }
  });
};
