import axios from 'axios';
import { useState, useEffect, SetStateAction } from 'react';

export function useTextToAudio() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<{text: string, audioUrl: string}[]>([]);

  useEffect(() => {
    // Apenas execute no cliente
    if (typeof window !== 'undefined') {
      const storedHistory = localStorage.getItem('conversionHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    }
  }, []);

  const updateHistory = (newEntry: {text: string, audioUrl: string}) => {
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    // Salvar no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
    }
  };

  const handleTextChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setText(e.target.value);
  };

  const handleConvert = async () => {
    if (!text) {
      setError('O texto não pode estar vazio.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/convert', { text });
      setAudioUrl(response.data.audioUrl);
      updateHistory({ text, audioUrl: response.data.audioUrl });
    } catch (error) {
      console.error('Erro ao converter texto:', error);
      setError('Falha ao converter o texto.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleNewConversion = () => {
    setText('');
    setAudioUrl(null);
  };

  return {
    text,
    audioUrl,
    loading,
    error,
    progress,
    history,
    handleTextChange,
    handleConvert,
    handleNewConversion,
  };
}
