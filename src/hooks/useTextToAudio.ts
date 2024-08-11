import { SetStateAction, useState } from 'react';
import axios from 'axios';

export const useTextToAudio = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e: { target: { value: string; }; }) => {
    setText(e.target.value);
  };

  const handleConvert = async () => {
    if (!text) return;
    setLoading(true);

    try {
      const response = await axios.post('/api/convert', { text });
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      console.error('Erro ao converter o texto:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    text,
    audioUrl,
    loading,
    handleTextChange,
    handleConvert,
  };
};
