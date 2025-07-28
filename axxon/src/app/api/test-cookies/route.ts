import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies() // no await here!
  const tokenCookie = cookieStore.get('token')

  return NextResponse.json({
    hasGet: typeof cookieStore.get === 'function',
    tokenValue: tokenCookie?.value || null,
  })
}
