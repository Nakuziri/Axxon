export async function fetchBoards(id: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/users/${id}/boards`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch boards');
    }

    const data = await res.json();
    console.log('Boards fetched from API:', data); 

    // If API returns array directly:
        // If API returns { boards: [...] }, use:
    // return data.boards ?? [];
    return Array.isArray(data) ? data : data.boards ?? [];

  } catch (err) {
    console.error('fetchBoards error:', err);
    return [];
  }
}
