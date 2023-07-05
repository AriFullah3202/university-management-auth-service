/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IStudent } from '../student/student.interface';
import { IFaculty } from '../facalty/facalty.interface';
import { IAdmin } from '../admin/admin.interface';

export type IUser = {
  id: string;
  role: string;
  password: string;
  needsPasswordChange: true | false;
  passwordChangedAt?: Date;
  student?: Types.ObjectId | IStudent;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};
/* one approch */
/*

export interface IUserMethods {
   isUserExist(id: string): Promise<Partial<IUser> | null>;
   isPasswordMatch(
     givenPassword: string,
     savedPassword: string
   ): Promise<boolean>;
 } 

*/

/* second approch */
export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'needsPasswordChange'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

//export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
