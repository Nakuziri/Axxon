export type ConversationMembersBaseData = { 
    conversation_id: number
    user_id: number
    created_at: string
};

export type AddUserToConversation = Pick<ConversationMembersBaseData, 'conversation_id' | 'user_id'> 
export type RemoveUsersFromConversation = Pick<ConversationMembersBaseData, 'conversation_id' | 'user_id'>
export type ListAllMembersInConvo = Pick<ConversationMembersBaseData, 'conversation_id'>;