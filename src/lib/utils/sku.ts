import { DISK_FAMILIES } from '@config/productTaxonomy';

// Medida en mm al final del SKU de un disco (T3R-DISCO-CL-180 → 180).
export function diskSize(sku: string) {
  return Number(sku.match(/(\d+)$/)?.[1]);
}

export function isDiskSku(sku: string) {
  return DISK_FAMILIES.some(({ prefix }) => sku.startsWith(prefix));
}
