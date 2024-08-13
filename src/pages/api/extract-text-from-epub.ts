import { extractTextFromEPUB } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		try {
			// Exemplo de uso
			extractTextFromEPUB("Nos Cumes do Desespero - Emil Cioran.epub")
				.then((textContents) => {
					textContents.forEach((text, index) => {
						console.log(`Página ${index + 1}:`);
						console.log(text);
					});
				})
				.catch((err) => {
					console.error("Erro ao extrair o texto:", err);
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
