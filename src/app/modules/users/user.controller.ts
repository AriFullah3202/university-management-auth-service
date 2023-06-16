import { NextFunction, Request, RequestHandler, Response } from 'express';
import userService from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendRespose from '../../../shared/sendResponse';
import httpStatus from 'http-status';

//import { logger } from '../../../shared/logger'

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const result = await userService.createUser(user);

    res.status(200).json({});
    sendRespose(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user Created successfully',
      data: result,
    });
    next();
  }
);
export default { createUser };
