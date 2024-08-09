import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { uploadAudioFile } from '@/utils/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ) {  if (req.method === 'POST') {
    const { text } = req.body;
    const now = new Date();
    const speechFile = path.resolve('./speech' + now.getTime() + '.mp3');

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.audio.speech.create({
        input: text,
        model: "tts-1",
        voice: 'alloy',
      });
      
      const buffer = Buffer.from(await response.arrayBuffer());
      
      console.log(`Streaming response to ${speechFile}`);
      await fs.promises.writeFile(speechFile, buffer);
      console.log('Finished streaming');
      
      const audioUrl = await uploadAudioFile(speechFile)
           
      if(!audioUrl){
        return
      }
      res.status(200).json({ audioUrl });
    } catch (error) {
      console.error('Error processing text:', error);
      res.status(500).json({ error: 'Error processing text' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
