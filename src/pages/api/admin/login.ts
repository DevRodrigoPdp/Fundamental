import type { APIRoute } from 'astro';
import { SESSION_COOKIE, createSessionCookieValue } from '../../../lib/adminAuth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');

  if (!password || password !== import.meta.env.ADMIN_PASSWORD) {
    return redirect('/admin/login?error=1');
  }

  cookies.set(SESSION_COOKIE, createSessionCookieValue(), {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return redirect('/admin');
};
