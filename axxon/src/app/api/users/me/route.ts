import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    return NextResponse.json({ userId: decoded.id })
  } catch (err) {
    console.error('JWT decode error:', err)
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }
}
