import React, { useState } from "react";
import Loading from "./Loading";

interface UploadContainerProps {
  onUploadSuccess: (fileUrl: string, filename: string) => void;
}

const UploadContainer: React.FC<UploadContainerProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
    setError("");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Nenhum arquivo selecionado.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SERVER_API_URL + "/upload-audio", {
        method: "POST",
        body: formData,
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Erro no upload do arquivo.");
      }

      const result = await response.json();
      onUploadSuccess(result.fileUrl, result.filename);
    } catch (err) {
      console.error(err);
      setError(`Erro ao fazer upload do arquivo: ${err}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container flex flex-col">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="drag-drop-area border-2 border-dashed p-4 rounded-lg mb-4 cursor-pointer"
      >
        {file ? (
          <p className="file-name">{file.name}</p>
        ) : (
          <div>
            <img
              src="/undraw_add_files_re_v09g.svg"
              alt=""
              className="w-2/3 max-h-40 mx-auto mb-4"
            />
            <p className="text-gray-500 text-center">
              Arraste e solte o arquivo de áudio aqui ou clique para selecionar.
            </p>
          </div>
        )}
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 mt-4 rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700 ${uploading ? "cursor-not-allowed" : ""}`}
      >
        {uploading ? `Upload...` : "Fazer Upload"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {uploading && <Loading message='Fazendo upload...' />}
    </div>
  );
};

export default UploadContainer;
