import knex from '@/lib/db/db';
import type { BoardBaseData, BoardCreation, UpdateBoard, DeleteBoard, ListBoardCreator, GetBoardById } from './types/boardTypes';
//when pre-defining types, I have two options. Either I predefine them a seperate variable within a different file or place it within the methods data. 
//Since is a project I plan to upscale, I'll preDefine the types

export class Board {

    static createBoard = async (data: BoardCreation): Promise<BoardBaseData> => {
        return await knex.transaction(async (trx) => {
        // Create the board using trx
        const [board] = await trx('boards')
            .insert({
            name: data.name,
            created_by: data.created_by,
            created_at: knex.fn.now(),
            update_at: knex.fn.now(),
            })
            .returning('*');

        // Default categories
        const defaultCategories = [
            { name: 'Backlog', color: '#94A3B8', is_done: false },
            { name: 'Todo', color: '#3B82F6', is_done: false },
            { name: 'In Progress', color: '#F59E0B', is_done: false },
            { name: 'Done', color: '#10B981', is_done: true },
            { name: 'Cancelled', color: '#EF4444', is_done: false },
        ];

        const categoryInserts = defaultCategories.map((cat, index) => ({
            board_id: board.id,
            name: cat.name,
            color: cat.color,
            position: index,
            is_done: cat.is_done,
        }));

        await trx('categories').insert(categoryInserts);

        // Handle invited users
        const emails = data.member_emails ?? [];
        let invitedUsers: {id: number}[] = [];

        //checks for users if any were invited
        if (emails.length > 0) {
            invitedUsers = await trx('users').whereIn('email', emails);
        }

        //// Insert board members
        const memberInserts = [
            { board_id: board.id, user_id: data.created_by },
            ...invitedUsers.map((user) => ({
            board_id: board.id,
            user_id: user.id,
            })),
        ];

        await trx('board_members').insert(memberInserts);

        return board;
        });
    };

    static updateBoard = async (data: UpdateBoard): Promise<Board | null> => {
        const {id, ...updateData } = data;

        const [board] = await knex('boards')
         .where({id})
         .update({ ...updateData, updated_at: knex.fn.now() })
         .returning('*')
        
        return board || null;
    };

    static deleteBoard = async (data : DeleteBoard): Promise<number> => {
        return await knex('boards')
        .where( { id: data.id})
        .del();
    };

    static listAllByCreator = async (data: ListBoardCreator): Promise<Board[]> => {
        return await knex('boards')
         .where({ created_by: data.created_by })
         .orderBy('created_at','desc');//orders descending by most recent
    };
    
    //needed for nested dynamic route
    static getBoardById = async (data: GetBoardById): Promise<BoardBaseData | null> => {
        return await knex('boards').where({id: data.id}).first() || null;
    };
}