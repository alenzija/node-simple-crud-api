export interface CreateUserData {
  name: string;
  age: number;
  hobbies: string[];
}

export interface User extends CreateUserData {
  id: string;
}

export interface UpdateUserData {
  name?: string;
  age?: number;
  hobbies?: string[];
}
