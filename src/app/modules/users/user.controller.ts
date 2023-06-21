import { Request, RequestHandler, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import sendRespose from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserService } from './user.service';
import { IUser } from './user.interface';

const createStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { student, ...userData } = req.body;
    const result = await UserService.createStudent(student, userData);

    sendRespose<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  }
);

export const UserController = {
  createStudent,
};
