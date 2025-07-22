// app/api/boardmembers/user/[userId]/route.ts
//lists boards users are in
import {GET as listAllBoardsForUsers} from '@/lib/controllers/boardMembers/boardMemberControllers'
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, context: {params: {id: string}}) {
    return await listAllBoardsForUsers(_req, context.params );
}