import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../lib/adminAuth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return redirect('/admin/login');
};
