import { PATCH as updateCategoryController, DELETE as deleteCategoryController, getCategoryByIdController } from '@/lib/controllers/categories/categoryControllers';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: { boardId: string; categoryId: string }}) {
  return await updateCategoryController(req, context.params);
}

export async function DELETE(_req: NextRequest, context: { params: { boardId: string; categoryId: string }}) {
  return await deleteCategoryController(_req, context.params);
}

export async function GET(_req: NextRequest, context: { params: { boardId: string; categoryId: string;}}) {
    return await getCategoryByIdController(_req, context.params);
}