import { supabaseAdmin } from '@lib/supabase/admin';
import { cloudinary } from '@lib/cloudinary/client';
import { AdminError } from './http';

// (producto_sku, orden) tiene un constraint único: los cambios de orden pasan por
// valores negativos temporales para no chocar con el valor que se está liberando.

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

// Deja el orden de las fotos de un SKU en 1..n sin huecos.
async function renumberImages(sku: string) {
  const { data: remaining } = await supabaseAdmin
    .from('imagenes_productos')
    .select('id, orden')
    .eq('producto_sku', sku)
    .order('orden', { ascending: true });

  const rows = remaining ?? [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].orden !== i + 1) {
      await supabaseAdmin.from('imagenes_productos').update({ orden: -(i + 1) }).eq('id', rows[i].id);
    }
  }
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].orden !== i + 1) {
      await supabaseAdmin.from('imagenes_productos').update({ orden: i + 1 }).eq('id', rows[i].id);
    }
  }
}

// Sube una foto a Cloudinary y la añade al final del producto.
export async function uploadProductImage(sku: string, file: File) {
  const { data: existing } = await supabaseAdmin
    .from('imagenes_productos')
    .select('orden')
    .eq('producto_sku', sku)
    .order('orden', { ascending: false })
    .limit(1);

  const nextOrden = (existing?.[0]?.orden ?? 0) + 1;

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicId = `catalogo_t3r/admin/${sku}-${Date.now()}`;

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ public_id: publicId }, (err, result) =>
      err ? reject(err) : resolve(result)
    );
    stream.end(buffer);
  }).catch((e: Error) => ({ error: e.message }));

  if (uploadResult.error) throw new AdminError(uploadResult.error);

  const { data, error } = await supabaseAdmin
    .from('imagenes_productos')
    .insert({ producto_sku: sku, url: uploadResult.secure_url, orden: nextOrden })
    .select()
    .single();

  if (error) throw new AdminError(error.message);
  return data;
}

// Borra la foto (fila + Cloudinary) y renumera las restantes.
export async function deleteImage(id: string) {
  const { data: image } = await supabaseAdmin
    .from('imagenes_productos')
    .select('url, producto_sku')
    .eq('id', id)
    .single();

  const { error } = await supabaseAdmin.from('imagenes_productos').delete().eq('id', id);
  if (error) throw new AdminError(error.message);

  if (image?.url) {
    const publicId = extractPublicId(image.url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
  }

  if (image?.producto_sku) await renumberImages(image.producto_sku);
}

// Intercambia la foto con la anterior/siguiente. false si ya estaba en el extremo.
export async function moveImage(id: string, direction: 'up' | 'down'): Promise<boolean> {
  const { data: current } = await supabaseAdmin
    .from('imagenes_productos')
    .select('id, producto_sku, orden')
    .eq('id', id)
    .single();

  if (!current) throw new AdminError('Imagen no encontrada', 404);

  const { data: siblings } = await supabaseAdmin
    .from('imagenes_productos')
    .select('id, orden')
    .eq('producto_sku', current.producto_sku)
    .order('orden', { ascending: true });

  const list = siblings ?? [];
  const index = list.findIndex((row) => row.id === current.id);
  const neighborIndex = direction === 'up' ? index - 1 : index + 1;
  if (neighborIndex < 0 || neighborIndex >= list.length) return false;

  const neighbor = list[neighborIndex];
  const { error: e1 } = await supabaseAdmin.from('imagenes_productos').update({ orden: -1 }).eq('id', current.id);
  const { error: e2 } = await supabaseAdmin.from('imagenes_productos').update({ orden: current.orden }).eq('id', neighbor.id);
  const { error: e3 } = await supabaseAdmin.from('imagenes_productos').update({ orden: neighbor.orden }).eq('id', current.id);

  const error = e1 || e2 || e3;
  if (error) throw new AdminError(error.message);
  return true;
}
