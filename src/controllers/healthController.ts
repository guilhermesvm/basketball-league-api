import { Request, Response } from "express";

export class HealthController {
    health = async(req: Request, res: Response): Promise<void> => {
        const healthCheck = {
            message: "Success.",
            uptime: process.uptime(),
            timestamp: Date.now()
        };
        
        try {
            res.status(200).send(healthCheck)
        } catch (error: any) {
            healthCheck.message = error;
            res.status(503).send();
        }
    }
}