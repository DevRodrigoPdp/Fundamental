# Plan tienda online — fundamentalbikeparts.com

Última actualización: 2026-10-11
**Estado (2026-10-12): en pausa.** El cliente no quiere pagar la integración de PayPal por ahora.

Ramas:
- `main`: reorganización del proyecto (en producción). No incluye la cesta.
- `feature/cesta-v2`: cesta terminada y probada sobre `main`. **Punto de partida si se retoma.** No llevar a `main` sin pago (o hacerlo oculta tras `PUBLIC_SHOP_ENABLED`).

Estructura del código: ver `docs/estructura.md`.

---

## 1. Objetivo

Vender online a **particulares (B2C) como invitado**, sin registro:

1. El cliente añade productos a una cesta guardada en su navegador.
2. Rellena sus datos de envío.
3. Paga con **PayPal** o por **transferencia bancaria**.
4. La tienda recibe un email con el pedido y los datos de envío para prepararlo.

Las empresas compran igual que un particular por ahora. La venta B2B con cuentas queda para una fase posterior (ver §8).

---

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Tipo de venta | B2C como invitado. Sin cuentas de usuario. |
| Empresas | Compran como cliente normal. B2B más adelante. |
| Hosting | Vercel |
| Base de datos | Un único proyecto Supabase (plan gratuito) |
| Entorno de pruebas | Sin segundo proyecto: se prueba en producción **solo con el producto de prueba** y PayPal Sandbox |
| Producto de prueba | Portabidón T3R Negro · id `65` · SKU `T3R-PORTABIDON-NEGRO` |
| Envío | Gratis siempre. Solo España. |
| Stock | Stock real por producto. No se vende sin stock. |
| Pagos | PayPal + transferencia bancaria |
| Email de pruebas | rpuertadelpozo@gmail.com |

---

## 3. Hecho ✅ — Cesta en localStorage

**Rama `feature/cesta`** (subida a GitHub) · commit `22c0c9f feat: cesta de compra en localStorage`.
Después, la rama `refactor/estructura` (commit `ae1e17e`) reorganizó esos mismos archivos en módulos sin cambiar el comportamiento.

**Qué hace**
- **Ficha de producto:** selector de cantidad con botones − / + (limitado al stock, máx. 20), botón **Añadir a la cesta**, aviso "Añadido a la cesta · Ver cesta" y enlace secundario "¿Dudas? Consúltanos por email".
- **Catálogo:** las tarjetas vendibles muestran el precio y un botón **Añadir a la cesta** (cambia a "Añadido ✓" durante un momento). Las familias con varias medidas (discos) muestran "Elegir medida"; el resto, "Consultar precio".
- Los botones de compra solo aparecen si el producto es vendible: `activo = true`, precio > 0 y stock > 0. Si no, se mantiene "Solicitar por email".
- **Cabecera:** icono de cesta con contador, sincronizado entre pestañas.
- **Página `/cesta`:** precio y stock consultados en vivo, cambiar cantidad, eliminar, subtotal, envío gratis y total. No indexada en Google.
- Botón **Tramitar pedido** desactivado ("Pago disponible próximamente").
- Scripts del navegador sacados de los componentes `.astro` a `src/scripts/`.

**Seguridad de la cesta**
- Solo guarda IDs y cantidades (`fbp_cart_v1`). Nunca precios ni datos personales.
- Lectura defensiva: JSON roto, IDs falsos o cantidades enormes se descartan o recortan sin romper la web.
- Cantidad 1–20 por producto, máx. 50 líneas, caduca a los 7 días.
- Si la cantidad supera el stock actual, se recorta y se avisa.

**Archivos en `feature/cesta`**
| Archivo | Qué es |
|---|---|
| `src/lib/cart.ts` | Guardar y validar la cesta |
| `src/scripts/cesta.ts` | Pinta `/cesta` con datos en vivo |
| `src/scripts/producto.ts` | Selector − / + y añadir desde la ficha |
| `src/scripts/catalogo.ts` | Buscador, filtros y añadir desde las tarjetas |
| `src/scripts/nav.ts` | Menú y contador de la cesta |
| `src/pages/cesta.astro` | Página de la cesta |
| `src/pages/catalogo.astro`, `catalogo/[sku].astro`, `components/Nav.astro` | Botones, precio e icono |
| `docs/spec-checkout.md` | Spec inicial del checkout (ver nota abajo) |

**Los mismos archivos tras `refactor/estructura`**
- Lógica: `src/lib/services/cart.ts`, `cartProducts.ts`, `availability.ts`, `src/types/cart.ts`
- Scripts: `src/scripts/cart/*`, `src/scripts/product/addToCart.ts`, `src/scripts/catalog/cardAddToCart.ts`, `src/scripts/layout/nav.ts`
- Componentes: `src/components/features/cart/*`, `NavCartLink.astro`, `ProductPurchase.astro`, `CatalogCardAction.astro`
- Página: `src/pages/cesta.astro`

> **Nota sobre `docs/spec-checkout.md`:** se escribió cuando la idea era tener un esquema `staging` y una rama `pre`. Esa parte queda **sustituida** por este documento: no hay entorno de pre y se prueba en producción solo con el portabidón. El resto del spec (formulario, cesta, seguridad, stock) sigue siendo válido.

**Probado** (Playwright): añadir desde la ficha y desde el catálogo, contador, cantidades, recorte al stock, producto inexistente, JSON corrupto, cesta vacía y vista móvil.

---

## 4. Pendiente 🔲 — Por fases

### Fase 2 — Base de datos de pedidos (Supabase)
- [ ] Tablas `pedidos`, `detalles_pedido` y `pagos_eventos` en el esquema `public`.
- [ ] Estados del pedido: `pendiente_pago → pagado → en_preparacion → enviado → entregado` (+ `cancelado`, `expirado`, `reembolsado`). Un trigger impide los saltos no válidos.
- [ ] **Seguridad (RLS):** el público no puede leer ni escribir pedidos. Solo el servidor (Edge Functions).
- [ ] Función que **crea el pedido y descuenta stock en una sola operación**, para no vender más de lo que hay.
- [ ] Referencia de pedido única y no adivinable: `FBP-XXXXXXXX`.
- [ ] Se guardan precio y nombre del producto en el momento de la compra (por si cambian después).

### Fase 3 — Checkout + transferencia bancaria
- [ ] Página `/checkout` con formulario de envío:

  | Campo | Regla |
  |---|---|
  | Nombre y apellidos | obligatorio |
  | Email | obligatorio |
  | Teléfono | obligatorio (para el transportista) |
  | Dirección + línea 2 | obligatoria / opcional |
  | Código postal | 5 dígitos |
  | Ciudad, provincia | obligatorios |
  | Notas | opcional |
  | Acepto condiciones y privacidad | obligatorio |

- [ ] Edge Function `crear-pedido`: valida los datos, **recalcula precios en el servidor** (nunca se fía del navegador), reserva stock y crea el pedido.
- [ ] Pago por transferencia: pedido `pendiente_pago`, se muestran importe y referencia para el concepto. Reserva de stock 72 h.
- [ ] Página `/pedido/confirmado` con el resumen y la referencia.
- [ ] La cesta se vacía al confirmar.
- [ ] Protección antispam: límite de peticiones y campo trampa.

### Fase 4 — Emails
- [ ] Cuenta en Resend (gratis, 3.000 emails/mes).
- [ ] Email a la tienda: **pedido nuevo** con productos, datos de envío y método de pago.
- [ ] Email al cliente: confirmación (+ datos bancarios si es transferencia).
- [ ] Más adelante: dominio propio verificado para que no lleguen a spam.

### Fase 5 — PayPal
- [ ] Crear app en developer.paypal.com → credenciales **Sandbox** (dinero ficticio).
- [ ] Botón PayPal en el checkout (permite pagar también con tarjeta).
- [ ] El pago se **captura y verifica en el servidor** (importe, moneda, pedido).
- [ ] Webhook de respaldo por si el cliente cierra el navegador antes de terminar.
- [ ] Reserva de stock 30 min mientras paga.
- [ ] Al terminar las pruebas: cambiar a credenciales **Live**.

### Fase 6 — Operación y legal
- [ ] Caducidad automática (`pg_cron`): transferencias sin pagar en 72 h → `expirado` y stock devuelto.
- [ ] Gestión desde el panel de Supabase: marcar pagado / enviado.
- [ ] Páginas legales **obligatorias** para vender online en España: condiciones de venta, devoluciones (14 días), privacidad. Los textos los aporta el cliente o su asesor.

### Fase 7 — Paso a producción
- [ ] PayPal Live.
- [ ] Compra real con el portabidón + reembolso.
- [ ] Borrar pedidos de prueba.
- [ ] Activar productos reales: precio y stock en Supabase.

---

## 5. Datos que faltan del cliente

| Dato | Para qué | Bloquea |
|---|---|---|
| IBAN y titular de la cuenta | Pago por transferencia | Fase 3 (se puede avanzar con texto provisional) |
| ¿Precios con IVA incluido? | Textos de la cesta y facturas | Fase 3 |
| Email que recibe los pedidos (producción) | Avisos de pedido nuevo | Fase 4 |
| Cuenta PayPal Business | Cobros por PayPal | Fase 5 |
| Textos legales | Condiciones, devoluciones, privacidad | Fase 6 |
| Precio y stock de los productos a vender | Que aparezca el botón de compra | Fase 7 |

---

## 6. Riesgos a tener en cuenta

- **Vercel Hobby (gratis) no permite uso comercial.** Una tienda que cobra debería estar en Vercel Pro (~20 $/mes).
- **Supabase gratis se pausa tras 7 días sin actividad.** Si la web tiene poco tráfico, el pago podría dejar de funcionar. Opciones: Supabase Pro (~25 $/mes) o una tarea periódica que lo mantenga activo.
- **Pruebas en producción:** se usan solo el portabidón y PayPal Sandbox. Hay que borrar los pedidos de prueba y revisar el stock antes de abrir la tienda.
- **Las fichas de producto se generan al publicar la web.** Si cambia el precio o el stock, el botón de compra no se actualiza hasta el siguiente despliegue. La cesta y el pago sí usan siempre datos en vivo.

---

## 7. Presupuesto estimado (B2C como invitado)

Estimación en horas. Tarifa por definir: **total = horas × tarifa**.

| # | Trabajo | Horas | Estado |
|---|---|---|---|
| 1 | Cesta en localStorage (ficha, catálogo, cabecera, página `/cesta`) | 8 | ✅ Hecho |
| 2 | Base de datos de pedidos, seguridad y control de stock | 6 | 🔲 |
| 3 | Checkout: formulario de envío y validaciones | 6 | 🔲 |
| 4 | Servidor (Edge Functions): crear y consultar pedido | 8 | 🔲 |
| 5 | Pago por transferencia y página de confirmación | 4 | 🔲 |
| 6 | Integración PayPal (Sandbox → Live, captura, webhook) | 10 | 🔲 |
| 7 | Emails a cliente y tienda | 5 | 🔲 |
| 8 | Caducidad de pedidos y gestión desde el panel | 3 | 🔲 |
| 9 | Maquetación de páginas legales (textos del cliente) | 3 | 🔲 |
| 10 | Pruebas completas y paso a producción | 6 | 🔲 |
| | **Total** | **59 h** | 8 h hechas · 51 h pendientes |

**Costes mensuales aproximados** (no incluidos en el desarrollo; verificar tarifas vigentes):

| Servicio | Coste |
|---|---|
| Vercel Pro | ~20 $/mes |
| Supabase | 0 € (gratis) o ~25 $/mes (Pro, recomendado) |
| Resend | 0 € hasta 3.000 emails/mes |
| PayPal | Comisión por venta (aprox. 2,9 % + 0,35 €) |
| Transferencia | Sin comisión |

---

## 8. Futuro — B2B (empresas)

Aparcado. Por ahora las empresas compran como un particular.

**Preguntas para el cliente antes de diseñarlo**
1. ¿Los profesionales tienen precios distintos o descuentos por volumen?
2. ¿Deben estar ocultos los precios si no se ha iniciado sesión?
3. ¿Pago a 30 días o domiciliación para empresas?
4. ¿Factura automática?
5. ¿Pedido mínimo profesional?
6. ¿Venta a empresas de fuera de España? (cambia el IVA)

**Enfoque previsto**
- Cuentas con Supabase Auth; el alta de empresa la aprueba la tienda.
- Datos de empresa: razón social, CIF/NIF, dirección de facturación separada de la de envío.
- Tarifa profesional: los precios se cargarían en el navegador tras iniciar sesión, y solo para cuentas aprobadas (hoy los precios quedan fijados en las páginas al publicar).
- Historial de pedidos y, si hace falta, facturación.
- La cesta en localStorage sigue sirviendo; al iniciar sesión se puede pasar a la cuenta.

**Para no cerrar la puerta:** al crear las tablas de pedidos (fase 2) conviene dejar una columna `user_id` opcional, para que no haga falta migrar después.
