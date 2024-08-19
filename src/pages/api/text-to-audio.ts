import { convertTextToSpeech, createWordTimings } from "@/utils/createAudio";
import { saveAudioUrl } from "@/utils/supabaseService";
import { uploadAudioFile } from "@/utils/uploadAudioFile";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		const { text, id } = req.body;
		const now = new Date();
		const speechFile = `./audios/speech${now.getTime()}.mp3`; //path.resolve('./audios/speech' + now.getTime() + '.mp3');

		if (!text) {
			return res.status(400).json({ error: "Text is required" });
		}

		try {
			const response = await convertTextToSpeech(text);

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
			
			if (id) {
				await saveAudioUrl(
					id,
					audioUrl,
				);
			}
			const wordTimings = [{}]; /*await createWordTimings(audioUrl);

			if (!wordTimings) {
				res.status(500).json({ error: "Error creating word timings" });
				return;
			}*/

			res.status(200).json({ audioUrl, wordTimings });
		} catch (error) {
			console.error("Error processing text:", error);
			res.status(500).json({ error: "Error processing text" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
