import { UploadedBook } from "@/interfaces";
import Link from "next/link";
import React from "react";
import { DownloadIcon, SyncIcon, TrashIcon } from "./Icons";

interface UploadedBooksListProps {
	books: UploadedBook[];
	onDeleteBook: (filename: string) => void;
}

const UploadedBookItem: React.FC<{
	book: UploadedBook;
	onDeleteBook: (filename: string) => void;
}> = ({ book, onDeleteBook }) => {
	const handleDelete = () => {
		if (confirm(`Tem certeza que deseja excluir o livro "${book.filename}"?`)) {
			onDeleteBook(book.bookId);
		}
	};

	return (
		<li 
			className="mb-4 p-4 border rounded-lg flex flex-col justify-between items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
			role="listitem"
			aria-label={`Livro: ${book.filename}`}
			data-testid={`book-item-${book.bookId}`}
		>
			<div className="flex items-center space-x-4">
				<Link
					href={`/epub/${book.bookId}`}
					className="text-white hover:underline"
					aria-label={`Abrir o livro ${book.filename}`}
					data-testid={`open-book-${book.bookId}`}
				>
					{book.filename}
				</Link>
			</div>
			<div className="flex justify-between items-center space-x-4">
				<Link
					href={`/epub/${book.bookId}`}
					className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 transition-colors border border-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded-md"
					aria-label="Ouvir com texto sincronizado"
					data-testid={`sync-audio-${book.bookId}`}
				>
					<SyncIcon
						alt="Ouvir com texto sincronizado"
						className="w-5 h-5 fill-emerald-600"
					/>
					<span>Ouvir com texto sincronizado</span>
				</Link>
				<a
					href={book.public_url}
					target="_blank"
					className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors border border-blue-600 hover:bg-blue-100 px-2 py-1 rounded-md"
					rel="noopener noreferrer"
					aria-label={`Baixar o livro ${book.filename}`}
					data-testid={`download-book-${book.bookId}`}
				>
					<DownloadIcon alt="Baixar" className="w-5 h-5 fill-blue-600" />
					<span>Baixar</span>
				</a>
				<button
					onClick={handleDelete}
					className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors border border-red-500 hover:bg-red-100 px-2 py-1 rounded-md"
					aria-label={`Excluir o livro ${book.filename}`}
					data-testid={`delete-book-${book.bookId}`}
				>
					<TrashIcon alt="Excluir" className="w-5 h-5 fill-red-500" />
					<span>Excluir</span>
				</button>
			</div>
		</li>
	);
};

const UploadedBooksList: React.FC<UploadedBooksListProps> = ({
	books,
	onDeleteBook,
}) => {
	return (
		<div className="mt-6">
			<h2 
				className="text-xl font-bold mb-4"
				role="heading"
				aria-level={2}
			>
				Livros Enviados:
			</h2>
			<ul role="list" aria-label="Lista de livros enviados">
				{books.map((book, index) => (
					<UploadedBookItem
						key={index}
						book={book}
						onDeleteBook={onDeleteBook}
					/>
				))}
			</ul>
		</div>
	);
};

export default UploadedBooksList;
