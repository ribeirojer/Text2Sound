import React, { useState } from "react";
import Loading from "@/components/Loading";
import axios from "axios";

interface PageSelectorProps {
	id: string;
	numberPages: number;
}

const PageSelector: React.FC<PageSelectorProps> = ({ id, numberPages }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedPageContent, setSelectedPageContent] = useState<string | null>(
		null,
	);
	const [loadingPage, setLoadingPage] = useState(false);
	const [pageError, setPageError] = useState<string>("");
	const [audioUrl, setAudioUrl] = useState<string>(
		"https://kdlazrlkixozkxxqtddm.supabase.co/storage/v1/object/public/text2audio/audios/speech1724003561668.mp3",
	);
	const [loadingAudio, setLoadingAudio] = useState<boolean>(false);

	const fetchPageContent = async (pageNumber: number) => {
		if (!id) return;

		setLoadingPage(true);
		setPageError("");
		setSelectedPageContent(null);

		try {
			const response = await fetch("http://localhost:8000/get-page-content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id, pageNumber }),
			});

			if (!response.ok) {
				throw new Error("Erro ao buscar o conteúdo da página");
			}

			const result = await response.json();
			const { content } = result;

			setSelectedPageContent(content);
		} catch (err) {
			setPageError(`Erro ao buscar o conteúdo da página: ${err}`);
		} finally {
			setLoadingPage(false);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevPage) => prevPage - 1);
			fetchPageContent(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < numberPages) {
			setCurrentPage((prevPage) => prevPage + 1);
			fetchPageContent(currentPage + 1);
		}
	};

	const handleConvert = async (text: string) => {
		if (!text.trim()) {
			setPageError("O texto não pode estar vazio.");
			return;
		}

		if (text.length < 5) {
			setPageError("O texto deve ter pelo menos 5 caracteres.");
			return;
		}

		setLoadingAudio(true);
		setPageError("");

		try {
			const response = await axios.post("/api/text-to-audio", { text });
			const { data } = response;
			setAudioUrl(data.audioUrl);
		} catch (error) {
			console.error("Erro ao converter texto:", error);
			setPageError("Falha ao converter o texto.");
		} finally {
			setLoadingAudio(false);
		}
	};

	React.useEffect(() => {
		fetchPageContent(currentPage);
	}, [currentPage]);

	return (
		<div className="my-4 p-4 border border-gray-300 rounded-md">
			<h3 className="text-lg font-semibold mb-2">
				Foram encontradas {numberPages} páginas:
			</h3>
			<div className="flex justify-between items-center mb-4">
				<button
					onClick={handlePreviousPage}
					disabled={currentPage === 1}
					className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
				>
					Anterior
				</button>
				<span>
					Página {currentPage} de {numberPages}
				</span>
				<button
					onClick={handleNextPage}
					disabled={currentPage === numberPages}
					className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
				>
					Próxima
				</button>
			</div>
			{loadingPage && <Loading message="Carregando conteúdo da página..." />}
			{pageError && <div className="text-red-600 mt-2">{pageError}</div>}
			{selectedPageContent && (
				<div>
					<div>
						<h4 className="text-lg font-semibold mb-2">
							Conteúdo da página {currentPage}:
						</h4>
						<p>{selectedPageContent}</p>
					</div>
					<div className="mt-4">
						<button
							onClick={() => handleConvert(selectedPageContent)}
							className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
						>
							Ouvir o conteúdo dessa página
						</button>
					</div>
				</div>
			)}{" "}
			{loadingAudio && <Loading message="Convertendo texto em áudio..." />}{" "}
			{audioUrl && (
				<audio controls src={audioUrl} className="mt-4">
					Seu navegador não suporta o elemento de áudio.
				</audio>
			)}
		</div>
	);
};

export default PageSelector;
