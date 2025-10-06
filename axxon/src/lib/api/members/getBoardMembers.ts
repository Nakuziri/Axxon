export const getBoardMembers = async (boardId: number) => {
  const res = await fetch(`/api/board/${boardId}/member`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch board members');
  return res.json();
};
