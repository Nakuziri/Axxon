import db from "@/lib/db/db";
import { User, createUserData, findByEmailData } from "../types/users";

export class Users  {
    static findByEmail = async(data: findByEmailData): Promise<User | undefined> => {
        const user = await db('users')
            .where({ email: data.email })
            .first();

        return user;
    };

    static createUser = async (data: createUserData): Promise<User> => {
        const [user] = await db('users')
            .insert(data)
            .returning('*');

        return user;
    };

    static findOrCreateByGoogle = async (data: createUserData): Promise<User> => { 
        let user = await this.findByEmail( { email: data.email } );
        if (!user) {
            user = await this.createUser(data);
        }
        return user;
    };
}
