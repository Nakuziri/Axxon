import knex from '@/lib/db/db';
import type { BoardMembersData } from './types/boardMembers';
import type { BoardBaseData } from './types/boards';
import type { User } from './types/users';

export class BoardMembers {
  user_id: number;
  board_id: number;

  constructor({ user_id, board_id }: BoardMembersData) {
    this.user_id = user_id;
    this.board_id = board_id;
  }

//user_id destructures the data so that you can utilize it under where
// Lists all boards that a user is a member of
  static listBoardsForUser = async ({ user_id }: BoardMembersData): Promise<BoardBaseData[]> => {
    return await knex('boards')//server as table A for join conditions
      .join('board_members', 'boards.id', 'board_members.board_id')//serves as correlation conditions in the following oerder: (B,A,B)
      .where('board_members.user_id', user_id)//Served for filtering
      .select('boards.*');//Sends back all values with proper conditions
  };

// Lists all users who are members of a given board
  static getAllMembersForBoard = async({ board_id }: BoardMembersData): Promise<User[]> =>{
    return await knex('users')// starts query with this table
     .join('board_members', 'users.id', 'board_members.user_id')//joins users table to board members 
     .where('board_members.board_id', board_id)//with join, filters for users who are in a specific board
     .select('users.*');//selects all users info 
  };
}
