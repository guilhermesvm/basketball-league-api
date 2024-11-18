import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

class Authentication {
    async hasAuthentication(req: Request, res: Response, next: () => void){
        const bearerHeader = req.headers.authorization;
        if(!bearerHeader){
            return res.status(403).json({message: "Token must be sent."});
        }

        const token = bearerHeader?.split(' ')[1];
        jwt.verify(token!, process.env.TOKEN_KEY!, function(err: any, decoded: any){
            if(err){
                return res.status(501).json({
                    auth: false,
                    message: "Failed to authenticate token",
                    error: err
                });
            }
            req.params.token = token!;
            next();
        });
    }
}

export default new Authentication();