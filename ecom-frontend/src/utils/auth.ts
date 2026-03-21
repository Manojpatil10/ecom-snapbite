export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function decodeToken(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function getRole(): string | null {
  const token = getToken()
  if (!token) return null
  const decoded = decodeToken(token)
  // Spring Boot sets role as "role" or "roles" claim — adjust key if needed
  return decoded?.role ?? decoded?.roles ?? null
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function logout(): void {
  localStorage.removeItem('token')
}