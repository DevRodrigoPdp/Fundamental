import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, isValidSessionCookie } from './lib/adminAuth';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/api/admin/login']);

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!isAdminArea || PUBLIC_ADMIN_PATHS.has(pathname)) {
    return next();
  }

  const cookie = context.cookies.get(SESSION_COOKIE)?.value;
  if (!isValidSessionCookie(cookie)) {
    if (pathname.startsWith('/api/admin')) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return context.redirect('/admin/login');
  }

  return next();
});
