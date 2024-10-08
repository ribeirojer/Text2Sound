import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import useBookDetails from "@/hooks/useBookDetails";
import { useRouter } from "next/router";
import PageSelector from "@/components/PageSelector";
import axiosClient from "@/utils/httpService";

const BookDetails: React.FC = () => {
	const router = useRouter();// Force refresh the page
	const { id } = router.query;
	const { book, loading, error } = useBookDetails(id);
	const [extracting, setExtracting] = useState(false);
	const [isExtract, setIsExtract] = useState<boolean>(false);
	const [extractError, setExtractError] = useState<string | null>(null);

	useEffect(() => {
		if (book?.is_extract_text !== undefined) {
			setIsExtract(book.is_extract_text);
		}
	}, [book]);

	const handleExtractText = async () => {
		if (!id) return;

		setExtracting(true);
		setExtractError(null);

		try {
			const response = await axiosClient.post("/extract-text", { id });
			console.log(response);

			if (!response.data) {
				throw new Error("Erro ao extrair texto");
			}

			const result = response.data;
			const { success, message } = result;

			if (!success) {
				throw new Error(message);
			}
			setIsExtract(true);
            router.reload();
		} catch (err) {
			console.error(err);
			setExtractError(`Erro ao extrair texto: ${err}`);
		} finally {
			setExtracting(false);
		}
	};

	if (loading) {
		return <Loading message="Carregando detalhes do livro..." />;
	}

	if (error) {
		return (
			<Layout>
				<div
					className="max-w-lg mx-auto mt-10 text-center"
					role="alert"
					aria-live="assertive"
				>
					<h1 className="text-2xl font-bold mb-4">Erro</h1>
					<p>{error}</p>
				</div>
			</Layout>
		);
	}

	if (!book) {
		return (
			<Layout>
				<div
					className="max-w-lg mx-auto mt-10 text-center"
					role="alert"
					aria-live="assertive"
				>
					<h1 className="text-2xl font-bold mb-4">Livro não encontrado</h1>
					<p>O livro que você está tentando acessar não foi encontrado.</p>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="max-w-lg mx-auto mt-10">
				<h1 className="text-2xl font-bold mb-6">
					{book.filename.split("-").slice(1).join(" ")}
				</h1>
				{isExtract ? (
					<PageSelector
						id={id as string}
						numberPages={book.number_of_pages}
					/>
				) : (
					<button
						onClick={handleExtractText}
						className="w-full mb-4 px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
						disabled={extracting}
						aria-busy={extracting}
						aria-live="polite"
						data-testid="extract-text-button"
					>
						{extracting ? "Extraindo..." : "Extrair Texto"}
					</button>
				)}
				{extracting && (
					<Loading
						message="Aguarde, estamos extraindo o texto..."
						aria-live="assertive"
						data-testid="loading-indicator"
					/>
				)}
				{extractError && (
					<div
						className="text-red-600 mb-4"
						role="alert"
						aria-live="assertive"
						data-testid="extract-error"
					>
						{extractError}
					</div>
				)}
				<a
					href={book.public_url}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full px-4 py-2 text-white bg-blue-600 rounded-md block text-center hover:bg-blue-700"
					aria-label={`Baixar EPUB ${book.filename}`}
					data-testid="download-epub-link"
				>
					Baixar EPUB
				</a>
			</div>
		</Layout>
	);
};

export default BookDetails;
