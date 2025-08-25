'use server';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Users } from '@/lib/models/users';

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const redirectUri = 'http://localhost:3000/api/auth/google/callback';
const jwtSecret = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
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
    const decoded: any = jwt.decode(tokenData.id_token);
    if (!decoded || !decoded.email) {
      return NextResponse.json({ message: 'Failed to decode ID token' }, { status: 400 });
    }

    // Use UserModel to find or create user
    const user = await Users.findOrCreateByGoogle({
      email: decoded.email,
      first_name: decoded.given_name,
      last_name: decoded.family_name,
      avatar_url: decoded.picture,
    });

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.first_name },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Set cookie and redirect
    const response = NextResponse.redirect('http://localhost:3000/dashboard');
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
