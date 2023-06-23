import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendRespose from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  sendRespose(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: result,
  });
});

export const AuthController = {
  logInUser,
};
