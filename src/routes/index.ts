import express from 'express';
import { UserRoutes } from '../app/modules/users/user.route';
import { AcademicSemesterRoute } from '../app/modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../app/modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../app/modules/academicDepartment/academicDepartment.routes';
import { StudentRoutes } from '../app/modules/student/student.route';
import { AuthRoute } from '../app/modules/auth/auth.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/auth',
    route: AuthRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
