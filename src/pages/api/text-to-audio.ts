import { convertTextToSpeech, createWordTimings } from "@/utils/createAudio";
import { saveAudioUrl } from "@/utils/supabaseService";
import { uploadAudioFile } from "@/utils/uploadAudioFile";
import type { NextApiRequest, NextApiResponse } from "next";

const MAX_TEXT_LENGTH = 4096;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { text, id } = req.body;
    console.log(text);
    console.log(id);
    const now = new Date();

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    try {
      let audioUrls: string[] = [];
      let wordTimings: any[] = [];

      // Dividir o texto em parágrafos
      const paragraphs = text.split(/\n+/);

      let textParts: string[] = [];
      let currentPart = "";

      for (const paragraph of paragraphs) {
        if ((currentPart + paragraph).length <= MAX_TEXT_LENGTH) {
          // Adiciona o parágrafo atual à parte atual
          currentPart += (currentPart ? "\n" : "") + paragraph;
        } else {
          // Adiciona a parte atual à lista de partes e inicia uma nova parte com o parágrafo atual
          if (currentPart) textParts.push(currentPart);
          currentPart = paragraph;
        }
      }

      // Adiciona a última parte, se houver
      if (currentPart) textParts.push(currentPart);
      
      textParts.forEach(async (part, index) => {
        const speechFile = `./audios/speech${now.getTime()}_${index}.mp3`;
      
        const response = await convertTextToSpeech(part);
      
        if (!response.ok) {
          res.status(500).json({ error: "Error converting text to speech" });
          return;
        }
      
        const buffer = Buffer.from(await response.arrayBuffer());
        const audioUrl = await uploadAudioFile(speechFile, buffer);
      
        if (!audioUrl) {
          res.status(500).json({ error: "Error uploading audio file" });
          return;
        }
      
        audioUrls.push(audioUrl);
      
        /**
        const timings = await createWordTimings(audioUrl);
        if (timings) {
          wordTimings.push(...timings);
        } */
      });
      
      if (id) {
        await saveAudioUrl(id, audioUrls);
      }

      res.status(200).json({ audioUrls, wordTimings });
    } catch (error) {
      console.error("Error processing text:", error);
      res.status(500).json({ error: "Error processing text" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
