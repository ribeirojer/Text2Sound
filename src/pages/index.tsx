import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {

  return (
    <Layout>

<h2 className="text-4xl font-bold mb-4">Bem-vindo ao Conversor de Mídia</h2>
      <p className="mb-8">Escolha uma das opções abaixo para começar:</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/text-to-audio" className="option-card bg-gradient-to-r from-[--zomp] to-[--yellow-green] p-4 rounded-lg cursor-pointer hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-white">Texto para Áudio</h2>
            <p className="text-white mt-2">Converta texto digitado em áudio.</p>
          </Link>
          <Link href="/epub-to-audio" className="option-card bg-gradient-to-r from-[--yellow-green] to-[--zomp] p-4 rounded-lg cursor-pointer hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-white">EPUB para Áudio</h2>
            <p className="text-white mt-2">Faça upload de um arquivo EPUB para conversão.</p>
          </Link>
          <Link href="/audio-to-text" className="option-card bg-gradient-to-r from-[--zomp] to-[--yellow-green] p-4 rounded-lg cursor-pointer hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-white">Áudio para Texto</h2>
            <p className="text-white mt-2">Faça upload de um áudio para transcrição.</p>
          </Link>
        </div>   
        </Layout>
  );
}
