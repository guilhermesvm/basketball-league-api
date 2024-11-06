import { DataSource, Repository } from "typeorm";
import UserEntity, { User } from "../entities/User";

export class UserRepository{
    private repository: Repository<UserEntity>

    constructor(appDataSource: DataSource){
        this.repository = appDataSource.getRepository(UserEntity)
    }

    async getAll(): Promise<UserEntity[]> {
        return this.repository.find();
    }

    async getById(id: number): Promise<UserEntity | undefined> {
        const user = await this.repository.findOneBy({id: id});
        return user || undefined;
    }

    async getByEmail(email: string): Promise<UserEntity | undefined> {
        const user = await this.repository.findOneBy({email: email});
        return user || undefined;
    }

    async create(user: Omit<UserEntity, "id">): Promise<UserEntity> {
        const newUser = await this.repository.create(user);
        return this.repository.save(newUser)
    }

    async update(id: number, user: Partial<Omit<UserEntity, "id">>): Promise<UserEntity | undefined> {
        const userToUpdate = await this.getById(id);

        if(!userToUpdate){
            return undefined;
        }

        const updatedUser = this.repository.merge(userToUpdate, user);
        return await this.repository.save(updatedUser)
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result?.affected ? result.affected > 0 : false;
    }
}