import React, { useState } from "react";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import useBookDetails from "@/hooks/useBookDetails";
import { useRouter } from "next/router";
import BookOptions from "@/components/BookOptions";
import PageSelector from "@/components/PageSelector";

const BookDetails: React.FC = () => {
	const { id } = useRouter().query;
	const { book, loading, error } = useBookDetails(id);
	const [extracting, setExtracting] = useState(false);
	const [extractError, setExtractError] = useState<string | null>(null);

	const handleExtractText = async () => {
		if (!id) return;

		setExtracting(true);
		setExtractError(null);

		try {
			const response = await fetch("http://localhost:8000/extract-text", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			});

			if (!response.ok) {
				throw new Error("Erro ao extrair texto");
			}

			const result = await response.json();
			const { success, message, numberOfPages } = result;

			if (!success) {
				throw new Error(message);
			}
		} catch (err) {
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
				<div className="max-w-lg mx-auto mt-10 text-center">
					<h1 className="text-2xl font-bold mb-4">Erro</h1>
					<p>{error}</p>
				</div>
			</Layout>
		);
	}

	if (!book) {
		return (
			<Layout>
				<div className="max-w-lg mx-auto mt-10 text-center">
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
				{book.is_extract_text ? (
					<PageSelector id={id as string} numberPages={book.number_of_pages} />
				) : (
					<button
						onClick={handleExtractText}
						className="w-full mb-4 px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
						disabled={extracting}
					>
						{extracting ? "Extraindo..." : "Extrair Texto"}
					</button>
				)}
				<a
					href={book.fileUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full px-4 py-2 text-white bg-blue-600 rounded-md block text-center hover:bg-blue-700"
				>
					Baixar EPUB
				</a>
			</div>
		</Layout>
	);
};

export default BookDetails;
