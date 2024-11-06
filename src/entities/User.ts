import { Type } from "class-transformer";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    email?: string;

    @Column()
    password?: string

    constructor(
        id: number,
        name: string,
        email: string,
        password: string
    ){
        this.id = id,
        this.name = name
        this.email = email,
        this.password = password
    }
}

export default User;