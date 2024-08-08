import React from 'react'

type Props = {}

import { useState } from 'react';
import axios from 'axios';

const pdf = (props: Props) => {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>PDF to Audio Converter</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Converting...' : 'Convert to Audio'}
      </button>
      {audioUrl && (
        <div>
          <h2>Download your audiobook:</h2>
          <a href={audioUrl} download="audiobook.mp3">Download Audio</a>
        </div>
      )}
    </div>
  );
}

export default pdf