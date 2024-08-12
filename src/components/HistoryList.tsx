import React from 'react'

type Props = {
    history: { text: string; audioUrl: string }[]
    onDelete: (index: number) => void
}

const HistoryList = ({ history, onDelete }: Props) => {

      return (
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Histórico de Conversões:</h2>
          <ul className="list-disc list-inside">
            {history.map((item, index) => (
              <li key={index} className="mb-2">
                <strong>Texto:</strong> {item.text}
                <br />
                <strong>Áudio:  </strong>
                <a href={item.audioUrl} target='_blank' download={item.audioUrl} className="text-orange-500 hover:underline">
                  Baixar Áudio
                </a>
                <button
                  onClick={() => onDelete(index)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
export default HistoryList