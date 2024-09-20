import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

export class HealthController {
    get = async(req: Request, res: Response): Promise<void> => {
        res.status(200).json({message: "Success."});
    }
}