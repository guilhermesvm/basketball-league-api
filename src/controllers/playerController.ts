import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import PlayerRepository from "../repositories/playerRepository";

export class PlayerController {
    private playerRepository: PlayerRepository;

    constructor() {
        this.playerRepository = new PlayerRepository(AppDataSource);
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const players = await this.playerRepository.getAll();
            
            const formattedPlayers = players.map(({ id, name, birthDate, height, weight, number, nacionality, draftYear, draftRound, draftPick, team, positions }) => ({
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
                team,
                positions
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
                team,
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

            const newPlayer = await this.playerRepository.create(body);
            res.status(201).json({ message: "Player was successfully added.", player: newPlayer });
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playerId = parseInt(req.params.id);
            if (isNaN(playerId)) {
                res.status(400).json({ message: "Invalid player ID." });
                return;
            }

            const updatedPlayer = await this.playerRepository.update(playerId, req.body);
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
            res.status(200).json({ message: "Player was successfully deleted." });
        } catch (error) {
            next(error);
        }
    }
}
