import knex from '@/lib/db/db';
import { ConversationsBaseData, CreateConversation, GetConversationById, ListConversationsInBoard } from './types/conversationTypes';

export class conversations {
    static createConversation = async (data:CreateConversation): Promise<ConversationsBaseData> => {
        const [conversation] = await knex('conversations')
            .insert({
                board_id: data.board_id,
                is_group: data.is_group,
                title: data.title ?? null,
            })
            .returning('*');
        
        return conversation;
    };

    //gets a conv by its id for opening a chat
    static getConversationById = async (data: GetConversationById): Promise<ConversationsBaseData | null> =>{
        const conversation = await knex('conversations')
        .where({id: data.id})
        .first()

        return conversation || null;
    };

    //used to display main chat in board
    static listConversationInBoard = async (data: ListConversationsInBoard): Promise<ConversationsBaseData[]> => {
        return await knex('conversations')
        .where({board_id: data.board_id})
        .orderBy('created_at','asc')
    };

    /*
    TODO SINCE IM STEPPING OUT TEMPORARILY
    -CREATE A METHOD FOR ADDING USERS TO CONVO
    -CREATE A METHOD FOR REMOVING USERS FROM CONVO
    -CREATE A METHOD TO LIST ALL USERS IN CONVO
    */
}