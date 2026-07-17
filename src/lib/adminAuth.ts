// V1: autenticación de admin simulada en el cliente, solo para la maqueta.
// El dueño entra por el login normal ("Mi cuenta") con estas credenciales y
// queda con sesión de administrador. NO es seguridad real — se reemplaza por
// Supabase Auth con rol admin cuando conectemos la base.

export const ADMIN_EMAIL = "admin@gpacking.com";
export const ADMIN_PASSWORD = "gpacking2026";

const SESSION_KEY = "gp-core-admin-session";

export function isAdminCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function setAdminSession() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // ignore storage errors
  }
}

export function clearAdminSession() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore storage errors
  }
}

export function hasAdminSession() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}
