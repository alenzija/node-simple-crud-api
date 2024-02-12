import { readUsers, writeUsers } from './users';

export const findUser = async (id: string) => {
  const users = await readUsers();
  return users.find((user) => user.id === id);
};

export const deleteUserById = async (id: string) => {
  const users = await readUsers();
  const newUsers = users.filter((user) => user.id !== id);
  await writeUsers(newUsers);
  return users.find((user) => user.id === id);
};
