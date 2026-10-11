export type CatalogFamily = {
  slug: string;
  cat: string;
  tag: string;
  text: string;
  description: string;
  details: string[];
  img: string;
  skuPrefixes: string[];
  subcategories?: string[];
};
