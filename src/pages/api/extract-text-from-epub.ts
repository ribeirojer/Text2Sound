import { extractTextFromEPUB } from "@/utils";
import { getFileById } from "@/utils/supabaseService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		const { id } = req.body;
		try {
			const epub = await getFileById(id);
			const textContents = await extractTextFromEPUB(epub.public_url);

			textContents.forEach((text, index) => {
				console.log(`Página ${index + 1}:`);
				console.log(text);
			});

			res.status(200).json({ audioUrl: "" });
		} catch (error) {
			console.error("Error processing text:", error);
			res.status(500).json({ error: "Error processing text" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
