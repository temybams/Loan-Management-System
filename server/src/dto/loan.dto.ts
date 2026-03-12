import { z } from "zod";
import { CreateloanSchema, UpdateLoanStatusSchema, ProcessLoanSchema } from "../validation/loan.validation";

export type CreateLoanDto = z.infer<typeof CreateloanSchema>;
export type UpdateLoanStatusDto = z.infer<typeof UpdateLoanStatusSchema>;
export type ProcessLoanDto = z.infer<typeof ProcessLoanSchema>;