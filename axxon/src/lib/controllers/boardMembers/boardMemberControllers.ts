import { NextRequest, NextResponse } from 'next/server';
import { BoardMembers } from '@/lib/models/boardMembers';
import { ListBoardsForUser } from '@/lib/models/types/boardMemberTypes';

export async function listBoardsForUsers (data: ListBoardsForUser) {
    const boards = await BoardMembers.listBoardsForUser(data);
    return NextResponse.json(boards, {status: 200});
}