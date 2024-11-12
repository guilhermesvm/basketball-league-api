import { DataSource, In, Repository } from "typeorm";
import PositionEntity from "../entities/Position";

export default class PositionRepository {
    private repository: Repository<PositionEntity>;

    constructor(dataSource: DataSource){
        this.repository = dataSource.getRepository(PositionEntity);
    }

    async getAll(): Promise<PositionEntity[]> {
        return await this.repository.find();
    }

    async getById(id: number): Promise<PositionEntity | undefined> {
        const position = await this.repository.findOneBy({ id })
        return position || undefined;
    }

    async getBy(ids: number[]): Promise<PositionEntity[] | undefined> {
        const positions = await this.repository.findBy({
            id: In(ids)
        })
        return positions || undefined;
    }

    async getByName(name: string): Promise<PositionEntity | undefined> {
        const position = await this.repository.findOneBy({ name: name })
        return position || undefined;
    }

    async create(body: Omit<PositionEntity, "id">): Promise<PositionEntity> {
        const newPosition = this.repository.create(body);
        return await this.repository.save(newPosition);
    }

    async update(id: number, body: Omit<PositionEntity, "id">): Promise<PositionEntity | undefined> {
        const positionToUpdate = await this.getById(id);
        if(!positionToUpdate){
            return undefined;
        }

        const updatedPosition = this.repository.merge(positionToUpdate, body);
        return await this.repository.save(updatedPosition);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}