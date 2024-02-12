import { deleteUserById, findUser } from '../services/userId.js';
import { updateUsersById } from '../services/users.js';

export const resolveUserId = async (req, res) => {
  try {
    const id = req.url.split('/').pop();
    if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)){
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(`User's id is invalid`);
      return;
    }
    if (req.method === 'GET') {
      getUser(res, id);
    } else if (req.method === 'PUT') {
      updateUser(req, res);
    } else if (req.method === 'DELETE') {
      deleteUser(res, id);
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
  }
  } catch (e) {
    console.error(e.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
}

const getUser = async (res, id) => {
  const user = await findUser(id);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(`User with id=${id} doesn\'t exist`);
  }
};

const updateUser = async (req, res) => {
  const id = req.url.split('/').pop();
  let requestBody = '';
  req.on('data', (chunk) => {
      requestBody += chunk.toString();
  });

  req.on('end', async () => {
    const userData = requestBody;
    const { name, age, hobbies } = JSON.parse(userData);
    if (!name && !age && !hobbies) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end('Body must contain name, age or hobbies fields');
      return;
    }
    if (
      (name && typeof name !== 'string')
      || (age && typeof age !== 'number')
      || (hobbies && (!Array.isArray(hobbies) || hobbies.some((item) => typeof item !== 'string')))
      ) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('Wrong type');
        return;
    }
    if (!await findUser(id)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(`User with id=${id} doesn\'t exist`);    
      return;
    }
    const updatedData = {};
    if (name) {
      updatedData.name = name;
    }
    if (age) {
      updatedData.age = age;
    }
    if (hobbies) {
      updatedData.hobbies = hobbies;
    }
    const updatedUser = await updateUsersById(id, updatedData);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
  });
}

const deleteUser = async (res, id) => {
  const user = await findUser(id);
  if (user) {
    const user = await deleteUserById(id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(`User with id=${id} doesn\'t exist`);
  }
};


