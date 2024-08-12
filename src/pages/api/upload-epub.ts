import { supabase } from '@/config/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      console.log(req);
      
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing the file:', err);
          return res.status(500).json({ error: 'Erro ao processar o arquivo.' });
        }
        console.log(files);
        console.log(fields);

        const file = files;
        /*
        const fileData = fs.readFileSync(file.filepath);
        const fileName = `${crypto.randomUUID()}_${file.originalFilename}`;

        // Upload para o Supabase Storage
        const { data, error } = await supabase.storage
          .from('epub-files')
          .upload(`epubs/${fileName}`, fileData, {
            contentType: file.mimetype,
          });

        if (error) {
          console.error('Erro ao fazer upload para o Supabase:', error);
          return res.status(500).json({ error: 'Erro ao fazer upload do arquivo.' });
        }*/

        return res.status(200).json({ message: 'Upload bem-sucedido!' });
      });
    } catch (error) {
      console.error('Erro ao processar a requisição:', error);
      res.status(500).json({ error: 'Erro no servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido.`);
  }
}
