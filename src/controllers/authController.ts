import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { appDataSource } from "../data-source";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export class AuthController {
    login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userRepository: UserRepository = new UserRepository(appDataSource);

        try {
            const {email, password} = req.body;
            if(!email || !password){
                res.status(400).json({message: "Credentials are required."});
                return;
            }

            const user = await userRepository.getByEmail(email);
            if(!user || !user.password){
                res.status(401).json({message: "Invalid credentials."});
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if(!isPasswordValid){
                res.status(401).json({message: "Invalid credentials."});
                return;
            }

            const token = jwt.sign({
                auth: true,
                email: email
            }, process.env.TOKEN_KEY!, {expiresIn: "24h"});

            res.status(200).json({
                message: "Logged in successfully.",
                auth: true,
                token: token,
                name: user.name,
                id: user.id
            });
            
        } catch (error) {
            next(error)
        }
    }
}
