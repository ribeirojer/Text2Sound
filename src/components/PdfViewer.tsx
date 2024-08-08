import { useState } from 'react';
import { Document, Page } from 'react-pdf';

const PdfViewer = ({ file }: any) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        <p>
          Página {pageNumber} de {numPages}
        </p>
        <button disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
          Anterior
        </button>
        <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
