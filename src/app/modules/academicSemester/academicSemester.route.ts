import express from 'express';
import { AcademicSemesterValidation } from './ac;ademicSemester.validation';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';

const router = express.Router();

router.post(
  '/create-semester',
  validateRequest(AcademicSemesterValidation.createAcademicZodScheme),
  AcademicSemesterController.createSemester
);

export const AcademicSemesterRoute = router;
