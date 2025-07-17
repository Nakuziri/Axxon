import { NextRequest, NextResponse } from 'next/server';
import { Categories } from '@/lib/models/categories';
import type {
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
  ListCategoriesForBoard,
  GetCategoryById,
} from '@/lib/models/types/categoryTypes';

// creates categories
export async function POST(req: NextRequest) {
  try {
    const data: CreateCategory = await req.json();
    const category = await Categories.createCategory(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('[CREATE_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// updates categories
export async function PATCH(req: NextRequest) {
  try {
    const data: UpdateCategory = await req.json();
    const category = await Categories.updateCategory(data);
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('[UPDATE_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// Deletes categories
export async function DELETE(req: NextRequest) {
  try {
    const data: DeleteCategory = await req.json();
    const deleted = await Categories.deleteCategory(data);
    return NextResponse.json({ deleted }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_CATEGORY_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

// lists out categories
export async function GET(req: NextRequest) {
  try {
    const { board_id }: ListCategoriesForBoard = await req.json(); // Consider switching to query param in future
    const categories = await Categories.listAllCategoriesInBoard({ board_id });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('[LIST_CATEGORIES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to list categories' }, { status: 500 });
  }
}

// GET
export async function getCategoryByIdController(req: NextRequest) {
  try {
    const { id }: GetCategoryById = await req.json(); // Ideally from `params`
    const category = await Categories.getCategoryById({ id });
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('[GET_CATEGORY_BY_ID_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}
