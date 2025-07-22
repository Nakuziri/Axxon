import {PATCH as updateLabel, DELETE as deleteLabel, getLabelByIdController as getLabelById } from '@/lib/controllers/labels/labelControllers';
import type { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: { boardId: string; labelId: string } }) {
  return updateLabel(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: { boardId: string; labelId: string } }) {
  return deleteLabel(req, context.params);
}

export async function GET(req: NextRequest, context: { params: { boardId: string; labelId: string } }) {
  return getLabelById(req, context.params);
}
