import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function sign(expiry: number): string {
  const secret = import.meta.env.ADMIN_SESSION_SECRET;
  return createHmac('sha256', secret).update(String(expiry)).digest('hex');
}

export function createSessionCookieValue(): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  return `${expiry}.${sign(expiry)}`;
}

export function isValidSessionCookie(value: string | undefined): boolean {
  if (!value) return false;
  const [expiryStr, signature] = value.split('.');
  if (!expiryStr || !signature) return false;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const expected = sign(expiry);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
