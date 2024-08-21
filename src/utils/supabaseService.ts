import { supabase } from "@/config/supabase";

export async function getFileById(id: string) {
	const { data, error } = await supabase
		.from("files")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Erro ao buscar arquivo:", error);
		return null;
	}

	return data;
}

export async function saveAudioUrl(id: string, audioUrls: string[]) {
	const { error } = await supabase
		.from("pages")
		.update({ audio_urls: audioUrls })
		.eq("id", id);

	if (error) {
		console.error("Erro ao salvar URL do áudio:", error);
		return false;
	}

	return true;
}
