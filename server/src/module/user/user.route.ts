import express from 'express'
import authController from './user.controller'
const router = express.Router();
import { authorize } from '../../middleware/authorize.middleware';
import { Role } from '@prisma/client';
import validationMiddleware from '../../middleware/validation.middleware';
import { LoginSchema, SignupSchema } from '../../validation/user.validation';
import { authenticate } from '../../middleware/authMiddleware';

router.post('/signup', validationMiddleware(SignupSchema), authController.signup);
router.post('/login', validationMiddleware(LoginSchema), authController.login);
// router.get('/all-users',authenticate, authorize([Role.ADMIN]), authController.allUsers);

export default router;
