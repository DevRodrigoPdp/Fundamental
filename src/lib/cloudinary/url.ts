type CldOptions = {
  width?: number;
  quality?: 'auto' | number;
  format?: 'auto';
};

export function cld(url: string | null | undefined, { width, quality = 'auto', format = 'auto' }: CldOptions = {}): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const transforms = [`f_${format}`, `q_${quality}`, width ? `w_${width}` : null]
    .filter(Boolean)
    .join(',');

  return url.replace('/upload/', `/upload/${transforms}/`);
}

export function cldDownload(url: string | null | undefined): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/fl_attachment/');
}
