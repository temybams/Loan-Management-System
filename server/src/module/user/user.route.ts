import express from 'express'
import authController from './user.controller'
import validationMiddleware from '../../middleware/validation.middleware';
import { LoginSchema, SignupSchema } from '../../validation/user.validation';
import { authenticate } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', validationMiddleware(SignupSchema), authController.signup);
router.post('/login', validationMiddleware(LoginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);
// router.get('/all-users',authenticate, authorize([Role.ADMIN]), authController.allUsers);

export default router;
