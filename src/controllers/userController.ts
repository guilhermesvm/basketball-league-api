import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../data-source";
import { UserRepository } from "../repositories/userRepository";

export class UserController {
    private repository: UserRepository

    constructor(){
        this.repository = new UserRepository(appDataSource)
    }

    getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.repository.getAll();
            const formattedUsers = users.map(({id, name, email}) => ({
                id,
                name,
                email
            }));

            res.status(200).json({totalUsers: formattedUsers.length, users: formattedUsers})
            
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = parseInt(req.params.id)
            if(isNaN(userId)){
                res.status(400).json({message: "Invalid user ID."});
                return;
            }

            const user = await this.repository.getById(userId)
            if(!user){
                res.status(404).json({message: "User not found."});
                return;
            }

            const {id, name, email} = user;
            const formattedUser = {
                id, name, email
            };

            res.status(200).json({user: formattedUser});
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            let {name, email, password} = req.body;
            if(!name || !email || !password){
                res.status(400).json({message: "All user data is required."});
                return;
            }
            
            const existingUser = await this.repository.getByEmail(email.To)
            
        } catch (error) {
            
        }
    }
}