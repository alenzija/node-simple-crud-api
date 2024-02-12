import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import server from '../index';
import * as UserService from 'services/users';
import * as UserIDService from 'services/userId';

describe('Server tests', () => {
  test('GET users responds with 200', async () => {
    jest.spyOn(UserService, 'readUsers').mockResolvedValue([
      {
        id: '1',
        name: 'Test User',
        age: 33,
        hobbies: [],
      },
    ]);

    const response = await request(server).get('/api/users/');
    expect(response.status).toBe(200);

    const data = await response.body;
    expect(data.length).toEqual(1);
  });

  test('POST User responds with 200', async () => {
    jest.spyOn(UserService, 'readUsers').mockResolvedValue([]);
    const userData = {
      name: 'Test User',
      age: 33,
      hobbies: [],
    };
    const writeUsersMock = jest.spyOn(UserService, 'writeUsers');

    const response = await request(server).post('/api/users/').send(userData);
    expect(response.status).toBe(201);

    const usersToWrite = writeUsersMock.mock.calls[0];
    expect(usersToWrite?.length).toEqual(1);
  });

  test('GET user by ID responds with 200', async () => {
    const userUUID = uuidv4();
    jest.spyOn(UserIDService, 'findUser').mockResolvedValue({
      id: userUUID,
      name: 'Test User #2',
      age: 22,
      hobbies: [],
    });

    const response = await request(server).get(`/api/users/${userUUID}`);
    expect(response.status).toBe(200);

    const data = await response.body;
    expect(data.id).toEqual(userUUID);
  });
});
