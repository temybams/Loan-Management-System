import { Request, Response } from "express";
import catchAsync from "../../middleware/catchasync.middleware";
import { CreateLoanDto, UpdateLoanStatusDto, ProcessLoanDto } from "../../dto/loan.dto";
import { LoanService } from "./loan.service";

const LoanController = {
    createloan: catchAsync(async (req: Request, res: Response) => {
        const dto: CreateLoanDto = req.body;
        const userId = req.user!.id;
        const loan = await LoanService.createloan(userId, dto);
        res.status(201).json({
            success: true,
            message: "Loan created successfully",
            data: loan,
        });
    }),

    getUserLoans: catchAsync(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const loans = await LoanService.getUserLoans(userId);
        res.status(200).json({
            success: true,
            message: "Loans retrieved successfully",
            data: loans,
        });
    }),

    getLoanDetails: catchAsync(async (req: Request, res: Response) => {
        const { loanId } = req.params as { loanId: string };
        const userId = req.user!.id;
        const loan = await LoanService.getLoanDetails(userId, loanId);
        res.status(200).json({
            success: true,
            message: "Loan details retrieved successfully",
            data: loan,
        });
    }),

    processRepayment: catchAsync(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const dto: ProcessLoanDto = req.body;

        const result = await LoanService.processRepayment(userId, dto);
        res.status(200).json({
            success: true,
            message: "Repayment processed successfully",
            data: result,
        })
    }),

    updateLoanStatus: catchAsync(async (req: Request, res: Response) => {
        const { loanId } = req.params as { loanId: string };
        
        const result = await LoanService.updateLoanStatus(loanId, req.body);

        res.status(200).json({
            success: true,
            data: result,
        });
    }),

    getAllLoans: catchAsync(async (req: Request, res: Response) => {
        const loans = await LoanService.getAllLoans();
        res.status(200).json({
            success: true,
            message: "Loans retrieved successfully",
            data: loans,
        })
    }),

    getloanSchedules: catchAsync(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const { loanId } = req.params as { loanId: string };

        const schedules = await LoanService.getLoanSchedules(loanId, userId);
        res.status(200).json({
            success: true,
            message: "Repayment schedules retrieved successfully",
            data: schedules,
        })
    }),

    getLoanSummary: catchAsync(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const { loanId } = req.params as { loanId: string };
        const summary = await LoanService.getLoanSummary(userId!, loanId);
        res.status(200).json({
            success: true,
            message: "Loan summary retrieved successfully",
            data: summary,
        })
    }),
}

export default LoanController;