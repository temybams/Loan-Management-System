import { prisma } from "../../services/prisma.service";
import { CreateLoanDto, UpdateLoanStatusDto, ProcessLoanDto } from "../../dto/loan.dto";
import { LoanStatus, RepaymentStatus } from "@prisma/client";
import throwError from "../../utils/error";
import httpStatus from "http-status";
import { tr } from "zod/v4/locales";


export const LoanService = {

    createloan: async (userId: string, dto: CreateLoanDto) => {

        const { amount, interestRate, tenureMonths } = dto;

        const totalAmount = amount + (amount * interestRate) / 100;

        const weeklyAmount = totalAmount / tenureMonths;

        const repaymentSchedules = [];
        let currentDate = new Date();

        for (let i = 0; i < tenureMonths; i++) {
            repaymentSchedules.push({
                dueDate: new Date(currentDate),
                amount: weeklyAmount,
                status: RepaymentStatus.PENDING,
            });

            const dueDate = new Date(currentDate);

            dueDate.setDate(currentDate.getDate() + 7);

        };

        const loan = await prisma.loan.create({
            data: {
                userId,
                amount,
                interestRate,
                tenureMonths,
                status: LoanStatus.PENDING,
                repaymentSchedules: {
                    create: repaymentSchedules,
                },
            },
            include: {
                repaymentSchedules: true,
            },
        })

        return loan;

    },

    getUserLoans: async (userId: string) => {
        const loans = await prisma.loan.findMany({
            where: { userId },
            include: {
                payments: true,
            },
        });

        return loans.map((loan) => {
            const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);

            const totalLoanAmount = loan.amount + (loan.amount * loan.interestRate) / 100;

            return {
                loanId: loan.id,
                amount: loan.amount,
                status: loan.status,
                totalAmount: totalLoanAmount,
                amountLeft: totalLoanAmount - totalPaid,
            }
        })
    },
    getLoanDetails: async (userId: string, loanId: string) => {
        const loan = await prisma.loan.findFirst({
            where: { id: loanId, userId },
            include: {
                payments: true,
                repaymentSchedules: true,
            },
        });

        if (!loan) {
            throwError("Loan not found", httpStatus.NOT_FOUND);
        }

        return loan;
    },

    processRepayment: async (userId: string, dto: ProcessLoanDto) => {
        const { loanId, amount } = dto;

        return await prisma.$transaction(async (tx) => {

            const loan = await tx.loan.findFirst({
                where: { id: loanId, userId },
                include: {
                    repaymentSchedules: {
                        orderBy: { dueDate: "asc" },
                    },
                },
            });

            if (!loan) {
                throwError("Loan not found", httpStatus.NOT_FOUND);
                return;
            }

            if (loan.status === "PAID") {
                throwError("Loan already paid", httpStatus.BAD_REQUEST);

            }

            let remainingAmount = amount;
            const updates: Promise<any>[] = [];

            for (const schedule of loan.repaymentSchedules) {

                if (
                    schedule.status === "PENDING" ||
                    schedule.status === "PARTIALLY_PAID"
                ) {

                    if (remainingAmount >= schedule.amount) {
                        remainingAmount -= schedule.amount;

                        updates.push(
                            tx.repaymentSchedule.update({
                                where: { id: schedule.id },
                                data: {
                                    amount: 0,
                                    status: "PAID",
                                },
                            })
                        );

                    } else if (remainingAmount > 0) {

                        updates.push(
                            tx.repaymentSchedule.update({
                                where: { id: schedule.id },
                                data: {
                                    amount: schedule.amount - remainingAmount,
                                    status: "PARTIALLY_PAID",
                                },
                            })
                        );

                        remainingAmount = 0;
                        break;
                    }
                }
            }

            await Promise.all(updates);

            const remainingSchedules = await tx.repaymentSchedule.count({
                where: {
                    loanId,
                    status: {
                        not: "PAID",
                    },
                },
            });

            if (remainingSchedules === 0) {
                await tx.loan.update({
                    where: { id: loanId },
                    data: { status: "PAID" },
                });
            }

            await tx.payment.create({
                data: {
                    loanId,
                    userId,
                    amount,
                },
            });

            return {
                message: "Repayment processed successfully",
            };
        });
    },

    updateLoanStatus: async (loanId: string, dto: UpdateLoanStatusDto) => {
        return prisma.loan.update({
            where: { id: loanId },
            data: {
                status: dto.status,
                approvedAt:
                    dto.status === LoanStatus.APPROVED ? new Date() : undefined,
            },
        });
    },

    getAllLoans: async () => {
        return prisma.loan.findMany({
            include: {
                user: true,
                payments: true,
            },
        });
    },

    getLoanSchedules: async (loanId: string, userId: string) => {
        const loan = await prisma.loan.findFirst({
            where: { id: loanId, userId },
            include: {
                repaymentSchedules: {
                    orderBy: { dueDate: "asc" },
                },
                payments: true,
            },
        });

        if (!loan) {
            throwError("Loan not found", httpStatus.NOT_FOUND);
            return;
        }

        const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);

        const totalLoanAmount = loan.repaymentSchedules.reduce((sum, r) => sum + r.amount, 0);


        const amountRemaining = totalLoanAmount - totalPaid;
        return {
            loanId: loan.id,
            amount: loan.amount,
            interestRate: loan.interestRate,
            tenureMonths: loan.tenureMonths,
            status: loan.status,
            totalAmount: totalLoanAmount,
            amountPaid: totalPaid,
            amountRemaining,
            repaymentSchedules: loan.repaymentSchedules
        };
    }
};