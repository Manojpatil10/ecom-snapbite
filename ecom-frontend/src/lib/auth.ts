export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

export function getRole() {
  return localStorage.getItem('role')
}

export function clearAuth() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('role')
}