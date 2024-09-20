import { Type } from "class-transformer";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Position {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    description?: string;

    constructor(
        id?: number,
        name?: string,
        description?: string
      
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export default Position;
