import { readUsers } from './users.js';


export const getUser = async (id) => {
  const data = await readUsers();
  return data.find((item) => item.id === id);
};
