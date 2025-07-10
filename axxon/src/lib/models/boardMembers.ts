import knex from '@/lib/db/db';
import type { ListBoardsForUser, GetAllMembersForBoard, RemoveBoardMember, AddBoardMember, GetMemberById, BoardMembersBaseData } from './types/boardMemberTypes';
import type { BoardBaseData } from './types/boardTypes';
import type { User } from './types/users';


export class BoardMembers {

  //user_id destructures the data so that you can utilize it under where
// Lists all boards that a user is a member of
  static listBoardsForUser = async (data: ListBoardsForUser): Promise<BoardBaseData[]> => {
    return await knex('boards')//server as table A for join conditions
      .join('board_members', 'boards.id', 'board_members.board_id')//serves as correlation conditions in the following oerder: (B,A,B)
      .where('board_members.user_id', data.user_id)//Served for filtering
      .select('boards.*');//Sends back all values with proper conditions
  };

// Lists all users who are members of a given board
  static getAllMembersForBoard = async (data: GetAllMembersForBoard): Promise<User[]> =>{
    return await knex('users')// starts query with this table
     .join('board_members', 'users.id', 'board_members.user_id')//joins users table to board members 
     .where('board_members.board_id', data.board_id )//with join, filters for users who are in a specific board
     .select('users.*');//selects all users info 
  };

  static removeMember = async (data: RemoveBoardMember): Promise<number> => {
    return await knex('board_members')
    .where({ user_id: data.user_id, board_id: data.board_id })
    .del();
  };

  static addMember = async (data: AddBoardMember): Promise<number[]> => {
    return await knex('board_members')
    .insert({ user_id: data.user_id, board_id: data.board_id });
  };

  //used for detailed member view/deletion section
  static getMemberById = async (data: GetMemberById): Promise<BoardMembersBaseData | null> => {
    return await knex('board_members').where({user_id: data.user_id, board_id: data.board_id}).first() || null;
  };
}