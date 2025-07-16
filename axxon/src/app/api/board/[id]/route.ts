//route will change purpose depending on selected method
import { getBoardById } from '@/lib/controllers/board/getById';
import { updateBoardController } from '@/lib/controllers/board/update';
import { deleteBoardController } from '@/lib/controllers/board/delete';
import { NextRequest } from 'next/server';
import { DeleteBoard } from '@/lib/models/types/boardTypes';


//gets board by id
//context allows you to bridge types from controllers 
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return await getBoardById(Number(params.id));
}

//updates board by id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return await updateBoardController(req, Number(params.id));
}

//deletes board by id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const data: DeleteBoard = {id: Number(params.id)}
  return await deleteBoardController(data);
}
