import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../data-source";
import PositionRepository from "../repositories/positionRepository";

export default class PositionController {
    private positionRepository: PositionRepository;

    constructor(){
        this.positionRepository = new PositionRepository(appDataSource);
    }

    getAll = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const positions = await this.positionRepository.getAll();
            const formattedPositions = positions.map(({ id, name, abbreviation}) => ({
                id,
                name,
                abbreviation
            }));

            res.status(200).json({totalPositions: formattedPositions.length, positions: formattedPositions});
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    getById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const positionId = parseInt(req.params.id);
            if(isNaN(positionId)){
                res.status(400).json({message: "Invalid position ID."});
                return;
            }

            const position = await this.positionRepository.getById(positionId);
            if(!position){
                res.status(404).json({message: "Position not found."});
                return;
            }

            const { id, name, abbreviation } = position;
            const formattedPosition = {
                id,
                name,
                abbreviation
            };

            res.status(200).json({position: formattedPosition});
        } catch (error) {
            console.error(error);
            next(error);
            
        }
    }
}