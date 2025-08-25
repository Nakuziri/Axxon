import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getUserFromToken(): Promise<number> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) throw new Error("No token found");

  const { payload } = await jwtVerify(token, secret);
  return Number(payload.id);
}

export async function verifyJWT(token: string): Promise<{ id: number }> {
  const { payload } = await jwtVerify(token, secret);
  return { id: Number(payload.id) };
}
