import knex from '@/lib/db/db';
import { AddUserToConversation, ConversationMembersBaseData, ListAllMembersInConvo, RemoveUsersFromConversation } from './types/conversationMemberTypes';
import { User } from './types/users';

export class ConversationMembers {

    static addUserToConversation = async (data: AddUserToConversation ): Promise<ConversationMembersBaseData> =>{
        const [user] = await knex('conversation_members') 
        .insert({
            conversation_id: data.conversation_id,
            user_id: data.user_id
        })
        .returning('*')

        return user;
    };

    static deleteUserFromConvo = async (data:RemoveUsersFromConversation): Promise<ConversationMembersBaseData | null> =>{
        const [user] = await knex('conversation_members')
        .where({
            conversation_id: data.conversation_id,
            user_id: data.user_id,
        })
        .del()
        .returning('*');

        return user || null;
    };

    static listAllMembersInConvo = async (data: ListAllMembersInConvo): Promise<User[]> => {
        return await knex('users')
        .join('conversation_members', 'users.id', 'conversation_members.user_id')
        .where({'conversation_members.conversation_id': data.conversation_id})
        .select('users.*')
    };
}