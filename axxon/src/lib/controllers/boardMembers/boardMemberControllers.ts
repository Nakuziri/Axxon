import { NextRequest, NextResponse } from 'next/server';
import { BoardMembers } from '@/lib/models/boardMembers';
import { GetAllMembersForBoard, ListBoardsForUser } from '@/lib/models/types/boardMemberTypes';

export async function listBoardsForUsers (data: ListBoardsForUser) {
    const boards = await BoardMembers.listBoardsForUser(data);
    return NextResponse.json(boards, {status: 200});
}

export async function getAllMembersInBoard (data: GetAllMembersForBoard) {
    const members = await BoardMembers.getAllMembersForBoard(data);
    return NextResponse.json(members, {status: 200});
}

