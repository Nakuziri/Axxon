export type BoardMembersBaseData = {
    user_id: number
    board_id: number
};

export type ListBoardsForUser = Pick<BoardMembersBaseData, 'user_id'>;
export type GetAllMembersForBoard = Pick<BoardMembersBaseData, 'board_id'>;
export type AddBoardMembersByEmail = {
    board_id: number;
    emails: string[];
};
export type RemoveBoardMember = BoardMembersBaseData;
export type GetMemberById = BoardMembersBaseData;
