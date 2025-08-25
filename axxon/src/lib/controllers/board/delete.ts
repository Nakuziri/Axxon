import { NextRequest, NextResponse } from 'next/server';
import { Board } from '@/lib/models/board';


export async function deleteBoardController(_req: NextRequest, params: {boardId: string}) {
  try{
    const id = params.boardId;
    const result = await Board.deleteBoard({id});
   
    return NextResponse.json(result, {status: 200});
  }catch(error){
    console.error('[DELETE_BOARD_ERROR]', error);
    return NextResponse.json({error: 'failed to delete board'}, {status: 500});
  }
}
