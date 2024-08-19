import { useState, useEffect } from "react";
import { UploadedBook } from "@/interfaces";
import axiosClient from "@/utils/httpService";

const useBookDetails = (id: string | string[] | undefined) => {
	const [book, setBook] = useState<UploadedBook | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBookDetails = async () => {
			try {
				const response = await fetch(`/api/epub/${id}`);
				if (!response.ok) {
					throw new Error("Erro ao buscar detalhes do livro");
				}
				const body = await response.json();
				const bookData: UploadedBook = body;
				setBook(bookData);
			} catch (err) {
				setError(`Erro ao carregar o livro: ${err}`);
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchBookDetails();
		}
	}, [id]);

	return { book, loading, error };
};

export default useBookDetails;
