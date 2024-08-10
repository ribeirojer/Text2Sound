import { supabase } from "@/config/supabase";

export async function uploadAudioFile(file: string, buffer: Buffer) {
  // Substitua "your-bucket-name" pelo nome do bucket que você criou no Supabase
  const { data, error } = await supabase.storage.from('text2audio').upload(`${file}`, buffer, {
    contentType: 'audio/mpeg', // ou o tipo MIME do arquivo de áudio
  });

  if (error) {
    console.error('Erro ao fazer upload do áudio:', error);
    return null;
  }

  console.log('Arquivo de áudio carregado com sucesso:', data);
  // Retorna a URL do arquivo para uso futuro
  const { data: { publicUrl } } = supabase.storage.from('text2audio').getPublicUrl(data.path);
  return publicUrl;
}
