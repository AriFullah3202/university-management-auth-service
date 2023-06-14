import ApiError from '../../../error/ApiError';
import { paginationHelper } from '../../../helper/paginationHelper';
import { IGenericResponse } from '../../../interface/common';
import { IPaginationOptions } from '../../../interface/pagination';
import { IAcademicSemester } from './academicSemester.Interface';
import { academicSemesterTitleCodeMapper } from './academicSemester.constant';
import { AcademicSemester } from './academicSemester.model';
import httpStatus from 'http-status';

const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllSemister = async (
  paginatinOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicSemester[]>> => {
  // src => helper => paginationHelper.ts
  const { page, limit, skip } =
    paginationHelper.calculatePaginations(paginatinOptions);
  const result = await AcademicSemester.find().sort().skip(skip).limit(limit);
  const total = await AcademicSemester.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const AcademicSemesterService = {
  createSemester,
  getAllSemister,
};
