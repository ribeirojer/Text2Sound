import React from "react";
import Layout from "@/components/Layout";
import { useHistoryContext } from '../contexts/HistoryContext';

const Historico: React.FC = () => {
  const { history, removeEntry, clearHistory } = useHistoryContext();

  return (
    <Layout>
      <div className="mt-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Histórico de Conversões</h2>

        {history.length === 0 ? (
          <p className="text-gray-500">Nenhum histórico disponível.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="p-4 border rounded-md shadow-md bg-transparent transition"
                >
								<p className="mb-2">
                    <strong>Data:</strong> {new Date(item.timestamp).toLocaleString()}
                  </p>
				  {item.type === "text" && <p>Tipo: Texto</p>}
				  {item.type === "audio" && <p>Tipo: Áudio</p>}
				  {item.type === "epub" && <p>Tipo: Epub</p>}
                  <p className="mb-2">
                    <strong>Texto:</strong> {item.text}
                  </p>
                  <div className="flex items-center space-x-4">
                  {item.type !== "epub" && <audio controls src={item.audioUrl} className="w-full"></audio>}
                    <a
                      href={item.audioUrl}
                      target="_blank"
                      download={item.audioUrl}
                      className="text-orange-500 hover:underline"
                      rel="noreferrer"
                    >
                      Baixar {item.type !== "epub" ? "Áudio" : "EPUB"}
                    </a>
                    <button
                      onClick={() => removeEntry(index)}
                      className="text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-right">
              <button
                onClick={clearHistory}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Limpar Histórico
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Historico;
