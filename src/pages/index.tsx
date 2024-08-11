import React from 'react';
import { useTextToAudio } from '../hooks/useTextToAudio';

export default function Home() {
  const {
    text,
    audioUrl,
    loading,
    handleTextChange,
    handleConvert,
  } = useTextToAudio();

  return (
    <div className="container mx-auto max-w-2xl px-4 gap-4 flex flex-col justify-center min-h-screen py-8">
      <h1 className="text-4xl font-bold mb-6">Conversor de Texto para Áudio</h1>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Digite o texto que deseja converter em áudio"
        rows={10}
        className="rounded-lg border border-white/[0.12] bg-white/[0.05] focus:border-purple w-full py-5 px-6 outline-none"
      />
      <button
        onClick={handleConvert}
        disabled={!text || loading}
        className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-orange-500 hover:bg-orange-700'}`}
      >
        {loading ? 'Convertendo...' : 'Converter para Áudio'}
      </button>
      {audioUrl && (
        <div className="mt-6">
          <h2 className="text-2xl mb-4">Seu áudio está pronto:</h2>
          <audio controls className="mb-4">
            <source src={audioUrl} type="audio/mpeg" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
          <br />
          <a href={audioUrl} target='_blank' download={audioUrl} className="text-orange-500 hover:underline">
            Baixar Áudio
          </a>
        </div>
      )}
    </div>
  );
}
