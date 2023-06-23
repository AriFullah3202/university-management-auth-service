import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import { ILoginUser } from './auth.interface';
import { User } from '../users/user.modal';

const loginUser = async (payload: ILoginUser) => {
  const { id, password } = payload;

  /* one approch */
  /* //creating instance of user
  const user = new User();
  // access to our instance methods
  const isUserExist = await user.isUserExist(id);

  // check the user exits

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exit');
  }
  // not match the password
  if (
    isUserExist.password &&
    !user.isPasswordMatch(password, isUserExist?.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  */

  //creating static of user

  // access to our static methods
  const isUserExist = await User.isUserExist(id);

  // check the user exits

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exit');
  }
  // not match the password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
};
export const AuthService = { loginUser };
