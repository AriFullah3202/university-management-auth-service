import { Model, Types } from 'mongoose';
import { IStudent } from '../student/student.interface';

export type IUser = {
  id: string;
  role: string;
  password: string;
  student?: Types.ObjectId | IStudent;
};
// Create a new Model type that knows about IUserMethods .
// eita staic method use korle dite hoy
export type UserModel = Model<IUser, object>;
