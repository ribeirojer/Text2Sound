// pages/api/convert.js
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ) {  if (req.method === 'POST') {
    const { text } = req.body;
    const now = new Date();
    const speechFile = path.resolve(__dirname, './speech' + now.getTime() + '.mp3');

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.audio.speech.create({
        input: text,
        model: "tts-1",
        voice: 'alloy', // Ajuste conforme necessário
      });

      const audioUrl = response.body;

      if(!audioUrl){
        return
      }

      console.log(`Streaming response to ${speechFile}`);
      await streamToFile(audioUrl, speechFile);
      console.log('Finished streaming');
    
      res.status(200).json({ audioUrl });
    } catch (error) {
      console.error('Error processing text:', error);
      res.status(500).json({ error: 'Error processing text' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

async function streamToFile(stream: any, path: fs.PathLike) {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(path).on('error', reject).on('finish', resolve);
  
      // If you don't see a `stream.pipe` method and you're using Node you might need to add `import 'openai/shims/node'` at the top of your entrypoint file.
      stream.pipe(writeStream).on('error', (error: any) => {
        writeStream.close();
        reject(error);
      });
    });
  }