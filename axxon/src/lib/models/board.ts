import knex from '@/lib/db/db';
import type { BoardBaseData, BoardCreation, UpdateBoard, ListBoardCreator } from './types/boards';
//when pre-defining types, I have two options. Either I predefine them a seperate variable within a different file or place it within the methods data. 
//Since is a project I plan to upscale, I'll preDefine the types

export class Board {
    //allows class to know what it's working with  for types. Defines whats on this
    id: number
    name: string
    created_by: number

    constructor({id, name, created_by}: BoardBaseData ) {
        this.id = id
        this.name = name
        this.created_by = created_by
    }
    
    static createBoard  = async (data: BoardCreation): Promise<Board> => {
        const [board] = await knex('boards')
         .insert({
            name: data.name,
            created_by: data.created_by
         })
         .returning('*')

        return board
    }

    static updateBoard = async (data: UpdateBoard): Promise<Board | null> => {
        const {id, ...updateData } = data;

        const [board] = await knex('boards')
         .where({id})
         .update(updateData)
         .returning('*')
        
        return board || null;
    }

    static listAllByCreator = async (data: ListBoardCreator): Promise<Board[]> => {
        return await knex('boards')
         .where({ created_by: data.created_by })
         .orderBy('created_at','desc');//orders descending by most recent
    }
}