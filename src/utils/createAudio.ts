import fs from "node:fs";
import path from "node:path";
import { openai } from "@/config/openai";
import axios from "axios";

export async function convertTextToSpeech(text: string) {
	const response = await openai.audio.speech.create({
		input: text,
		model: "tts-1",
		voice: "alloy",
	});

	return response;
}

export async function createWordTimings(filePath: string, granularities: "word" | "segment" = "segment") {
	try {
		// Baixar o arquivo remoto
		const response = await axios.get(filePath, { responseType: "arraybuffer" });

		// Criar um caminho temporário para salvar o arquivo
		const tempFilePath = path.join(__dirname, "temp_audio.mp3");

		// Salvar o arquivo localmente
		fs.writeFileSync(tempFilePath, response.data);

		// Criar a transcrição
		const transcription = await openai.audio.transcriptions.create({
			file: fs.createReadStream(tempFilePath),
			model: "whisper-1",
			response_format: "verbose_json",
			timestamp_granularities: [granularities],
		});

		console.log(transcription);

		// Remover o arquivo temporário
		fs.unlinkSync(tempFilePath);
		return transcription;
	} catch (error) {
		console.error("Error processing text:", error);
		return null;
	}
}
