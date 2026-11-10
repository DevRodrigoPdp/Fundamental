# Fundamental

Web de Fundamental, distribuidora de componentes de bicicleta y distribuidor de la marca T3R. Se publica en [fundamentalbikeparts.com](https://fundamentalbikeparts.com).

La web muestra el catálogo de productos con disponibilidad, la ficha de cada producto, las marcas distribuidas, los puntos de venta y la información de contacto. Incluye un panel privado (`/admin`) para gestionar productos e imágenes sin tocar código.

## Stack

- Astro 6 + Tailwind 4, desplegado en Vercel
- Supabase como base de datos de productos
- Cloudinary para las imágenes

Las páginas públicas se generan en build. El panel `/admin` y `/api/admin` se renderizan en servidor.

## Desarrollo

```sh
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

Variables de entorno necesarias en `.env`:

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
PUBLIC_SITE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
VERCEL_DEPLOY_HOOK_URL=
```

## Despliegue

Cada push a `main` despliega producción en Vercel. Las demás ramas generan una URL de preview.

Un GitHub Action (`.github/workflows/supabase-keepalive.yml`) consulta Supabase cada 3 días para que el proyecto no se pause por inactividad. Necesita los secrets `SUPABASE_URL` y `SUPABASE_ANON_KEY` en el repositorio.

## Más información

- [docs/estructura.md](docs/estructura.md): organización de carpetas y responsabilidades de cada parte.
- `scripts/`: scripts puntuales de migración de imágenes a Cloudinary y actualización de URLs en Supabase.
