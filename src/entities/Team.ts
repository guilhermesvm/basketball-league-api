import { Type } from "class-transformer";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import Player from "./Player";

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @Column()
    @Type(() => Date)
    @IsNotEmpty()
    creationDate?: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    city?: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    coach?: string;
    
    @Column("simple-array")
    @IsNotEmpty()
    retiredNumbers?: string[];

    @OneToMany(() => Player, player => player.team)
    players?: Player[];

    constructor(
        id?: number,
        name?: string,
        creationDate?: string,
        city?: string,
        coach?: string,
        retiredNumbers?: string[],
        players?: Player[]
    ) {
        this.id = id;
        this.name = name;
        this.creationDate = creationDate;
        this.city = city;
        this.coach = coach;
        this.retiredNumbers = retiredNumbers;
        this.players = players;
    }
}

export default Team;