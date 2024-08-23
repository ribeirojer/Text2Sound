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
    console.log(req);
    
    
    /** 
    import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("/path/to/file/audio.mp3"),
    model: "whisper-1",
  });

  console.log(transcription.text);
}
main();*/
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}