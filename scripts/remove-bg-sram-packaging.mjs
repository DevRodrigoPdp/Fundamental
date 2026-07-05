import { removeBackground } from '@imgly/background-removal-node';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SRC_URL = 'https://res.cloudinary.com/dxent4dkd/image/upload/v1783166595/catalogo_t3r/pastillas_freno/pastillas_freno_sram_guide_2011_code_1.jpg';
const IMAGE_ID = 136;

const blob = await removeBackground(SRC_URL);
const buffer = Buffer.from(await blob.arrayBuffer());

const res = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { public_id: 'catalogo_t3r/pastillas_freno/pastillas_freno_sram_guide_packaging_cutout', overwrite: true },
    (err, result) => (err ? reject(err) : resolve(result))
  );
  stream.end(buffer);
});

console.log('Subida:', res.secure_url);

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const { data, error } = await supabase
  .from('imagenes_productos')
  .update({ url: res.secure_url })
  .eq('id', IMAGE_ID)
  .select();
console.log(data, error);
