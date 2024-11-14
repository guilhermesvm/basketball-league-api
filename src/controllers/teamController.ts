import { Request, Response, NextFunction } from "express";
import { appDataSource } from "../data-source";
import TeamRepository from "../repositories/teamRepository"
import PlayerRepository from "../repositories/playerRepository";

export class TeamController {
    private teamRepository: TeamRepository;

    constructor() {
        this.teamRepository = new TeamRepository(appDataSource);
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const teams = await this.teamRepository.getAll();

            const formattedTeams = teams.map(({ id, name, creationDate, city, coach}) => ({
                id,
                name,
                city,
                coach,
                creationDate: creationDate ? new Date(creationDate).toISOString().split('T')[0] : null,
            }));

            res.status(200).json({ totalTeams: formattedTeams.length, teams: formattedTeams });
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const teamId = parseInt(req.params.id);
            if (isNaN(teamId)) {
                res.status(400).json({ message: "Invalid team ID." });
                return; 
            }

            const team = await this.teamRepository.getById(teamId);
            if (!team) {
                res.status(404).json({ message: "Team not found." });
                return;
            }

            const { id, name, creationDate, city, coach, retiredNumbers, roster: roster } = team;
            const formattedTeam = {
                id,
                name,
                creationDate: creationDate ? new Date(creationDate).toISOString().split('T')[0] : null,
                city,
                coach,
                retiredNumbers,
                roster: roster ? roster.map(player => ({ name: player.name, number: player.number })) : [],
            };

            res.status(200).json({ team: formattedTeam });
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body;
            const name = req.body.name;

            const existingTeam = await this.teamRepository.getByName(name)
            if(existingTeam){
                res.status(400).json({message: "Teams must not have the same name."});
                return;
            }

            const playersId = req.body.roster;
            if(playersId && Array.isArray(playersId)){
                const playerRepository: PlayerRepository = new PlayerRepository(appDataSource);
                const players = await playerRepository.getBy(playersId);
                if(!players || players.length !== playersId.length){
                    res.status(400).json({ message: "Some players could not be found." });
                    return;
                }
                body.roster = players;
            }

            const newTeam = await this.teamRepository.create(body);
            res.status(201).json({ message: "Team was successfully added.", team: newTeam });
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body;
            const teamId = parseInt(req.params.id);
            if (isNaN(teamId)) {
                res.status(400).json({ message: "Invalid team ID." });
                return;
            }

            const name = req.body.name;
            const existingTeam = await this.teamRepository.getByName(name)
            if (existingTeam && existingTeam.id !== teamId) {
                res.status(400).json({ message: "Teams must not have the same name." });
                return;
            }

            const playersId = req.body.roster;
            if(playersId && Array.isArray(playersId)){
                const playerRepository: PlayerRepository = new PlayerRepository(appDataSource);
                const players = await playerRepository.getBy(playersId);
                if(!players || playersId.length !== players.length){
                    res.status(400).json({ message: "Some players could not be found." });
                    return;
                }
                body.roster = players;
            }

            const updatedTeam = await this.teamRepository.update(teamId, req.body);
            if (!updatedTeam) {
                res.status(404).json({ message: "Team not found." });
                return;
            }
            res.status(200).json({ message: "Team was successfully updated.", team: updatedTeam });
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const teamId = parseInt(req.params.id);
            if (isNaN(teamId)) {
                res.status(400).json({ message: "Invalid team ID." });
                return;
            }

            const result = await this.teamRepository.delete(teamId);
            if (!result) {
                res.status(404).json({ message: "Team not found." });
                return;
            }
            res.status(200).json({ message: "Team was successfully deleted. | Nothing was deleted." });
        } catch (error) {
            next(error);
        }
    }

    removePlayerFromTeam = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const teamId = parseInt(req.params.id, 10);
            const playerId = parseInt(req.params.playerId, 10);
            if(isNaN(teamId) || isNaN(playerId)){
                res.status(400).json({message: "Invalid Team or Player IDs."});
                return;
            }

            const team = await this.teamRepository.getById(teamId);
            if(!team ){
                res.status(404).json({message: "Team not found."});
                return;
            }

            const playerRepository: PlayerRepository = new PlayerRepository(appDataSource);
            const existingPlayer = await playerRepository.getById(playerId);
            if(!existingPlayer){
                res.status(404).json({message: "Player not found."});
                return;
            }

            const isPlayerAssigned = team.roster?.some(player => player.id === playerId);
            if(!isPlayerAssigned){
                res.status(400).json({message: "Player is not assigened to this team."});
                return;
            }

            team.roster = team.roster?.filter(player => player.id !== playerId);

            const updatedTeam = await this.teamRepository.save(team);
            if(!updatedTeam){
                res.status(500).json({ message: "Failed to update team roster." });
                return;
            }

            res.status(200).json({message: "Player removed successfully.", team: updatedTeam});
        } catch (error) {
            next(error);
        }
    }
}
