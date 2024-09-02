import axios from "axios";
import { useState, useEffect } from "react";
import axiosClient from "@/utils/httpService";

const MAX_TEXT_LENGTH = 4096;

export function divideTextIntoParts(text: string): string[] {
  const paragraphs = text.split(/\n+/);

  let textParts: string[] = [];
  let currentPart = "";

  for (const paragraph of paragraphs) {
    if ((currentPart + paragraph).length <= MAX_TEXT_LENGTH) {
      // Adiciona o parágrafo atual à parte atual
      currentPart += (currentPart ? "\n" : "") + paragraph;
    } else {
      // Adiciona a parte atual à lista de partes e inicia uma nova parte com o parágrafo atual
      if (currentPart) textParts.push(currentPart);
      currentPart = paragraph;
    }
  }

  // Adiciona a última parte, se houver
  if (currentPart) textParts.push(currentPart);

  return textParts;
}

// Custom Hook para gerenciar o estado e a lógica do PageSelector
const usePageSelector = (id: string, numberPages: number) => {
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

    // Dividindo o texto em partes usando a função utilitária
    const textParts = divideTextIntoParts(text);

    try {
      // Primeira requisição rápida com os primeiros 4096 caracteres
      const quickResponse = await axios.post("/api/text-to-audio", { text: textParts[0], id: pageId });
      setAudioUrls(quickResponse.data.audioUrls);
      
      // Segunda requisição demorada com o restante do texto
      if (textParts.length > 1) {
        axiosClient
          .post("/remaining-part-text-to-audio", { text: textParts.slice(1).join("\n"), bookId: id, pageId })
          .then((res) => {
            console.log("Requisição lenta completa.");
            console.log(res.data);
            setAudioUrls((prevUrls) => [...prevUrls, ...res.data.audioUrls]);
            setPageError("");
            setLoadingAudio(false);
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

  return {
    currentPage,
    selectedPageContent,
    pageId,
    loadingPage,
    pageError,
    audioUrls,
    loadingAudio,
    handlePreviousPage,
    handleNextPage,
    handleConvert,
  };
};

export default usePageSelector;
