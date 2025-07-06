export type BoardMembersData = {
    user_id: number
    board_id: number
};

export type ListBoardsForUser = Pick<BoardMembersData, 'user_id'>;
export type GetAllMembersForBoard = Pick<BoardMembersData, 'board_id'>;
export type AddBoardMember = BoardMembersData;
export type RemoveBoardMember = BoardMembersData;
