import { prisma } from "../../services/prisma.service";
import { CreateLoanDto, UpdateLoanStatusDto, ProcessLoanDto } from "../../dto/loan.dto";
import { LoanStatus, RepaymentStatus } from "@prisma/client";
import throwError from "../../utils/error";
import httpStatus from "http-status";
import { NotificationService } from "../../services/notificationService";
import { calculateOutstanding } from "../../utils/loan";



export const LoanService = {

    createloan: async (userId: string, dto: CreateLoanDto) => {
        const { amount, tenureMonths } = dto;
        const interestRate = 10;
        const MAX_LOAN_LIMIT = 100000;

        // Get active loans
        const activeLoans = await prisma.loan.findMany({
            where: { userId, status: { not: "PAID" } },
            include: { payments: true },
        });

        const totalOutstanding = calculateOutstanding(activeLoans);

        const newLoanTotal =
            amount + (amount * interestRate) / 100;

        if (totalOutstanding + newLoanTotal > MAX_LOAN_LIMIT) {
            throwError(
                `Loan limit exceeded. Outstanding: ₦${totalOutstanding}`,
                httpStatus.BAD_REQUEST
            );
        }

        // Build repayment schedules
        const totalAmount = newLoanTotal;
        const weeklyAmount = totalAmount / tenureMonths;

        let currentDate = new Date();

        const repaymentSchedules = Array.from({ length: tenureMonths }).map(() => {
            const schedule = {
                dueDate: new Date(currentDate),
                amount: weeklyAmount,
                status: RepaymentStatus.PENDING,
            };

            currentDate.setDate(currentDate.getDate() + 7);
            return schedule;
        });

        const loan = await prisma.loan.create({
            data: {
                userId,
                amount,
                interestRate,
                tenureMonths,
                status: LoanStatus.PENDING,
                repaymentSchedules: { create: repaymentSchedules },
            },
            include: { repaymentSchedules: true },
        });

        // Notification
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (user) {
                await NotificationService.send({
                    user: {
                        id: user.id,
                        email: user.email,
                        phone: user.phoneNumber,
                        name: user.fullName,
                    },
                    type: "LOAN_CREATED",
                    data: { amount: Number(amount) },
                });
            }
        } catch (error) {
            console.error("Notification failed:", error);
        }

        return { loan, totalOutstanding };
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

        if (amount <= 0) {
            throwError("Payment amount must be greater than zero", httpStatus.BAD_REQUEST);
        }

        // Get loan with schedules
        const loan = await prisma.loan.findFirst({
            where: { id: loanId, userId },
            include: {
                repaymentSchedules: {
                    orderBy: { dueDate: "asc" }
                }
            }
        });

        if (!loan) {
            throwError("Loan not found", httpStatus.NOT_FOUND);
        }

        if (loan!.status === "PAID") {
            throwError("Loan already fully repaid", httpStatus.BAD_REQUEST);
        }

        // Calculate total loan amount with interest
        const totalLoanAmount =
            loan!.amount + (loan!.amount * loan!.interestRate) / 100;

        // Total already paid
        const paymentAgg = await prisma.payment.aggregate({
            where: { loanId },
            _sum: { amount: true }
        });

        const totalPaid = paymentAgg._sum.amount ?? 0;
        const remainingBalance = totalLoanAmount - totalPaid;

        if (amount > remainingBalance) {
            throwError(
                `Payment exceeds remaining balance. Remaining balance is ${remainingBalance}`,
                httpStatus.BAD_REQUEST
            );
        }



        // Build schedule updates
        const updates: any[] = [];
        let remainingAmount = amount;

        for (const schedule of loan!.repaymentSchedules) {
            if (remainingAmount <= 0) break;

            if (
                schedule.status === "PENDING" ||
                schedule.status === "PARTIALLY_PAID"
            ) {
                const scheduleAmount = schedule.amount;

                if (remainingAmount >= scheduleAmount) {
                    remainingAmount -= scheduleAmount;

                    updates.push(
                        prisma.repaymentSchedule.update({
                            where: { id: schedule.id },
                            data: {
                                amount: 0,
                                status: "PAID"
                            }
                        })
                    );

                } else {

                    updates.push(
                        prisma.repaymentSchedule.update({
                            where: { id: schedule.id },
                            data: {
                                amount: scheduleAmount - remainingAmount,
                                status: "PARTIALLY_PAID"
                            }
                        })
                    );

                    remainingAmount = 0;
                }
            }
        }

        // Run payment + updates in one transaction
        await prisma.$transaction([
            prisma.payment.create({
                data: {
                    loanId,
                    userId,
                    amount
                }
            }),
            ...updates
        ]);

        // ✅ Recalculate new balance AFTER payment
        const newTotalPaid = totalPaid + amount;
        const newBalance = totalLoanAmount - newTotalPaid;

        // Check if loan is fully paid
        const remainingSchedules = await prisma.repaymentSchedule.count({
            where: {
                loanId,
                status: { not: "PAID" }
            }
        });

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (user) {
                await NotificationService.send({
                    user: {
                        id: user.id,
                        email: user.email,
                        phone: user.phoneNumber,
                        name: user.fullName,
                    },
                    type: "REPAYMENT_SUCCESS",
                    data: {
                        amount,
                        balance: newBalance,
                    },
                });
            }
        } catch (error) {
            console.error("Notification failed:", error);
        }
        return {
            message: "Repayment processed successfully"
        };
    },

    // Admin functions

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
            where: { id: loanId },
            include: {
                repaymentSchedules: {
                    orderBy: { dueDate: "asc" },
                },
                payments: true,
            },
        });

        if (!loan) {
            throwError("Loan not found", httpStatus.NOT_FOUND);
        }

        const totalPaid = loan!.payments.reduce((sum, payment) => sum + payment.amount, 0);

        const totalLoanAmount = loan!.repaymentSchedules.reduce((sum, r) => sum + r.amount, 0);


        const amountRemaining = totalLoanAmount - totalPaid;


        return {
            loanId: loan!.id,
            interestRate: loan!.interestRate,
            tenureMonths: loan!.tenureMonths,
            status: loan!.status,
            totalAmount: totalLoanAmount,
            amountPaid: totalPaid,
            amountRemaining,
            repaymentSchedules: loan!.repaymentSchedules
        };
        console.log("Loan ID:", loanId, "User ID:", userId);
    },

    getLoanSummary: async (userId: string, loanId: string) => {
        const loan = await prisma.loan.findFirst({
            where: { id: loanId, userId },
            include: {
                payments: true,
                repaymentSchedules: {
                    orderBy: { dueDate: "asc" },

                },
            },
        });

        if (!loan) {
            return throwError("Loan not found", httpStatus.NOT_FOUND);
        }

        const totalLoanAmount = loan.amount + (loan.amount * loan.interestRate) / 100;

        const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);

        const remainingBalance = totalLoanAmount - totalPaid;

        const nextPayment = loan.repaymentSchedules.find(r => r.status !== RepaymentStatus.PAID);

        return {
            loanId: loan.id,
            status: loan.status,
            amountPaid: totalPaid,
            totalAmount: totalLoanAmount,
            remainingBalance,
            nextPaymentDueDate: nextPayment ? nextPayment.dueDate : null,
            nextPaymentAmount: nextPayment ? nextPayment.amount : null,
            amount: loan.amount,
            interestRate: loan.interestRate,
            tenureMonths: loan.tenureMonths,
        };
    },
}