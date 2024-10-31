import { Type } from "class-transformer";
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import Team from "./Team";
import { Position } from "./Position";

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

    @Column()
    @IsNotEmpty()
    height?: string;

    @Column()
    @IsNotEmpty()
    weight?: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    number?: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    nacionality?: string

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    draftYear?: string

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    draftRound?: string

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    draftPick?: string

    @ManyToMany(() => Position, position => position.players)
    @JoinTable()
    @IsOptional()
    @IsNotEmpty()
    positions?: Position[]

    @ManyToOne(() => Team, team => team.roster)
    team?: Team

    constructor(
        id?: number,
        name?: string,
        birthDate?: string,
        height?: string,
        weight?: string,
        number?: string,
        nacionality?: string,
        draftYear?: string,
        draftRound?: string,
        draftPick?: string,
        team?: Team,
        positions?: Position[]
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
        this.positions = positions;
    }
}

export default Player;