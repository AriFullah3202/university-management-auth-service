import z from 'zod';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';

const createAcademicZodScheme = z.object({
  body: z.object({
    title: z.enum([...academicSemesterTitles] as [string, ...string[]], {
      required_error: 'role is required',
    }),
    year: z.number({ required_error: 'year is required' }),
    code: z.enum([...academicSemesterCodes] as [string, ...string[]], {
      required_error: 'code is required',
    }),
    startMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'startMonth is required',
    }),
    endMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'endMonth is required',
    }),
  }),
});
//await createUserZodSchema.parseAsync(req)
export const AcademicSemesterValidation = {
  createAcademicZodScheme,
};
