import express from 'express'
import LoanController from './loan.controller'
import { authorize } from '../../middleware/authorize.middleware';
import { Role } from '@prisma/client';
import validationMiddleware from '../../middleware/validation.middleware';
import { CreateloanSchema, UpdateLoanStatusSchema, ProcessLoanSchema } from '../../validation/loan.validation';
import { authenticate } from '../../middleware/authMiddleware';


const router = express.Router();

//Borrower routes

router.use(authenticate);
router.post("/apply", authorize([Role.BORROWER]), validationMiddleware(CreateloanSchema), LoanController.createloan);
router.get("/my-loans", authorize([Role.BORROWER]), LoanController.getUserLoans);
router.get("/:loanId", authorize([Role.BORROWER]), LoanController.getLoanDetails);
router.post("/repay", authorize([Role.BORROWER]), validationMiddleware(ProcessLoanSchema), LoanController.processRepayment);
router.get("/:loanId/schedule", authorize([Role.BORROWER]), LoanController.getloanSchedules);


//Admin routes
router.get("/", authorize([Role.ADMIN]), LoanController.getAllLoans);

export default router;