const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export type OlgaRole =
  | 'admin_olga'
  | 'hospital'
  | 'proveedor'
  | 'eps'
  | 'paciente';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: OlgaRole;
  tenant_id: number | null;
}

export async function login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? 'Credenciales incorrectas');
  }

  const data = await res.json();

  localStorage.setItem('olga_token', data.token);
  localStorage.setItem('olga_role', data.user.role);

  return data;
}

export function logout(): void {
  const token = getToken();
  if (token) {
    fetch(`${API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }
  localStorage.removeItem('olga_token');
  localStorage.removeItem('olga_role');
}

export function getToken(): string | null {
  return localStorage.getItem('olga_token');
}

export function getRole(): OlgaRole | null {
  return localStorage.getItem('olga_role') as OlgaRole | null;
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

const ROLE_ROUTES: Record<OlgaRole, string> = {
  admin_olga: '/admin/dashboard',
  hospital:   '/hospital/dashboard',
  eps:        '/eps/dashboard',
  proveedor:  '/proveedor/dashboard',
  paciente:   '/paciente/dashboard',
};

export function redirectByRole(role: OlgaRole): string {
  return ROLE_ROUTES[role] ?? '/login';
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
