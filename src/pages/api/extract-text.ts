import type { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import pdfParse from 'pdf-parse';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
      }
    
      try {
        console.log(req.body)
        const buffer = Buffer.from(req.body);

        const data = await pdfParse(buffer);
        console.log(data)
        res.status(200).json({ text: data.text });
      } catch (error) {
        res.status(500).json({ message: 'Erro ao processar PDF' });
      }}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Aumente o limite de tamanho do arquivo, se necessário
    },
  },
};