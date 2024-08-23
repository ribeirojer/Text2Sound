import React, { useState } from "react";
import Layout from "@/components/Layout";
import UploadContainer from "@/components/UploadContainer";
import UploadSuccess from "@/components/UploadSuccess";
import Transcription from "@/components/Transcription";
import axiosClient from "@/utils/httpService";

const AudioToText = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [transcriptionData, setTranscriptionData] = useState<any | null>(null);

  const handleUploadSuccess = (url: string, name: string) => {
    setFileUrl(url);
    setFilename(name);
  };

  const handleNewUpload = () => {
    setFileUrl(null);
    setFilename(null);
    setTranscriptionData(null);
  };

  const handleTranscribe = async () => {
    try {
      const response = await axiosClient.post("/transcribe-audio", { fileUrl, filename });
      setTranscriptionData(response.data);
      console.log("Transcrição de áudio:", response.data);
    } catch (error) {
      console.error("Erro ao transcrever áudio:", error);
    }
  };

  return (
    <Layout>
      <h1 className="text-center text-2xl md:text-4xl font-bold mb-6">
        Faça a transcrição de áudio em texto
      </h1>
      <div className="max-w-lg mx-auto">
        {!fileUrl ? (
          <UploadContainer onUploadSuccess={handleUploadSuccess} />
        ) : transcriptionData ? (
          <Transcription transcriptionData={transcriptionData} audioUrl={fileUrl}  />
        ) : (
          <UploadSuccess
            fileUrl={fileUrl}
            filename={filename!}
            onNewUpload={handleNewUpload}
            onTranscribe={handleTranscribe}
          />
        )}
      </div>
    </Layout>
  );
};

export default AudioToText;
