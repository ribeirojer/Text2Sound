import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { UploadedBook } from "@/interfaces";

const EpubDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<UploadedBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/epub/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar detalhes do livro");
        }

        const bookData: UploadedBook = await response.json();
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
        <h1 className="text-2xl font-bold mb-6">{book.filename}</h1>
        <img src="/epub-thumbnail.svg" alt="Thumbnail do Livro" className="w-full h-auto mb-6" />
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Opções de Leitura:</h2>
          <button className="w-full mb-4 px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700">
            Ouvir com texto sincronizado
          </button>
          <a
            href={book.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md block text-center hover:bg-blue-700"
          >
            Baixar EPUB
          </a>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Descrição:</h2>
          <p>
            Aqui você pode fornecer uma breve descrição do conteúdo do livro,
            sua origem, ou outros detalhes relevantes que possam interessar ao usuário.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EpubDetail;
