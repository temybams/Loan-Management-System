import { z } from "zod";
import { LoanStatus } from "@prisma/client";

export const CreateloanSchema = z.object({
  amount: z.number().positive(),
  tenureMonths: z.number().int().positive(),
});

export const UpdateLoanStatusSchema = z.object({
  status: z.enum(LoanStatus),
});


export const ProcessLoanSchema = z.object({
  loanId: z.uuid(),
  amount: z.number().positive(),
});

