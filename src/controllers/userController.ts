import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../data-source";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcryptjs"

export class UserController {
    private userRepository: UserRepository

    constructor(){
        this.userRepository = new UserRepository(appDataSource)
    }

    getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userRepository.getAll();
            const formattedUsers = users.map(({id, name, email}) => ({
                id,
                name,
                email
            }));

            res.status(200).json({totalUsers: formattedUsers.length, users: formattedUsers})
            
        } catch (error) {
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

            const user = await this.userRepository.getById(userId)
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
            
            const existingUser = await this.userRepository.getByEmail(email.toLowerCase());
            if(existingUser){
                res.status(400).json({message: "Email already in use"});
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 3);

            const newUser = await this.userRepository.create({
                name: name,
                email: email,
                password: hashedPassword
            });

            res.status(201).json({message: "User added", user: newUser});
        } catch (error) {
            next(error);
        }
    }

    update = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id);
            if(isNaN(userId)){
                res.status(400).json({message: "Invalid user ID."});
                return;
            }

            const user = await this.userRepository.getById(userId);
            if(!user){
                res.status(400).json({message: "User not found"});
                return;
            }

            const { email, ...otherData } = req.body;

            if(email && email.toLowerCase() !== user.email?.toLowerCase()){
                const existingUser = await this.userRepository.getByEmail(email.toLowerCase());
                if(existingUser){
                    res.status(400).json({message: "Email already in use"});
                    return;
                }
            }

            const updatedUser = await this.userRepository.update(userId, req.body);
            if(!updatedUser){
                res.status(404).json({message: "User not found."});
                return;
            }

            res.status(200).json({message: "User was successfully updated", user: updatedUser});
        } catch (error) {
            next(error);
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id);
            if(isNaN(userId)){
                res.status(400).json({message: "Invalid user ID."});
                return;
            }

            const success = await this.userRepository.delete(userId);
            if(!success){
                res.status(404).json({message: "User not found."});
                return;
            }

            res.status(200).json({message: "User was successfully deleted. | Nothing was deleted."})
        } catch (error) {
            next(error)
        }
    }
}