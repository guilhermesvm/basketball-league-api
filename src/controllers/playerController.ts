import { Request, Response, NextFunction } from "express";
import { appDataSource } from "../data-source";
import PlayerRepository from "../repositories/playerRepository";
import PositionRepository from "../repositories/positionRepository";
import Player from "../entities/Player";

export class PlayerController {
    private playerRepository: PlayerRepository;

    constructor() {
        this.playerRepository = new PlayerRepository(appDataSource);
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const players = await this.playerRepository.getAll();
            
            const formattedPlayers = players.map(({ id, name, birthDate, height, weight, number, nacionality, draftYear, draftRound, draftPick}) => ({
                id,
                name,
                birthDate: birthDate ? new Date(birthDate).toISOString().split('T')[0] : null,
                height,
                weight,
                number,
                nacionality,
                draftYear,
                draftRound,
                draftPick,
            }));
            res.status(200).json({ totalPlayers: formattedPlayers.length, players: formattedPlayers });
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playerId = parseInt(req.params.id);
            if (isNaN(playerId)) {
                res.status(400).json({ message: "Invalid player ID." });
                return;
            }

            const player = await this.playerRepository.getById(playerId);
            if (!player) {
                res.status(404).json({ message: "Player not found." });
                return;
            }

            const { id, name, birthDate, height, weight, number, nacionality, draftYear, draftRound, draftPick, team, positions } = player;
            const formattedPlayer = {
                id,
                name,
                birthDate: birthDate ? new Date(birthDate).toISOString().split('T')[0] : null,
                height,
                weight,
                number,
                nacionality,
                draftYear,
                draftRound,
                draftPick,
                team: team ? { id: team.id, name: team.name } : null,
                positions 
            };

            res.status(200).json({ player: formattedPlayer });
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body;
            const positionsId = req.body.positions;

            if(positionsId && Array.isArray(positionsId)){
                const positionRepository: PositionRepository = new PositionRepository(appDataSource);
                const positions = await positionRepository.getBy(positionsId);
                if(positions && positions.length > 5){
                    res.status(400).json({message: "Player can't have more than five positions."});
                    return;
                }
                body.positions = positions;
            }

            const newPlayer = await this.playerRepository.create(body);
            res.status(201).json({ message: "Player was successfully added.", player: newPlayer });
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body;
            const playerId = parseInt(req.params.id);
            if (isNaN(playerId)) {
                res.status(400).json({ message: "Invalid player ID." });
                return;
            }

            const positionsId = req.body.positions;
            if(positionsId && Array.isArray(positionsId)){
                const positionRepository: PositionRepository = new PositionRepository(appDataSource);
                const positions = await positionRepository.getBy(positionsId);
                if(positions && positions.length > 5){
                    res.status(400).json({message: "Player can't have more than five positions."});
                    return;
                }
                body.positions = positions;
            }
            
            const updatedPlayer = await this.playerRepository.update(playerId, body);
            if (!updatedPlayer) {
                res.status(404).json({ message: "Player not found." });
                return;
            }
            res.status(200).json({ message: "Player was successfully updated.", player: updatedPlayer });
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playerId = parseInt(req.params.id);
            if (isNaN(playerId)) {
                res.status(400).json({ message: "Invalid player ID." });
                return;
            }

            const result = await this.playerRepository.delete(playerId);
            if (!result) {
                res.status(404).json({ message: "Player not found." });
                return;
            }
            res.status(200).json({ message: "Player was successfully deleted | Nothing was deleted." });
        } catch (error) {
            next(error);
        }
    }
}
