import express from 'express';
import { UserRoute } from '../app/modules/users/user.route';
import { AcademicSemesterRoute } from '../app/modules/academicSemester/academicSemester.route';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
