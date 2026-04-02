import express from 'express'
import LoanController from './loan.controller'
import { authorize } from '../../middleware/authorize.middleware';
import { Role } from '@prisma/client';
import validationMiddleware from '../../middleware/validation.middleware';
import { CreateloanSchema, UpdateLoanStatusSchema, ProcessLoanSchema } from '../../validation/loan.validation';
import { authenticate } from '../../middleware/authMiddleware';


const router = express.Router();

router.use(authenticate);

//Borrower routes
router.get("/admin", authorize([Role.ADMIN]), LoanController.getAllLoans);
router.post("/apply", authorize([Role.BORROWER]), validationMiddleware(CreateloanSchema), LoanController.createloan);
router.post("/repay", authorize([Role.BORROWER]), validationMiddleware(ProcessLoanSchema), LoanController.processRepayment);
router.get("/my-loans", authorize([Role.BORROWER]), LoanController.getUserLoans);
router.get("/:loanId/schedule", authorize([Role.BORROWER]), LoanController.getloanSchedules);
router.get("/:loanId/summary", authorize([Role.BORROWER]), LoanController.getLoanSummary);
router.get("/:loanId", authorize([Role.BORROWER]), LoanController.getLoanDetails);

//Admin routes

router.patch("/admin/:loanId", authorize([Role.ADMIN]), validationMiddleware(UpdateLoanStatusSchema), LoanController.updateLoanStatus);

export default router;