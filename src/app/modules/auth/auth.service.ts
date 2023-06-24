import httpStatus from 'http-status';
import ApiError from '../../../error/ApiError';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { User } from '../users/user.modal';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helper/jwtHelpers';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  /* one approch */
  /*
  creating instance of user
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

  /*creating static of user
  access to our static methods */
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
  //create access token & refresh token

  const { id: userId, role, needsPasswordChange } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token

  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = { loginUser, refreshToken };
