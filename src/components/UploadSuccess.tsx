import React from "react";

interface UploadSuccessProps {
  fileUrl: string;
  filename: string;
  onNewUpload: () => void;
  onTranscribe: () => void;
}

const UploadSuccess: React.FC<UploadSuccessProps> = ({ fileUrl, filename, onNewUpload, onTranscribe }) => {
  return (
    <div className="upload-success p-6 border border-green-500 rounded-lg text-center">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Upload realizado com sucesso!</h2>
      <p className="text-lg mb-4">Arquivo: <span className="font-medium text-white">{filename}</span></p>
      <audio controls src={fileUrl} className="mb-6 w-full rounded-md shadow-sm">
        Seu navegador não suporta o elemento de áudio.
      </audio>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onTranscribe}
          className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
        >
          Transcrever Áudio
        </button>
        <button
          onClick={onNewUpload}
          className="px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200"
        >
          Novo Upload
        </button>
      </div>
    </div>
  );
};

export default UploadSuccess;
