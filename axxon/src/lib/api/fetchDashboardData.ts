import { BoardBaseData } from '@/lib/models/types/boardTypes';

export type DashboardData = {
  id: string | null;
  boards: BoardBaseData[];
};

export async function fetchDashboardData(): Promise<DashboardData> {
  const res = await fetch('/api/dashboard', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}
