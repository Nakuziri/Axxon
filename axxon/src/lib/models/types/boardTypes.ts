import { Board } from "../board";

export type BoardBaseData = {
  id: number;
  name: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

//pick<> can be used to pick out specific things within type declaration
export type BoardCreation = Pick<BoardBaseData, 'name' | 'created_by'> & {
  member_emails:  string [];
};

//Setup for future use, Partial allows fields to be optional meaning 
// that not everything needs to be updated
//keeps id required while name is optional
export type UpdateBoard = Pick<BoardBaseData,'id'> & Partial<Pick<BoardBaseData, 'name'>>;
export type ListBoardCreator = Pick<BoardBaseData, 'created_by'>;
export type DeleteBoard = Pick<BoardBaseData, 'id'>;
export type GetBoardById = Pick<BoardBaseData, 'id'>;