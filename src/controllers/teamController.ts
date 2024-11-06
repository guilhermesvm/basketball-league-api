import { Request, Response, NextFunction } from "express";
import { appDataSource } from "../data-source";
import TeamRepository from "../repositories/teamRepository"

export class TeamController {
    private teamRepository: TeamRepository;

    constructor() {
        this.teamRepository = new TeamRepository(appDataSource);
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const teams = await this.teamRepository.getAll();

            const formattedTeams = teams.map(({ id, name, creationDate, city, coach, retiredNumbers, roster }) => ({
                id,
                name,
                creationDate: creationDate ? new Date(creationDate).toISOString().split('T')[0] : null,
                city,
                coach,
                retiredNumbers,
                roster: roster,
            }));

            res.status(200).json({ totalTeams: formattedTeams.length, teams: formattedTeams });
        } catch (error) {
            console.error(error);
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
                roster: roster,
            };

            res.status(200).json({ team: formattedTeam });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name } = req.body;

            const existingTeam = await this.teamRepository.getByName(name)
            if(existingTeam){
                res.status(400).json({message: "Teams must not have the same name."});
                return;
            }

            const newTeam = await this.teamRepository.create(req.body);
            res.status(201).json({ message: "Team was successfully added.", team: newTeam });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const teamId = parseInt(req.params.id);
            if (isNaN(teamId)) {
                res.status(400).json({ message: "Invalid team ID." });
                return;
            }

            const updatedTeam = await this.teamRepository.update(teamId, req.body);
            if (!updatedTeam) {
                res.status(404).json({ message: "Team not found." });
                return;
            }
            res.status(200).json({ message: "Team was successfully updated.", team: updatedTeam });
        } catch (error) {
            console.error(error);
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
            console.error(error);
            next(error);
        }
    }
}
