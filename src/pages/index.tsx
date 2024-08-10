import { SetStateAction, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setText(e.target.value);
  };

  const handleConvert = async () => {
    if (!text) return;
    setLoading(true);

    try {
      const response = await axios.post('/api/convert', { text });
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      console.error('Error converting text:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-6">Text to Audio Converter</h1>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text to convert to audio"
        rows={10}
        className="p-4 w-full max-w-lg border rounded-md mb-4"
      />
      <button
        onClick={handleConvert}
        disabled={!text || loading}
        className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
      >
        {loading ? 'Converting...' : 'Convert to Audio'}
      </button>
      {audioUrl && (
        <div className="mt-6">
          <h2 className="text-2xl mb-4">Your audiobook is ready:</h2>
          <audio controls className="mb-4">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <br />
          <a href={audioUrl} target='_blank' download={audioUrl} className="text-blue-500 hover:underline">
            Download Audio
          </a>
        </div>
      )}
    </div>
  );
}
