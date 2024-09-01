import React, { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import EpubAudioPlayer from "./EpubAudioPlayer";

interface PageSelectorProps {
  id: string;
  epubId: string;
  numberPages: number;
  dataTestId: string;
}

const PageSelector: React.FC<PageSelectorProps> = ({ id, epubId, numberPages, dataTestId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageContent, setSelectedPageContent] = useState<string>("");
  const [pageId, setPageId] = useState<number>(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [pageError, setPageError] = useState<string>("");
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);

  const fetchPageContent = async (pageNumber: number) => {
    if (!id) return;

    setLoadingPage(true);
    setPageError("");
    setSelectedPageContent("");
    setAudioUrls([]);

    try {
      const response = await fetch("/api/page-content", {
        method: "POST",
        body: JSON.stringify({ id, pageNumber }),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar o conteúdo da página");
      }
      const data = await response.json();

      const { page_id, content, audioUrl: audioUrlsFromResponse } = data;

      setSelectedPageContent(content);
      setPageId(page_id);
      if (audioUrlsFromResponse && audioUrlsFromResponse.length) {
        setAudioUrls(audioUrlsFromResponse);
      }
    } catch (err) {
      console.error(err);
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

  const MAX_TEXT_LENGTH = 4096;

  const handleConvert = async (text: string) => {
    if (!text.trim()) {
      setPageError("O texto não pode estar vazio.");
      return;
    }

    if (text.length < 5) {
      setPageError("O texto deve ter pelo menos 5 caracteres.");
      return;
    }

    if (audioUrls.length > 0) {
      setPageError("Áudio já disponível.");
      return;
    }

    setLoadingAudio(true);
    setPageError("");

    // Dividindo o texto em duas partes
    const firstPart = text.slice(0, MAX_TEXT_LENGTH);
    const remainingPart = text.slice(MAX_TEXT_LENGTH);

    try {
      // Primeira requisição rápida com os primeiros 4096 caracteres
      const quickResponse = await axios.post("/api/text-to-audio", { text: firstPart, id: pageId });
      setAudioUrls(quickResponse.data.audioUrls);

      // Segunda requisição demorada com o restante do texto
      if (remainingPart.length > 0) {
        axios
          .post("/api/text-to-audio", { text: remainingPart, id: pageId })
          .then(() => {
            console.log("Requisição lenta completa.");
          })
          .catch((error) => {
            console.error("Erro na requisição lenta:", error);
          });
      }
    } catch (error) {
      console.error("Erro ao converter texto:", error);
      setPageError("Falha ao converter o texto.");
    } finally {
      setLoadingAudio(false);
    }
  };

  useEffect(() => {
    fetchPageContent(currentPage);
  }, [currentPage]);

  return (
    <div className="my-4 p-4 border border-gray-300 rounded-md" data-testid={dataTestId} role="region" aria-label="Page Selector">
      <h3 className="text-lg font-semibold mb-2" data-testid="page-count">
        Foram encontradas {numberPages} páginas:
      </h3>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          data-testid="previous-page-button"
          aria-label="Previous Page"
          aria-disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span data-testid="current-page">
          Página {currentPage} de {numberPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === numberPages}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          data-testid="next-page-button"
          aria-label="Next Page"
          aria-disabled={currentPage === numberPages}
        >
          Próxima
        </button>
      </div>
      {loadingPage && <Loading message="Carregando conteúdo da página..." data-testid="loading-page" />}
      {pageError && <div className="text-red-600 mt-2" data-testid="page-error">{pageError}</div>}
      {selectedPageContent && (
        <div className="mb-4" data-testid="page-content">
          <div>
            <h4 className="text-lg font-semibold mb-2">
              Conteúdo da página {currentPage}:
            </h4>
            <p>{selectedPageContent}</p>
          </div>
          {audioUrls.length <= 0 && (
            <div className="mt-4">
              <button
                onClick={() => handleConvert(selectedPageContent)}
                className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                data-testid="convert-text-button"
                aria-label="Convert Text to Audio"
              >
                Ouvir o conteúdo dessa página
              </button>
            </div>
          )}
        </div>
      )}
      {loadingAudio && <Loading message="Convertendo texto em áudio..." dataTestId="loading-audio" />}
      {audioUrls.length > 0 && <EpubAudioPlayer audioUrls={audioUrls} dataTestId="audio-player" />}
    </div>
  );
};

export default PageSelector;
