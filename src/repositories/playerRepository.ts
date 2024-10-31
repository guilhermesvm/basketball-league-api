import { DataSource, Repository } from "typeorm";
import PlayerEntity from "../entities/Player";

class PlayerRepository {
    private repository: Repository<PlayerEntity>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(PlayerEntity);
    }

    async getAll(): Promise<PlayerEntity[]> {
        return await this.repository.find();
        
    }

    async getById(id: number): Promise<PlayerEntity | undefined> {
        const player = await this.repository.findOneBy({ id });
        return player || undefined;
    }

    async create(body: Omit<PlayerEntity, "id">): Promise<PlayerEntity> {
        const newPlayer = this.repository.create(body);
        return await this.repository.save(newPlayer);
    }

    async update(id: number, body: Omit<PlayerEntity, "id">): Promise<PlayerEntity | undefined> {
        const playerToUpdate = await this.getById(id);
        if(!playerToUpdate){
            return undefined;
        }
        const updatedPlayer = this.repository.merge(playerToUpdate, body)
        return await this.repository.save(updatedPlayer);
        
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0: false
    }
}

export default PlayerRepository;
