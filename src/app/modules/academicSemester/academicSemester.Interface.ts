import { Model } from 'mongoose';

export type IAcademicSemesterMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';
export type IAcademicSemesterTitles = 'Autumn' | 'Summer' | 'Fall';
export type IAcademicSemesterCodes = '01' | '02' | '03';

export type IAcademicSemester = {
  title: IAcademicSemesterTitles;
  year: string | undefined;
  code: IAcademicSemesterCodes | undefined;
  startMonth: IAcademicSemesterMonths;
  endMonth: IAcademicSemesterMonths;
};
export type AcademicSemesterModel = Model<IAcademicSemester>;
export type IAcademicSemesterFilter = {
  searchTerm?: string;
};
