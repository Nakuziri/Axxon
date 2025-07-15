import { NextRequest } from 'next/server';
import { createBoardController } from '@/lib/controllers/board/createBoard';

//route passes down NextRequest for the controller to use
export async function POST(req: NextRequest) {
  return await createBoardController(req);
}
