import React from "react";
import Loading from "@/components/Loading";
import EpubAudioPlayer from "./EpubAudioPlayer";
import usePageSelector from "@/hooks/usePageSelector";

// Componente PageSelector utilizando o custom hook
interface PageSelectorProps {
  id: string;
  numberPages: number;
}

const PageSelector: React.FC<PageSelectorProps> = ({ id, numberPages }) => {
  const {
    currentPage,
    selectedPageContent,
    loadingPage,
    pageError,
    audioUrls,
    loadingAudio,
    handlePreviousPage,
    handleNextPage,
    handleConvert,
  } = usePageSelector(id, numberPages);

  return (
    <div className="my-4 p-4 border border-gray-300 rounded-md" data-testid="page-selector" role="region" aria-label="Page Selector">
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
