export type ConversationsBaseData = {
    id: number;
    board_id: number;
    is_group: Boolean;
    title: string | null;
    created_at: string;
};

export type CreateConversation = Pick<ConversationsBaseData, 'board_id' | 'is_group' | 'title'>;
export type GetConversationById = Pick<ConversationsBaseData, 'id'>;
export type ListConversationsInBoard = Pick<ConversationsBaseData, 'board_id'>;
