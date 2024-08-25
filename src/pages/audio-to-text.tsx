import React, { useState } from "react";
import Layout from "@/components/Layout";
import UploadContainer from "@/components/UploadContainer";
import UploadSuccess from "@/components/UploadSuccess";
import Transcription from "@/components/Transcription";
import axiosClient from "@/utils/httpService";
import { useHistoryContext } from "@/contexts/HistoryContext";
import Loading from "@/components/Loading";

const AudioToText = () => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [isLoading,  setIsLoading] = useState<boolean>(false);
  const [transcriptionData, setTranscriptionData] = useState<any | null>(null);

  const { addEntry } = useHistoryContext();
  
  const handleUploadSuccess = (url: string, name: string) => {
    setFileUrl(url);
    setFilename(name);
  };

  const handleNewUpload = () => {
    setFileUrl('');
    setFilename('');
    setTranscriptionData(null);
  };

  const handleTranscribe = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/transcribe-audio", { fileUrl, filename });
      console.log(response.data);
      addEntry({ text: filename, audioUrl: fileUrl, type: "audio", timestamp: new Date().toISOString() })
      setTranscriptionData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
      {isLoading && <Loading message="Extraindo texto do áudio..."/>}
    </Layout>
  );
};

export default AudioToText;
