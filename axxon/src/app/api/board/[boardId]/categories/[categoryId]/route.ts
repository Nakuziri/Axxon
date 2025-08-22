import { NextRequest, NextResponse } from 'next/server';
import { getCategoryByIdController, PATCH as updateCategoryController, DELETE as deleteCategoryController, } from '@/lib/controllers/categories/categoryControllers';

// Helper to extract boardId and categoryId from the path
function getParams(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'board', boardId, 'categories', categoryId]
  const boardId = parts[3];
  const categoryId = parts[5];

  if (!boardId || !categoryId) {
    throw new Error('Missing boardId or categoryId');
  }

  return { boardId, categoryId };
}

export async function GET(req: NextRequest) {
  try {
    const { boardId, categoryId } = getParams(req);
    const category = await getCategoryByIdController(req, { boardId, categoryId });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { boardId, categoryId } = getParams(req);
    const updatedCategory = await updateCategoryController(req, { boardId, categoryId });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { boardId, categoryId } = getParams(req);
    const deletedCategory = await deleteCategoryController(req, { boardId, categoryId });
    return NextResponse.json(deletedCategory);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
