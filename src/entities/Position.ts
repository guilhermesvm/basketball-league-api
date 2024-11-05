import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Player from "./Player";
import { IsNotEmpty, IsString } from "class-validator";

@Entity()
export default class Position {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    @IsNotEmpty()
    @IsString()
    name?: string

    @Column()
    @IsNotEmpty()
    @IsString()
    abbreviation?: string

    @ManyToMany(() => Player, players => players.positions, { lazy: true })
    players?: Player[];
}