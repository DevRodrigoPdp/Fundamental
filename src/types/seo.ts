export type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

// Metadatos SEO que recibe BaseLayout.
export interface PageSeo {
  title?: string;
  description?: string;
  heroImage?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  canonicalPath?: string;
  structuredData?: StructuredData;
}
