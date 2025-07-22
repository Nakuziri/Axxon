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


export async function removeBoardMember(_req: NextRequest, params: {boardId: string; userId: string;}) {
  try{  
    const board_id = Number(params.boardId);
    const user_id = Number(params.userId);

    const removal = await BoardMembers.removeMember({user_id, board_id});
    
    return NextResponse.json(removal, {status: 200});
  }catch(error){
    console.error('[BOARD_MEMBER_REMOVAL_ERROR]', error);
    return NextResponse.json({error: 'failed to remove board member'}, {status: 500}); 
  }
}


export async function addBoardMembersByEmail(req: NextRequest, params: { boardId: string;}){
  try{
    const data: AddBoardMembersByEmail = await req.json();
    data.board_id = Number(params.boardId)

    await BoardMembers.addMembersByEmail(data);
    
    return NextResponse.json({ message: 'Members added successfully' }, { status: 200 });
  }catch(error){
    console.error('[ADD_BOARD_MEMBER_BY_EMAIL_ERROR]', error);
    return NextResponse.json({error: 'failed to add member by email'}, {status: 500}); 
  }
}

//doesnt directly handle http request so it can work with type variable parameter 
//helper function
export async function getMemberById(_req: NextRequest, params: { boardId: string; userId: string; }) {
  try{ 
    const board_id = Number(params.boardId);
    const user_id = Number(params.userId);

    const member = await BoardMembers.getMemberById({board_id, user_id});
    
    return NextResponse.json(member, { status: 200 });
  }catch(error){
    console.error('[GET_BOARD_MEMBER_BY_ID_ERROR]', error);
    return NextResponse.json({error: 'failed to get board member by ID'}, {status: 500}); 
  }
}