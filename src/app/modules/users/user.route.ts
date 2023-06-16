import express from 'express';
import userController from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodScheme),
  userController.createUser
);

export const UserRoute = router;
