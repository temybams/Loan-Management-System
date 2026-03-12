import { Request, Response, NextFunction } from "express";
// import { AuthRequest } from "../types/request.types";
import JWTService from "../services/jwtServices";
import throwError from "../utils/error";
import httpStatus from "http-status";
import { JwtPayload } from "../types/jwt.types";

export const authenticate = (
    req: Request,
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

        const decoded = JWTService.verify(token) as JwtPayload;

        if (!decoded) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED);
        }

        req.user = {
            id: decoded.id,
            role: decoded.role,
        }; 

        next();
    } catch (error) {
        next(error);
    }
};