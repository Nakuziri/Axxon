import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db/db'; 
import jwt from 'jsonwebtoken';

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const redirectUri = 'http://localhost:3000/api/auth/google/callback';

export async function GET(req: NextRequest) {
  try {
    //checks for google login flow validation
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ message: 'Authorization code not provided' }, { status: 400 });
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json({ message: 'Failed to exchange token', error: tokenData.error }, { status: 400 });
    }

    // Decode ID token to get user info
    const idToken = tokenData.id_token;
    const decoded: any = jwt.decode(idToken);

    if (!decoded || !decoded.email) {
      return NextResponse.json({ message: 'Failed to decode ID token' }, { status: 400 });
    }

    // Check or create user in DB
    let user = await db('users').where({ email: decoded.email }).first();

    if (!user) {
      const [newUser] = await db('users')
        .insert({
          email: decoded.email,
          first_name: decoded.given_name,
          last_name: decoded.family_name,
          avatar_url: decoded.picture,
        })
        .returning('*');
      user = newUser;
    }

    // Issue JWT
    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign({ id: user.id, email: user.email, name: user.first_name }, jwtSecret, { expiresIn: '7d' });

    // Set cookie or redirect with token
    const response = NextResponse.redirect('http://localhost:3000/main'); // your frontend main page
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
