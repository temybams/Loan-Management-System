import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.types";

const JWTService = {
  sign: (payload: JwtPayload, options?: SignOptions): string => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
      ...options,
    });
  },

  verify: (token: string): JwtPayload => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded as JwtPayload;
  },
};

export default JWTService;