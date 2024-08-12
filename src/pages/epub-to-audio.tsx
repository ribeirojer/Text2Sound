import React, { useState } from 'react'

type Props = {}

const EpubToAudio = (props: Props) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleDragOver = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Nenhum arquivo selecionado.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/epub', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro no upload do arquivo.');
      }

      const result = await response.json();
      console.log('Arquivo EPUB processado:', result);
    } catch (err) {
      setError('Erro ao fazer upload do arquivo: ' + err);
    } finally {
      setUploading(false);
    }
  };

  return (

    <div className="upload-container">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="drag-drop-area border-2 border-dashed p-4 rounded-lg mb-4"
      >
        {file ? (
          <p className="file-name">{file}</p>
        ) : (
          <p className="text-gray-500">Arraste e solte o arquivo EPUB aqui ou clique para selecionar.</p>
        )}
        <input type="file" accept=".epub" onChange={handleFileChange} className="hidden" />
      </div>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 mt-4 rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700 ${uploading ? 'cursor-not-allowed' : ''}`}
      >
        {uploading ? `Upload... ${progress}%` : 'Fazer Upload e Converter'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>  )
}

export default EpubToAudio
