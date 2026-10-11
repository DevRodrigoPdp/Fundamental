import { SITE } from '@config/site';

interface MailtoProduct {
  nombre: string;
  sku: string;
  categoria?: string;
  subcategoria?: string | null;
}

function mailto(subject: string, body: string) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Solicitud de disponibilidad y precio de un producto.
export function productRequestMailto(p: MailtoProduct) {
  return mailto(
    `Solicitud T3R — ${p.nombre}`,
    `Hola,\n\nMe interesa el siguiente producto T3R:\n\nProducto: ${p.nombre}\nReferencia (SKU): ${p.sku}\nCategoría: ${p.categoria}${p.subcategoria ? ' / ' + p.subcategoria : ''}\n\nPor favor, indícame disponibilidad y precio.\n\nGracias.`
  );
}

// Aviso de reposición de un producto agotado.
export function restockMailto(p: MailtoProduct) {
  return mailto(
    `Avísame cuando haya stock — ${p.nombre}`,
    `Hola,\n\nMe interesa el siguiente producto T3R y está agotado temporalmente:\n\nProducto: ${p.nombre}\nReferencia (SKU): ${p.sku}\n\nPor favor, avisadme cuando vuelva a haber stock.\n\nGracias.`
  );
}
