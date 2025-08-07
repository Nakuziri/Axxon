import { NextRequest, NextResponse } from 'next/server';
import { Categories } from '@/lib/models/categories';
import type { CreateCategory, UpdateCategory } from '@/lib/types/categoryTypes';

// creates categories
export async function POST(req: NextRequest, context: { params: { boardId: string } }) {
  try {
    const board_id = Number(context.params.boardId);
    const body = await req.json();

    const data: CreateCategory = { ...body, board_id };
    
    const category = await Categories.createCategory(data);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('[CREATE_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// updates categories
export async function PATCH(req: NextRequest, params: { boardId: string; categoryId: string }) {
  try {
    const board_id = Number(params.boardId);
    const id = Number(params.categoryId);
    const body = await req.json();

    const data: UpdateCategory = { ...body, id, board_id };

    const category = await Categories.updateCategory(data);

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('[UPDATE_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// Deletes categories
export async function DELETE(_req: NextRequest, params: { boardId: string; categoryId: string }) {
  try {
    const id = Number(params.categoryId);
    const deleted = await Categories.deleteCategory({ id });

    return NextResponse.json({ deleted }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

// lists out categories
export async function GET(_req: NextRequest, params: { boardId: string; }) {
  try{
    const board_id = Number(params.boardId);
    const categories = await Categories.listAllCategoriesInBoard({board_id});
    return NextResponse.json(categories, {status: 200});
  }catch(error){
    console.error('[LIST_CATEGORIES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to display categories'},{status: 500});
  }
}

// GetById
export async function getCategoryByIdController(_req: NextRequest, params: { boardId: string; categoryId: string }) {
  try {
    const id = Number(params.categoryId);

    const category = await Categories.getCategoryById({ id });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('[GET_CATEGORY_BY_ID_ERROR]', error);
    return NextResponse.json({ error: 'Failed to retrieve category' }, { status: 500 });
  }
}
