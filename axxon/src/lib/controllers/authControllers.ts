import { NextRequest, NextResponse } from 'next/server';
import db from '../db/db';
import jwt from 'jsonwebtoken';

//using NextRequest and NextResponse TypeAnnotations helps identify specific return values 
//while allowing me to utilize next helpers like NextResponse.json()   
export const handleOAuthLogin = async (req: NextRequest): Promise<NextResponse>=> {
    try{
        //grabs the users info
        const body = await req.json();
    //sorts out all of the incoming info from the user 
        const { email, first_name, last_name, avatar_url} = body;

    //checks if email is there
    if(!email) return NextResponse.json({ message: 'Your Email is required to login.'}, { status: 400})


        //Checks db to see if user exists
        //first() returns the first matching result meaning
        //  it'll be a singular object return rather than an arr
        let user = await db('users').where({email}).first();

        //if user doesn't exist, signup will be triggered
        if(!user){
            const [newUser] =  await db('users')
                .insert({email, first_name, last_name, avatar_url})
                .returning('*');
            user = newUser;
        }
 
        // Make sure JWT_SECRET exists
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined in environment variables');
            return NextResponse.json({ message: 'Server misconfiguration.' }, {status:500});
        }
        
        const token = jwt.sign({ id: user.id, email: user.email, name: user.first_name }, jwtSecret, { expiresIn: '7d' }); // expiration set to seven days

        return NextResponse.json({ user, token }, {status:200});
        
    }catch (error) {
        console.error('OAuth login failed:', error);
        return NextResponse.json({ message: 'Internal server error.' }, {status:500});
    }
};