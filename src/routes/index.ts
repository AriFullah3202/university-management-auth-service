import express from 'express';
import { UserRoute } from '../app/modules/users/user.route';
import { AcademicSemesterRoute } from '../app/modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../app/modules/academicFaculty/academicFaculty.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
