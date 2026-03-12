import { Role } from "@prisma/client";
import { NextFunction, Response } from "express";

import throwError from "../utils/error";
import httpStatus from "http-status";

export const authorize = (roles: Role[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throwError("Unauthorized", httpStatus.UNAUTHORIZED);
        }

        if (!roles.includes(req.user!.role)) {
            throwError("Forbidden - Insufficient permissions", httpStatus.FORBIDDEN);
        }

        next();
    };
};