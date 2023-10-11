import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./error";
import jwt, { VerifyErrors } from "jsonwebtoken";

declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }

export const verifyUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'Unauthorized'))
    }

    if (!process.env.JWT_SECRET) {
        return next(errorHandler(500, "JWT_SECRET is not defined"));
      }

    jwt.verify(token, process.env.JWT_SECRET, (error: VerifyErrors | null, user: any) => {
        if (error) {
            return next(errorHandler(403, 'Forbidden'))
        }

        req.user = user;
        next();
    })

  }
