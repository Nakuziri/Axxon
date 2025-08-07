export type MessageBaseData = {
    id: number
    conversation_id: number
    user_id: number
    message: string
    created_at: string
    updated_at: string
    is_edited: boolean 
}

export type CreateMessageData = Pick<MessageBaseData,'conversation_id' | 'user_id' | 'message'>;
export type EditMessageData = Pick<MessageBaseData, 'id'|'user_id'|'message'|'is_edited'|'updated_at'>;
export type GetAllMessagesData = Pick<MessageBaseData,'conversation_id'>;
export type DeleteMessageData = Pick<MessageBaseData, 'id'>;