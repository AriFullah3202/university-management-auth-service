import { SortOrder } from 'mongoose';
import ApiError from '../../../error/ApiError';
import { paginationHelper } from '../../../helper/paginationHelper';
import { IGenericResponse } from '../../../interface/common';
import { IPaginationOptions } from '../../../interface/pagination';
import {
  IAcademicSemester,
  IAcademicSemesterFilter,
} from './academicSemester.Interface';
import { academicSemesterTitleCodeMapper } from './academicSemester.constant';
import { AcademicSemester } from './academicSemester.model';
import httpStatus from 'http-status';
import { logger } from '../../../shared/logger';

const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};
//in getAllSemister nibe ekta object {page , limit , sortBy , sortOrder}
const getAllSemister = async (
  filters: IAcademicSemesterFilter,
  paginatinOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicSemester[]>> => {
  /*
  for pagination
   src => helper => paginationHelper.ts
   amra paginationHelper maddhome amra pacchi {page , limit , skip , sortby , sortOrder}
  */
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePaginations(paginatinOptions);
  /* 
   for sorting
   empty object key and value type declaration
   if er maddohome object e key and value akare data save korchi
   */
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  /* 
  for seaching and filter
 ekhane search er jonno filter jonno distruct kora hoyeche
 empty andCondition e searchTerm and filter er object akare push kora hoyeche
 andConditions e thakbe =>
  example : 
 [ { '$or': [ [Object], [Object], [Object] ] } ]
 

 */
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  const academicSemisterSearchAbleField = ['title', 'code', 'year'];
  if (searchTerm) {
    andConditions.push({
      $or: academicSemisterSearchAbleField.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  /*
  eirokom search dile 
  /academic-semesters/?searchTerm=2023&title=Autumn
  console.log(Object.keys(filtersData));
  [ 'title' ]
  console.log(Object.entries(filtersData));
  [ [ 'title', 'Autumn' ] ]
  */

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  /* 
  console.log(andConditions)
  [ { '$or': [ [Object], [Object], [Object] ] } ]
  console.log(whereConditons)
  { '$and': [ { '$or': [Array] } ] }

  const academicSemisterSearchAbleField = ["location"];
  if (searchTerm) { 
    andConditions.push({
      $or: academicSemisterSearchAbleField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }



  */
  const whereConditons =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await AcademicSemester.find(whereConditons)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
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
// for getSingleSemister
const getSingleSemester = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findById(id);
  return result;
};
const deleteSemester = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findByIdAndDelete(id);
  return result;
};
// for update
const updateSemester = async (
  id: string,
  payload: Partial<IAcademicSemester>
): Promise<IAcademicSemester | null> => {
  logger.info(
    'from service ========================================================================================'
  );

  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterService = {
  createSemester,
  getAllSemister,
  getSingleSemester,
  updateSemester,
  deleteSemester,
};
