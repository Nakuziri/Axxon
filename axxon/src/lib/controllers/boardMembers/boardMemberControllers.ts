/*
THIS WHOLE CONTROLLER FILE SHOULD BE REVISED 
TO ENSURE THAT CONTROLLERS WORK AS INTENDED

controllers that need to be fixed: 
-remove board members
-get by id
*/

import { NextRequest, NextResponse } from 'next/server';
import { BoardMembers } from '@/lib/models/boardMembers';
import { AddBoardMembersByEmail, GetMemberById, RemoveBoardMember } from '@/lib/models/types/boardMemberTypes';

//has to be specifically setup like this due to working with dynamic route
//lists all boards users is a member of
export async function GET(_req: NextRequest, params: { userId: string }) {
  try{
    const user_id = Number(params.userId);
    const boards = await BoardMembers.listBoardsForUser({ user_id });
    
    return NextResponse.json(boards, { status: 200 });
  }catch(error){
    console.error('[FETCH_BOARDS_DATA_ERROR]', error);
    return NextResponse.json({error: 'failed to fetch boards'}, {status: 500});
  }
}

//gets all board members
export async function getAllMembersInBoard(_req: NextRequest, params: {boardId: string }) {
  try{  
    const board_id = Number(params.boardId);
    const members = await BoardMembers.getAllMembersForBoard({ board_id });

    return NextResponse.json(members, {status: 200});
  }catch(error){
    console.error('[DISPLAY_BOARD_MEMBERS_ERROR]', error);
    return NextResponse.json({error: 'failed to display board members'}, {status: 500});
  }
}

//needs req since its DEL
export async function removeBoardMember(data: RemoveBoardMember) {
  const result = await BoardMembers.removeMember(data);
  return NextResponse.json(result, { status: 200 });
}

//needs req since its a POST
export async function addBoardMembersByEmail(req: NextRequest, params: { boardId: string;}){
  const data: AddBoardMembersByEmail = await req.json();
  data.board_id = Number(params.boardId)
  await BoardMembers.addMembersByEmail(data);
  return NextResponse.json({ message: 'Members added successfully' }, { status: 200 });
}

//doesnt directly handle http request so it can work with type variable parameter 
//helper function
export async function getMemberById(data: GetMemberById) {
  const member = await BoardMembers.getMemberById(data);
  return NextResponse.json(member, { status: 200 });
}