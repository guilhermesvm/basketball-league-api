import { Type } from "class-transformer";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import Team from "./Team";

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @Column()
    @Type(() => Date)
    @IsNotEmpty()
    birthDate?: string;

    @Column("float")
    @IsNotEmpty()
    @IsPositive()
    height?: number;

    @Column("float")
    @IsNotEmpty()
    @IsPositive()
    weight?: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    number?: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    nacionality?: string

    @Column()
    @IsNotEmpty()
    @IsString()
    draftYear?: string

    @Column()
    @IsNotEmpty()
    @IsString()
    draftRound?: string

    @Column()
    @IsNotEmpty()
    @IsString()
    draftPick?: string

    @ManyToOne(() => Team, team => team.players)
    team?: Team

    constructor(
        id?: number,
        name?: string,
        birthDate?: string,
        height?: number,
        weight?: number,
        number?: string,
        nacionality?: string,
        draftYear?: string,
        draftRound?: string,
        draftPick?: string,
        team?: Team
    ) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.height = height;
        this.weight = weight;
        this.number = number;
        this.nacionality = nacionality;
        this.draftYear = draftYear; 
        this.draftRound = draftRound; 
        this.draftPick = draftPick; 
        this.team = team;
    }
}

export default Player;