import React, { useRef, useState } from 'react';
import { useTextToAudio } from '../hooks/useTextToAudio';

export default function Home() {
  const {
    text,
    audioUrl,
    loading,
    error,
    history,
    progress,
    handleTextChange,
    handleConvert,
    handleNewConversion,
  } = useTextToAudio();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (audioRef?.current?.paused) {
      audioRef.current.play();
    } else {
      audioRef?.current?.pause();
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'audio.mp3';
      a.click();
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 gap-4 flex flex-col justify-center min-h-screen py-8">
      <h1 className="text-4xl font-bold mb-6">Conversor de Texto para Áudio</h1>

      {!audioUrl ? (
        <>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Digite o texto que deseja converter em áudio"
            rows={10}
            className="rounded-lg border-white/[0.12] bg-white/[0.05] focus:border-[--yellow-green] border-2 w-full py-5 px-6 outline-none"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={handleConvert}
            disabled={!text || loading}
            className={`px-4 py-2 mt-4 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700'}`}
          >
            {loading ? 'Convertendo...' : 'Converter para Áudio'}
          </button>

          {loading && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-[--zomp] to-[--yellow-green] h-4 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={handleNewConversion}
          className="px-4 py-2 mt-4 rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700"
        >
          Nova Conversão
        </button>
      )}

      {audioUrl && (
        <div className="mt-6">
          <h2 className="text-2xl mb-4">Seu áudio está pronto:</h2>
          <div className="custom-audio-player mb-4">
            <audio ref={audioRef} src={audioUrl} className="hidden" />

            <button
              onClick={handlePlayPause}
              className="bg-gradient-to-r from-[--zomp] to-[--yellow-green] px-4 py-2 rounded-full text-white mr-2"
            >
              ▶️ / ⏸️
            </button>

            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-[--yellow-green] to-[--zomp] px-4 py-2 rounded-full text-white"
            >
              Baixar
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Histórico de Conversões:</h2>
          <ul className="list-disc list-inside">
            {history.map((item, index) => (
              <li key={index} className="mb-2">
                <strong>Texto:</strong> {item.text}
                <br />
                <strong>Áudio:</strong> 
                <a href={item.audioUrl} target='_blank' download={item.audioUrl} className="text-orange-500 hover:underline">
                  Baixar Áudio
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
