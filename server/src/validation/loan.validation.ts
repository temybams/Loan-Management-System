import { z } from "zod";

export const CreateloanSchema = z.object({
    amount: z.number().positive(),
    interestRate: z.number().positive(),
    tenureMonths: z.number().int().positive(),
});

export const ApproveLoanDto = z.object({
  loanId: z.uuid(),
});