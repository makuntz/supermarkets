// Auth guard/middleware
// Verifica se usuário está autenticado

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem('auth_token');
}

export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    // TODO: Redirecionar para login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  }
  return true;
}

