import type { APIRoute } from 'astro';
import { getCatalog } from '@lib/services/catalog';
import { cld } from '@lib/cloudinary/url';

// Índice ligero para el buscador del header: se genera en build y el navegador
// solo lo descarga al abrir la búsqueda.
export const GET: APIRoute = async () => {
  const items = await getCatalog();
  const index = items.map((item) => ({
    sku: item.sku,
    nombre: item.nombre,
    categoria: item.categoria,
    terms: [item.nombre, item.categoria, item.subcategoria, item.searchSku ?? item.sku].filter(Boolean).join(' '),
    imagen: item.imagen ? cld(item.imagen, { width: 240, height: 240, trim: true }) : null,
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
