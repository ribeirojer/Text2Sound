import { openai } from "@/config/openai";

export async function convertTextToSpeech(text: string) {
    const response = await openai.audio.speech.create({
        input: text,
        model: "tts-1",
        voice: 'alloy',
    });

    return response;
}
