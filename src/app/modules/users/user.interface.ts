import { Model } from 'mongoose';

export type IUser = {
  id: string;
  role: string;
  password: string;
};
// Create a new Model type that knows about IUserMethods .
// eita staic method use korle dite hoy
export type UserModel = Model<IUser, object>;
