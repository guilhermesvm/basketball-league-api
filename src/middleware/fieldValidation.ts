import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";

export function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const errors = await validate(plainToInstance(type, req.body));
        if (errors.length > 0) {
            res.status(400).json(errors);
        } else {
            next();
        }
    };
}
