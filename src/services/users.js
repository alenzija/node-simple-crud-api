import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.resolve();

const USERS_PATH = path.resolve(__dirname, 'resources', 'users.json');

export const readUsers = async () => {
  const data = await readFile(USERS_PATH);
  return JSON.parse(data);
}

export const writeUsers = async (users) => {
  await writeFile(USERS_PATH, JSON.stringify(users));
}

export const addUsers = async (users) => {
  const existedUsers = await readUsers();
  const newUsers = users.map((user) => ({
    id:uuidv4(),
    ...user
  }));

  const result = [
    ...existedUsers,
    ...newUsers,
  ];

  await writeUsers(result);
  return result;
}

