# Estructura del proyecto

Astro 6 + Tailwind 4, desplegado en Vercel (`@astrojs/vercel`). Las páginas públicas se generan en build; el panel `/admin` y `/api/admin` se renderizan en servidor.

```
src/
├── pages/              Rutas. Finas: piden datos a lib/services y componen componentes.
│   ├── admin/          Panel de administración (SSR, protegido por middleware.ts)
│   └── api/admin/      Endpoints del panel (SSR)
├── layouts/            BaseLayout (html, head con SeoHead, global.css, reveal)
├── components/
│   ├── layout/         Nav/, Footer/, SeoHead
│   ├── ui/             Piezas genéricas (BackToTop, InstagramLink)
│   └── features/       Secciones por dominio: home, catalog, product, about, contact,
│                       stores, brand/{t3r,transfer,whipp-off}
├── config/             Datos estáticos y constantes (navegación, SEO por página,
│                       familias, taxonomía, marcas, tiendas, banners...)
├── lib/
│   ├── supabase/       Clientes (client, admin) y consultas (products, images)
│   ├── services/       Lógica de páginas públicas (catalog, productDetail, catalogFamilies, home)
│   ├── admin/          Lógica del panel (products, images, auth, publish, http)
│   ├── cloudinary/     Cliente y helpers de URL
│   ├── seo/            schema.org y sitemap
│   └── utils/          mailto, formato, stock, sku, maps, navegación
├── scripts/            JS de navegador por dominio (layout, catalog, product, home, ...)
├── types/              Tipos compartidos (product, catalog, store, navigation, seo)
├── styles/             global.css
└── middleware.ts       Protege /admin y /api/admin
```

## Alias de imports

| Alias | Carpeta |
|---|---|
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@scripts/*` | `src/scripts/*` |
| `@lib/*` | `src/lib/*` |
| `@config/*` | `src/config/*` |
| `@app-types/*` | `src/types/*` |
| `@styles/*` | `src/styles/*` |

## Convenciones

- **Páginas finas.** Consultas en `lib/supabase`, transformación en `lib/services`, markup en `components/features`.
- **Scripts de navegador** en `src/scripts/<dominio>/`. El componente que los necesita los carga con `<script>import '@scripts/...';</script>`.
- **Estilos scoped** (`<style>`) viven en el mismo componente que el markup al que afectan.
- **Datos fijos** (textos de listas, URLs de imágenes, tiendas…) en `src/config/`, no dentro del `.astro`.
- **Verificación:** `npx astro check` (0 errores) y `npm run build`.
