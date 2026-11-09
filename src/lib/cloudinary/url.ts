type CldOptions = {
  width?: number;
  /** Alto máximo: con width y height la imagen se ajusta dentro de esa caja (c_fit) sin recortar. */
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto';
  /** Recorta el margen vacío/transparente alrededor del objeto (e_trim) antes de redimensionar. */
  trim?: boolean;
};

export function cld(url: string | null | undefined, { width, height, quality = 'auto', format = 'auto', trim = false }: CldOptions = {}): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const transforms = [`f_${format}`, `q_${quality}`, width ? `w_${width}` : null, height ? `h_${height}` : null, height ? 'c_fit' : null]
    .filter(Boolean)
    .join(',');

  return url.replace('/upload/', `/upload/${trim ? 'e_trim:40/' : ''}${transforms}/`);
}

export function cldDownload(url: string | null | undefined): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/fl_attachment/');
}
