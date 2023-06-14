import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AcademicSemesterService } from './academicSemester.service';
import catchAsync from '../../../shared/catchAsync';
import sendRespose from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IAcademicSemester } from './academicSemester.Interface';
import pick from '../../../shared/pick';
import { paginationField } from '../../../constant/paginationFields';
import { logger } from '../../../shared/logger';

//import { logger } from '../../../shared/logger'

const createSemester: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...academicSemesterData } = req.body;
    const result = await AcademicSemesterService.createSemester(
      academicSemesterData
    );
    sendRespose(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semister Created successfully',
      data: result,
    });
    next();
  }
);
// get all
const getSemisters = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //ekhan theke pick.ts e jabe
    // ekhane req.query er moddhe ache value and paginationfield er moddhe ache
    // fileld
    //const paginationOptions = pick([ekhane sob value ache], ['page', 'limit', 'sortBy', 'sortOrder'] );

    const paginatinOptions = pick(req.query, paginationField);
    logger.info(paginatinOptions);
    const result = await AcademicSemesterService.getAllSemister(
      paginatinOptions
    );
    // app => shared => sendResponse.ts er moddhe jabe
    sendRespose<IAcademicSemester[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semister rerived susecssfully',
      meta: result.meta,
      data: result.data,
    });
    next();
  }
);

export const AcademicSemesterController = { createSemester, getSemisters };
