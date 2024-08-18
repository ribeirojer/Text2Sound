import { UploadResponse, UploadedBook } from "@/interfaces";
import { useState, useEffect } from "react";

export const useEpubUpload = () => {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploadedBooks, setUploadedBooks] = useState<UploadedBook[]>([]);
	const [showUploadForm, setShowUploadForm] = useState<boolean>(true);

	// Carregar os livros armazenados no localStorage quando o componente é montado
	useEffect(() => {
		const storedBooks = localStorage.getItem("uploadedBooks");
		if (storedBooks) {
			try {
				const parsedBooks: UploadedBook[] = JSON.parse(storedBooks);
				if (parsedBooks.length > 0) {
					setUploadedBooks(parsedBooks);
					setShowUploadForm(false);
				}
			} catch (error) {
				console.error("Erro ao parsear os livros armazenados:", error);
				localStorage.removeItem("uploadedBooks"); // Remover livros corrompidos do localStorage
			}
		}
	}, []);

	// Salvar os livros atualizados no localStorage sempre que a lista mudar
	useEffect(() => {
		if (uploadedBooks.length > 0) {
			localStorage.setItem("uploadedBooks", JSON.stringify(uploadedBooks));
		}
	}, [uploadedBooks]);

	const handleUpload = async () => {
		if (!file) {
			setError("Nenhum arquivo selecionado.");
			return;
		}

		setUploading(true);
		setError(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("http://localhost:8000/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Erro no upload do arquivo.");
			}

			const result: UploadResponse = await response.json();
			setUploadedBooks((prev) => [
				...prev,
				{
					bookId: result.bookId,
					fileUrl: result.fileUrl,
					filename: result.filename,
					number_of_pages: result.number_of_pages,
				},
			]);
		} catch (err) {
			setError(`Erro ao fazer upload do arquivo: ${err}`);
		} finally {
			setUploading(false);
			setFile(null);
			setShowUploadForm(false);
		}
	};

	const handleDeleteBook = (bookId: string) => {
		const updatedBooks = uploadedBooks.filter((book) => book.bookId !== bookId);
		setUploadedBooks(updatedBooks);

		// Atualizar a visibilidade do formulário de upload após deletar
		if (updatedBooks.length === 0) {
			setShowUploadForm(true);
		}
	};

	const startNewUpload = () => {
		setShowUploadForm(true);
	};

	return {
		file,
		uploading,
		error,
		uploadedBooks,
		showUploadForm,
		setFile,
		setError,
		handleUpload,
		handleDeleteBook,
		startNewUpload,
	};
};
