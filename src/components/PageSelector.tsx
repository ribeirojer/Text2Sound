import React, { useState, useEffect, useRef } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import axiosClient from "@/utils/httpService";

interface PageSelectorProps {
  id: string;
  numberPages: number;
}

const PageSelector: React.FC<PageSelectorProps> = ({ id, numberPages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageContent, setSelectedPageContent] = useState<string>("");
  const [pageId, setPageId] = useState<number>(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [pageError, setPageError] = useState<string>("");
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  const fetchPageContent = async (pageNumber: number) => {
    if (!id) return;

    setLoadingPage(true);
    setPageError("");
    setSelectedPageContent("");
    setAudioUrls([]);

    try {
      const response = await axiosClient.post("/get-page-content", { id, pageNumber });

      if (!response.data) {
        throw new Error("Erro ao buscar o conteúdo da página");
      }

      const { page_id, content, audioUrl: audioUrlsFromResponse } = response.data;

      setSelectedPageContent(content);
      setPageId(page_id);
      if (audioUrlsFromResponse && audioUrlsFromResponse.length) {
        setAudioUrls(audioUrlsFromResponse);
      }
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

    if (audioUrls.length > 0) {
      setPageError("Áudio já disponível.");
      return;
    }

    setLoadingAudio(true);
    setPageError("");

    try {
      const response = await axios.post("/api/text-to-audio", { text, id: pageId });
      const { data } = response;
      setAudioUrls(data.audioUrls);
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

  const handleAudioEnded = () => {
    if (currentAudioIndex < audioUrls.length - 1) {
      setCurrentAudioIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsPlaying(false); // Para garantir que o botão mostre "Play" quando o último áudio terminar.
    }
  };

  const handlePlayPause = () => {
    if (audioPlayerRef.current) {
      if (audioPlayerRef.current.paused) {
        audioPlayerRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Erro ao tentar reproduzir o áudio:", error);
          });
      } else {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrls[currentAudioIndex];
    }
  }, [currentAudioIndex, audioUrls]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = Number(event.target.value);
    }
  };

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
      )}
      {loadingAudio && <Loading message="Convertendo texto em áudio..." />}
      {audioUrls.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              onChange={handleVolumeChange}
              className="w-32"
            />
          </div>
          <audio
            ref={audioPlayerRef}
            onEnded={handleAudioEnded}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default PageSelector;
