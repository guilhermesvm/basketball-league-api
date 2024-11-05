import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/http-error";

export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(error);

    if (error instanceof HttpError) {
        res.status(error.status).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
