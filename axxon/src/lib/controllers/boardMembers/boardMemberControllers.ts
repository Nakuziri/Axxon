import { NextRequest, NextResponse } from 'next/server';
import { BoardMembers } from '@/lib/models/boardMembers';
import { AddBoardMembersByEmail, GetMemberById, RemoveBoardMember } from '@/lib/models/types/boardMemberTypes';

//has to be specifically setup like this due to working with dynamic route
export async function listBoardsForUsers(userId: number) {
  const boards = await BoardMembers.listBoardsForUser({ user_id: userId });
  return NextResponse.json(boards, { status: 200 });
}

export async function getAllMembersInBoard(boardId: number) {
  const members = await BoardMembers.getAllMembersForBoard({ board_id: boardId });
  return NextResponse.json(members, { status: 200 });
}

//needs req since its DEL
export async function removeBoardMember(data: RemoveBoardMember) {
  const result = await BoardMembers.removeMember(data);
  return NextResponse.json(result, { status: 200 });
}

//needs req since its a POST
export async function addBoardMembersByEmail(req: NextRequest) {
  const data: AddBoardMembersByEmail = await req.json();
  await BoardMembers.addMembersByEmail(data);
  return NextResponse.json({ message: 'Members added successfully' }, { status: 200 });
}

//doesnt directly handle http request so it can work with type variable parameter 
//helper function
export async function getMemberById(data: GetMemberById) {
  const member = await BoardMembers.getMemberById(data);
  return NextResponse.json(member, { status: 200 });
}