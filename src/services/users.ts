import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserData, UpdateUserData, User } from '../types/user';

const USERS_PATH = path.resolve(__dirname, '../../resources', 'users.json');

export const readUsers = async (): Promise<User[]> => {
  const data = await readFile(USERS_PATH);
  return JSON.parse(data.toString());
};

export const writeUsers = async (users: User[]) => {
  await writeFile(USERS_PATH, JSON.stringify(users));
};

export const addUsers = async (user: CreateUserData) => {
  const existedUsers = await readUsers();
  existedUsers.push({
    id: uuidv4(),
    ...user,
  });
  await writeUsers(existedUsers);
  return existedUsers;
};

export const updateUsersById = async (id: string, userData: UpdateUserData) => {
  const existedUsers: User[] = await readUsers();
  const newUsers = existedUsers.map((user) =>
    user.id === id ? { ...user, ...userData } : user,
  );
  await writeUsers(newUsers);
  return newUsers.find((user) => user.id === id);
};
