import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import Player from "./Player";

@Entity()
export class Position {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    name?: string

    @Column()
    abbreviation?: string

    @ManyToMany(() => Player, players => players.positions, { lazy: true })
    players?: Player[];
}