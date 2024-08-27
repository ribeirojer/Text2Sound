import AudioPlayer from "@/components/AudioPlayer";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useTextToAudio } from "@/hooks/useTextToAudio";
import React from "react";

type Props = {};

const TextToAudio: React.FC<Props> = () => {
  const {
    text,
    audioUrl,
    audioRef,
    currentWordIndex,
    resetCurrentWordIndex,
    wordTimings,
    loading,
    error,
    handleTextChange,
    handleConvert,
    handleNewConversion,
  } = useTextToAudio();

  const maxLength = 500; // Defina o limite máximo de caracteres aqui

  return (
    <Layout>
      <h1 className="text-center text-2xl md:text-4xl font-bold mb-6">
        Conversor de Texto para Áudio
      </h1>
      {!audioUrl ? (
        <div className="mx-auto max-w-lg flex flex-col">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Digite o texto que deseja converter em áudio"
            rows={10}
            maxLength={maxLength}
            className="rounded-lg border-white/[0.12] bg-white/[0.05] focus:border-[--yellow-green] border-2 w-full py-5 px-6 outline-none"
          />
          <div className="text-right text-sm text-gray-400 mt-1">
            {text.length}/{maxLength} caracteres
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={handleConvert}
            disabled={!text || loading}
            className={`px-4 py-2 mt-4 rounded-md text-white ${loading ? "bg-gray-500" : "bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700"}`}
          >
            {loading ? "Convertendo..." : "Converter para Áudio"}
          </button>
        </div>
      ) : (
        <div>
          <AudioPlayer
            text={text}
            audioUrl={audioUrl}
            audioRef={audioRef}
            wordTimings={wordTimings}
            currentWordIndex={currentWordIndex}
            resetCurrentWordIndex={resetCurrentWordIndex}
          />
          <button
            onClick={handleNewConversion}
            className="px-4 py-2 mt-4 rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700"
          >
            Nova Conversão
          </button>
        </div>
      )}
      {loading && <Loading />}
    </Layout>
  );
};

export default TextToAudio;
