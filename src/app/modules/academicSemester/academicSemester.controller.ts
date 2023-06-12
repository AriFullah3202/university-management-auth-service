import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsync from '../../../shared/catchAsync';
import sendRespose from '../../../shared/sendResponse';
import httpStatus from 'http-status';

//import { logger } from '../../../shared/logger'

const createSemester: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...academicSemesterData } = req.body;
    const result = await AcademicSemesterService.createSemester(
      academicSemesterData
    );
    next();
    sendRespose(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semister Created successfully',
      data: result,
    });
  }
);
export const AcademicSemesterController = { createSemester };
