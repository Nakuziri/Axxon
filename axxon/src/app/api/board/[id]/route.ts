//route will change purpose depending on selected method
import { getBoardById } from '@/lib/controllers/board/getById';
import { updateBoardController } from '@/lib/controllers/board/update';
import { deleteBoardController } from '@/lib/controllers/board/delete';
import { NextRequest } from 'next/server';

//gets board by id
export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  return await getBoardById(Number(id));
}

//updates board by id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return await updateBoardController(req, Number(params.id));
}

//deletes board by id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return await deleteBoardController(Number(params.id));
}
