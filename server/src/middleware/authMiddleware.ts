import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.types";
import JWTService from "../services/jwtServices";
import throwError from "../utils/error";
import httpStatus from "http-status";

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;
        let type: string | undefined;
        [type, token] = req.headers.authorization?.split(' ') ?? [];

        if (!type || !token.startsWith("Bearer ")) {
            throwError("Unauthorized - No token provided", httpStatus.UNAUTHORIZED);
        }

        const decoded = JWTService.verify(token);

        if (!decoded) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED);
        }

        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
};