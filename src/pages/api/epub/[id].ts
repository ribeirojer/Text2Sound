import { supabase } from "@/config/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { id } = req.query;

	const { data, error } = await supabase
		.from("files")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		return res.status(404).json({ message: "Livro não encontrado", error });
	}

	return res.status(200).json(data);
}
