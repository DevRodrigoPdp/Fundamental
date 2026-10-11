export type SubcategoriaInfo = {
  subcategoria: string;
  categoria: string;
  filtro: string | null;
  skuPrefix: string;
};

export const SUBCATEGORIAS: SubcategoriaInfo[] = [
  { subcategoria: 'Pastillas de freno', categoria: 'Frenos', filtro: 'Pastillas', skuPrefix: 'T3R-PAST' },
  { subcategoria: 'Cables', categoria: 'Transmisión', filtro: 'Cable', skuPrefix: 'T3R-CBL' },
  { subcategoria: 'Camisas', categoria: 'Transmisión', filtro: 'Fundas', skuPrefix: 'T3R-CAMISA' },
  { subcategoria: 'Topes de cable', categoria: 'Transmisión', filtro: 'Topes', skuPrefix: 'T3R-TOPE' },
  { subcategoria: 'Discos 6 tornillos', categoria: 'Frenos', filtro: 'Discos', skuPrefix: 'T3R-DISCO-6T' },
  { subcategoria: 'Discos Center Lock', categoria: 'Frenos', filtro: 'Discos', skuPrefix: 'T3R-DISCO-CL' },
  { subcategoria: 'Platos', categoria: 'Transmisión', filtro: 'Platos', skuPrefix: 'T3R-PLATO' },
  { subcategoria: 'Ejes', categoria: 'Pedalier', filtro: 'Cajas de pedalier', skuPrefix: 'T3R-EJE' },
  { subcategoria: 'Automáticos', categoria: 'Pedales', filtro: 'Pedales', skuPrefix: 'T3R-PED-AUTO' },
  { subcategoria: 'Carretera', categoria: 'Pedales', filtro: 'Pedales', skuPrefix: 'T3R-PED-CARR' },
  { subcategoria: 'Mixtos', categoria: 'Pedales', filtro: 'Pedales', skuPrefix: 'T3R-PED-MIX' },
  { subcategoria: 'Plataforma', categoria: 'Pedales', filtro: 'Pedales', skuPrefix: 'T3R-PED-PLAT' },
  { subcategoria: 'Puños', categoria: 'Manillar', filtro: 'Puños', skuPrefix: 'T3R-PUNO' },
  { subcategoria: 'Kits de purga', categoria: 'Herramientas', filtro: 'Kit purgado', skuPrefix: 'T3R-KIT' },
  { subcategoria: 'Válvulas', categoria: 'Válvulas y Cámaras', filtro: 'Válvulas', skuPrefix: 'T3R-VLV' },
  { subcategoria: 'Obuses', categoria: 'Válvulas y Cámaras', filtro: 'Válvulas', skuPrefix: 'T3R-OBUS' },
  { subcategoria: 'Portabidones', categoria: 'Accesorios', filtro: null, skuPrefix: 'T3R-PORTABIDON' },
];

const FILTER_ORDER = [
  'Pastillas',
  'Cable',
  'Fundas',
  'Topes',
  'Discos',
  'Platos',
  'Cajas de pedalier',
  'Pedales',
  'Puños',
  'Kit purgado',
  'Válvulas',
];

export function getCatalogFilters() {
  return FILTER_ORDER.map((label) => ({
    label,
    subcategorias: SUBCATEGORIAS.filter((s) => s.filtro === label).map((s) => s.subcategoria),
  }));
}

const ADMIN_FILTER_ORDER = [
  'Pastillas',
  'Cable',
  'Fundas',
  'Topes',
  'Discos',
  'Platos',
  'Cajas de pedalier',
  'Pedales',
  'Puños',
  'Kit purgado',
  'Válvulas',
];

export function getAdminCatalogFilters() {
  return ADMIN_FILTER_ORDER.map((label) => ({
    label,
    subcategorias: SUBCATEGORIAS.filter((s) => s.filtro === label).map((s) => s.subcategoria),
  }));
}

export function findSkuPrefix(subcategoria: string | null): string | null {
  return SUBCATEGORIAS.find((s) => s.subcategoria === subcategoria)?.skuPrefix ?? null;
}

export const DISK_FAMILIES = [
  { prefix: 'T3R-DISCO-6T-', nombre: 'Discos de freno 6 tornillos' },
  { prefix: 'T3R-DISCO-CL-', nombre: 'Discos de freno Center Lock' },
];

export function getSubcategoriasAgrupadas() {
  const grouped: { filtro: string; opciones: SubcategoriaInfo[] }[] = [];
  const sinFiltro: SubcategoriaInfo[] = [];

  for (const label of ADMIN_FILTER_ORDER) {
    grouped.push({ filtro: label, opciones: SUBCATEGORIAS.filter((s) => s.filtro === label) });
  }
  SUBCATEGORIAS.filter((s) => !s.filtro).forEach((s) => sinFiltro.push(s));
  if (sinFiltro.length > 0) grouped.push({ filtro: 'Otras', opciones: sinFiltro });

  return grouped;
}
