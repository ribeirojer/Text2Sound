import Layout from '@/components/Layout';
import React, { useState } from 'react';

const EpubToAudio = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Nenhum arquivo selecionado.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-epub', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro no upload do arquivo.');
      }

      const result = await response.json();
      console.log('Arquivo EPUB processado:', result);
    } catch (err) {
      setError(`Erro ao fazer upload do arquivo: ${err}`);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <Layout>
      <div className="max-w-lg mx-auto mt-10">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          className="drag-drop-area border-2 border-dashed p-4 rounded-lg mb-4"
        >
          {file ? (
            <p className="file-name text-center text-emerald-700">{file.name}</p>
          ) : (
            <p className="text-gray-500 text-center">Arraste e solte o arquivo EPUB aqui ou clique para selecionar.</p>
          )}
          <input
            type="file"
            accept=".epub"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full px-4 py-2 rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700 ${
            uploading ? 'cursor-not-allowed opacity-75' : ''
          }`}
        >
          {uploading ? `Upload... ${progress}%` : 'Fazer Upload e Converter'}
        </button>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full mt-4">
            <div
              className="bg-emerald-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EpubToAudio;
