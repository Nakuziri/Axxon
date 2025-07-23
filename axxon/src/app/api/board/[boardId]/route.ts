//route will change purpose depending on selected method
import { getBoardById } from '@/lib/controllers/board/getById';
import { updateBoardController } from '@/lib/controllers/board/update';
import { deleteBoardController } from '@/lib/controllers/board/delete';
import { NextRequest } from 'next/server';



//gets board by id
export async function GET(_req: NextRequest, context: { params: { boardId: string } }) {
  return await getBoardById(_req, context.params);
}

//updates board by id
export async function PATCH(req: NextRequest, context: { params: { boardId: string } }) {
  return await updateBoardController(req, context.params);
}

//deletes board by id
export async function DELETE(_req: NextRequest, context: { params: { boardId: string } }) {
  return await deleteBoardController(_req, context.params );
}
