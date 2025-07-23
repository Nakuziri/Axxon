import { POST as createLabel, GET as listLabels } from '@/lib/controllers/labels/labelControllers';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest, context: { params: { boardId: string} }) {
  return createLabel(req, context.params);
}

export async function GET(req: NextRequest, context: { params: { boardId: string } }) {
  return listLabels(req, context.params);
}
