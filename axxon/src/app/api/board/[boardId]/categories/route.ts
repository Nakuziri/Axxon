import { NextRequest } from 'next/server';
import { POST as createCategory, GET as listAllCategories } from '@/lib/controllers/categories/categoryControllers';

export async function POST(req: NextRequest, context: { params: { boardId: string }}) {
  return await createCategory(req, context);
}

export async function GET(_req: NextRequest, context: { params: {boardId: string}}) {
    return await listAllCategories(_req, context.params);
}