import { Request, Response, NextFunction } from "express";
import { appDataSource } from "../data-source";
import PlayerRepository from "../repositories/playerRepository";
import PositionRepository from "../repositories/positionRepository";

export class PlayerController {
    private playerRepository: PlayerRepository;

    constructor() {
        this.playerRepository = new PlayerRepository(appDataSource);
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const players = await this.playerRepository.getAll();
            
            const formattedPlayers = players.map(({ id, name, birthDate, height, weight, number, nacionality, positions}) => ({
                id,
                name,
                birthDate: birthDate ? new Date(birthDate).toISOString().split('T')[0] : null,
                height,
                weight,
                number,
                nacionality,
                positions : positions ? positions.map(pos => ({ abbreviation: pos.abbreviation})) : []
            }));
            res.status(200).json({ totalPlayers: formattedPlayers.length, players: formattedPlayers });
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playerId = parseInt(req.params.id, 10);
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
            const newPlayer = await this.playerRepository.create(body);

            res.status(201).json({ message: "Player was successfully added.", player: newPlayer });
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body;
            const playerId = parseInt(req.params.id, 10);
            if (isNaN(playerId)) {
                res.status(400).json({ message: "Invalid player ID." });
                return;
            }

            const updatedPlayer = await this.playerRepository.update(playerId, body);
            if (!updatedPlayer) {
                res.status(500).json({ message: "Failed to update player." });
                return;
            }
            res.status(200).json({ message: "Player was successfully updated.", player: updatedPlayer });
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playerId = parseInt(req.params.id, 10);
            if (isNaN(playerId)) {
                res.status(400).json({ message: "Invalid Player ID." });
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

    insertPosition = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playerId = parseInt(req.params.id, 10);
            const positionsIds = req.body.positions
            if(isNaN(playerId)){
                res.status(400).json({message: "Invalid Player ID."});
                return;
            }

            if(!positionsIds || !Array.isArray(positionsIds) || positionsIds.some(id => isNaN(id))){
                res.status(400).json({message: "Invalid Position(s) ID(s)."});
                return;
            }

            const player = await this.playerRepository.getById(playerId);
            if(!player){
                res.status(404).json({message: "Player not found."});
                return;
            }

            if(positionsIds.length > 5){
                res.status(400).json({message: "Player can't have more than five positions"});
                return;
            }

            const positionRepository: PositionRepository = new PositionRepository(appDataSource);
            const positions = await positionRepository.getBy(positionsIds)
            if(!positions || positions.length !== positionsIds.length){
                res.status(404).json({message: "One or more Positions were not found"});
                return;
            }

            /*AI CODE to add new positions to the player, avoiding duplicates*/
            const existingPositionIds = player.positions?.map(pos => pos.id) || [];
            const newPositions = positions.filter(pos => !existingPositionIds.includes(pos.id));
            if (newPositions.length === 0) {
                res.status(200).json({ message: "No new positions were added. All positions are already assigned.", player });
                return;
            }
    
            player.positions = [...(player.positions || []), ...newPositions];
            /*AI CODE to add new positions to the player, avoiding duplicates*/

            const updatedPlayer = await this.playerRepository.save(player);
            if (!updatedPlayer) {
                res.status(500).json({ message: "Failed to update player positions." });
                return;
            }

            res.status(200).json({ message: "Positions added successfully.", player: updatedPlayer });
        } catch (error) {
            next(error);
        }
    }

    removePositionFromPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const playerId = parseInt(req.params.id, 10);
            const positionId = parseInt(req.params.positionId, 10);

            if(isNaN(playerId) || isNaN(positionId)){
                res.status(400).json({message: "Invalid Player or Position IDs."});
                return;
            }

            const positionRepository: PositionRepository = new PositionRepository(appDataSource);
            const existingPosition = await positionRepository.getById(positionId);
            const player = await this.playerRepository.getById(playerId);
            if(!player || !existingPosition){
                res.status(404).json({message: "Player or Position were not found."});
                return;
            }

            const isPositionAssigned = player.positions?.some(position => position.id === positionId);
            if(!isPositionAssigned){
                res.status(400).json({ message: "Position is not assigned to this player." });
                return;
            }

            player.positions = player.positions?.filter(position => position.id !== positionId);

            const updatedPlayer = await this.playerRepository.save(player);
            if (!updatedPlayer) {
                res.status(500).json({ message: "Failed to update player." });
                return;
            }

            res.status(200).json({ message: "Position removed successfully.", player: updatedPlayer });
        } catch (error) {
            next(error) ;
        }
    }
}
