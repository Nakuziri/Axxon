export const inviteMembersByEmail = async ({boardId, emails }: {boardId: number; emails: string[]}): Promise<void> => {
  const res = await fetch(`/api/board/${boardId}/member`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails }),
  });
  if (!res.ok) throw new Error(await res.text());
};
