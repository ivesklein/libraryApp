/**
 * Domain model for User - independent of any ORM
 */
export class UserModel {
  id?: number;
  username: string;
  password: string;

  constructor(data: Partial<UserModel>) {
    Object.assign(this, data);
  }
}