import { DataSource, Repository } from "typeorm";
import TeamEntity from "../entities/Team";
import HttpError from "../errors/http-error";

class TeamRepository {
    private repository: Repository<TeamEntity>;

    constructor(dataSource: DataSource){
        this.repository = dataSource.getRepository(TeamEntity);
    }

    async getAll(): Promise<TeamEntity[]> {
        const teams = await this.repository.find();
        return teams;
    }

    async getById(id: number): Promise<TeamEntity | undefined>{
        const team = await this.repository.findOneBy({id});
        return team || undefined
    }

    async create(body: Omit<TeamEntity, "id">): Promise<TeamEntity> {
        const existingTeam = await this.repository.findOne({where: {name: body.name}})
        if(existingTeam){
            throw new HttpError(400, "Team name already in use.")
        }

        const newTeam = this.repository.create(body);
        return await this.repository.save(newTeam);
    }

    async update(id: number, body: Omit<TeamEntity, "id">): Promise<TeamEntity | undefined> {
        const teamToUpdate = await this.getById(id);
        if(!teamToUpdate){
            return undefined;
        }

        const updatedTeam = this.repository.merge(teamToUpdate, body)
        return await this.repository.save(updatedTeam);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}

export default TeamRepository;