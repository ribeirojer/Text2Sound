import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://your-project-url.supabase.co', 'your-public-anon-key');

export async function uploadAudioFile(file: string | ArrayBuffer | ArrayBufferView | Blob | Buffer | File | FormData | NodeJS.ReadableStream | ReadableStream<Uint8Array> | URLSearchParams) {
  // Substitua "your-bucket-name" pelo nome do bucket que você criou no Supabase
  const { data, error } = await supabase.storage.from('your-bucket-name').upload(`audios/${file}`, file, {
    contentType: 'audio/mpeg', // ou o tipo MIME do arquivo de áudio
  });

  if (error) {
    console.error('Erro ao fazer upload do áudio:', error);
    return;
  }

  console.log('Arquivo de áudio carregado com sucesso:', data);
  // Retorna a URL do arquivo para uso futuro
  const { data: { publicUrl } } = supabase.storage.from('your-bucket-name').getPublicUrl(data.path);
  return publicUrl;
}
