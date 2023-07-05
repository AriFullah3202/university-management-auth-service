import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendRespose from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  const cookiesOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refeshToken', refreshToken, cookiesOptions);

  sendRespose<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendRespose<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: result,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;

  const user = req.user;

  await AuthService.changePassword(passwordData, user);

  sendRespose(res, {
    statusCode: 200,
    success: true,
    message: 'password changed successfully',
  });
});

export const AuthController = {
  logInUser,
  refreshToken,
  changePassword,
};
