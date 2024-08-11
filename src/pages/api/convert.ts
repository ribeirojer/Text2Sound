import { NextApiRequest, NextApiResponse } from 'next';
import { uploadAudioFile } from '@/utils/uploadAudioFile';
import { convertTextToSpeech } from '@/utils/createAudio';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  ) {  if (req.method === 'POST') {
    const { text } = req.body;
    const now = new Date();
    const speechFile = './audios/speech' + now.getTime() + '.mp3'//path.resolve('./audios/speech' + now.getTime() + '.mp3');
    //const filePath = crypto.randomUUID() + '-' + file.name
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    try {
      const response = await convertTextToSpeech(text)

      if (!response.ok) {
        res.status(500).json({ error: 'Error converting text to speech' });
        return;
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      
      //console.log(`Streaming response to ${speechFile}`);
      //await fs.promises.writeFile(speechFile, buffer);
      //console.log('Finished streaming');
      
      const audioUrl = await uploadAudioFile(speechFile, buffer)
           
      if(!audioUrl){
        res.status(500).json({ error: 'Error uploading audio file' });
        return;
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
