import knex  from '@/lib/db/db'
import { CreateMessageData, DeleteMessageData, EditMessageData, GetAllMessagesData, MessageBaseData } from './types/ConversationMessageTypes';

export class Messages {
    
    static createMessage = async (data: CreateMessageData): Promise<MessageBaseData> => {
        const [message] = await knex('messages')
            .insert({
            conversation_id: data.conversation_id,
            user_id: data.user_id,
            message: data.message,
            })
            .returning('*');
            
        return message;
    };

    static editMessage = async (data: EditMessageData): Promise<MessageBaseData | null> => {
        const [updated] = await knex('messages')
            .where({ id: data.id, user_id: data.user_id }) // Optional: enforce only sender can edit
            .update({
            message: data.message,
            is_edited: true,
            updated_at: knex.fn.now(),
            })
            .returning('*');

        return updated || null;
    };

    static getMessagesInConversation = async (data: GetAllMessagesData): Promise<MessageBaseData[]> => {
        return await knex('messages')
        .where({ conversation_id: data.conversation_id})
        .orderBy('created_at', 'asc');
    };

    static deleteMessageInConversation = async (data: DeleteMessageData): Promise<MessageBaseData | null> => {
        const [deletedMsg] = await knex('messages')
            .where({id: data.id})
            .del()
            .returning('*');
        return deletedMsg || null;
    };

    //used for real time updating messages 
    static getMessageById = async (id: number): Promise<MessageBaseData | null> => {
        const message = await knex('messages').where({ id }).first();
        return message || null;
    };
}