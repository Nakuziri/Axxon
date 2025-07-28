export async function getUserId(): Promise<string | null> {
  try {
    const res = await fetch('/api/users/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch user ID')
    }

    const data = await res.json()
    return data.userId?.toString() ?? null
  } catch (err) {
    console.error('getUserId error:', err)
    return null
  }
}
