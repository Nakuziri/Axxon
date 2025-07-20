import { PATCH as updateCategoryController, DELETE as deleteCategoryController, getCategoryByIdController } from '@/lib/controllers/categories/categoryControllers';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: { boardId: string; categoryId: string }}) {
  return await updateCategoryController(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: { boardId: string; categoryId: string }}) {
  return await deleteCategoryController(req, context.params);
}

export async function GET(req: NextRequest, context: { params: { boardId: string; categoryId: string;}}) {
    return await getCategoryByIdController(req, context.params);
}