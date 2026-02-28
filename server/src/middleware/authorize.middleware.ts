import { Role } from "@prisma/client";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/request.types";
import throwError from "../utils/error";
import httpStatus from "http-status";

export const authorize = (roles: Role[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throwError("Unauthorized", httpStatus.UNAUTHORIZED);
        }

        if (!roles.includes(req.user!.role)) {
            throwError("Forbidden - Insufficient permissions", httpStatus.FORBIDDEN);
        }

        next();
    };
};