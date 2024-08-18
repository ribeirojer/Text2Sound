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
