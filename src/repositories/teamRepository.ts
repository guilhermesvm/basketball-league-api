import { DataSource, Repository } from "typeorm";
import TeamEntity from "../entities/Team";

class TeamRepository {
    private repository: Repository<TeamEntity>;

    constructor(dataSource: DataSource){
        this.repository = dataSource.getRepository(TeamEntity);
    }

    async getAll(): Promise<TeamEntity[]> {
        return await this.repository.find();
    }

    async getById(id: number): Promise<TeamEntity | undefined>{
        const team = await this.repository.findOne({
            where: { id },
            relations: ["roster"]
        });
        return team || undefined
    }

    async getByName(name: string): Promise<TeamEntity | undefined> {
        const team = await this.repository.findOneBy({ name: name});
        return team || undefined;
    }

    async create(body: Omit<TeamEntity, "id">): Promise<TeamEntity> {
        const newTeam = this.repository.create(body);
        return await this.repository.save(newTeam);
    }

    async update(id: number, body: Omit<TeamEntity, "id">): Promise<TeamEntity | undefined> {
        const teamToUpdate = await this.getById(id);
        if(!teamToUpdate){
            return undefined;
        }

        this.repository.merge(teamToUpdate, body)
        return await this.repository.save(teamToUpdate);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}

export default TeamRepository;