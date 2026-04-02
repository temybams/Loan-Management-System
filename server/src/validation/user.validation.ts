import { Role } from "@prisma/client";
import { z } from "zod";;


export const SignupSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
        .trim(),

    email: z
        .email("Invalid email address")
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),

    fullName: z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .trim(),

    dateOfBirth: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }),

    phoneNumber: z
        .string()
        .min(7, "Phone number is too short")
        .max(15, "Phone number is too long")
        .regex(/^\+234\d{10}$/, "Phone number must be in format +234XXXXXXXXXX"),

    street: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    country: z.string().trim().optional(),
    role: z.enum(["BORROWER", "ADMIN"]).optional(),

});

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});