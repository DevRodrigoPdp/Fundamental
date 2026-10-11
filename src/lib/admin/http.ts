import type { APIContext } from 'astro';

// Error con código HTTP que las rutas /api/admin convierten en respuesta JSON.
export class AdminError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
  }
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Envuelve un handler: AdminError → { error } con su status.
export function handle(fn: (context: APIContext) => Promise<Response>) {
  return async (context: APIContext) => {
    try {
      return await fn(context);
    } catch (e) {
      if (e instanceof AdminError) return json({ error: e.message }, e.status);
      throw e;
    }
  };
}
