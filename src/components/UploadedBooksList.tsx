import { UploadedBook } from "@/interfaces";
import Link from "next/link";
import React from "react";
import { DownloadIcon, SyncIcon, TrashIcon } from "./Icons";

interface UploadedBooksListProps {
  books: UploadedBook[];
  onDeleteBook: (filename: string) => void;
}

const UploadedBookItem: React.FC<{ book: UploadedBook; onDeleteBook: (filename: string) => void }> = ({
  book,
  onDeleteBook,
}) => {
  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o livro "${book.filename}"?`)) {
      onDeleteBook(book.filename);
    }
  };

  return (
    <li className="mb-4 p-4 border rounded-lg flex flex-col justify-between items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <Link href={`/epub/${book.bookId}`} className="text-white hover:underline">
          {book.filename}
        </Link>
      </div>
      <div className="flex justify-between items-center space-x-4">
        <Link href={`/epub/${book.bookId}`}           className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 transition-colors border border-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded-md"
>
          <SyncIcon alt="Ouvir com texto sincronizado" className="w-5 h-5 fill-emerald-600" />
          <span>Ouvir com texto sincronizado</span>
        </Link>
        <a
          href={book.fileUrl}
          target="_blank"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors border border-blue-600 hover:bg-blue-100 px-2 py-1 rounded-md"
          rel="noopener noreferrer"
        >
          <DownloadIcon alt="Baixar" className="w-5 h-5 fill-blue-600" />
          <span>Baixar</span>
        </a>
        <button
          onClick={handleDelete}
          className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors border border-red-500 hover:bg-red-100 px-2 py-1 rounded-md"
        >
          <TrashIcon alt="Excluir" className="w-5 h-5 fill-red-500" />
          <span>Excluir</span>
        </button>
      </div>
    </li>
  );
};

const UploadedBooksList: React.FC<UploadedBooksListProps> = ({ books, onDeleteBook }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Livros Enviados:</h2>
      <ul>
        {books.map((book, index) => (
          <UploadedBookItem key={index} book={book} onDeleteBook={onDeleteBook} />
        ))}
      </ul>
    </div>
  );
};

export default UploadedBooksList;
