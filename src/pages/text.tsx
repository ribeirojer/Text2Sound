// pages/index.js
import PdfViewer from '@/components/PdfViewer';
import { SetStateAction, useState } from 'react';

const Home = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');

  const onFileChange = (event: { target: { files: any; }; }) => {
    setFile(event.target.files[0]);
  };

  const onSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/extract-text', {
      method: 'POST',
      body: file,
    });

    const data = await response.json();
    setText(data.text);
  };

  return (
    <div>
      <h1>Visualizador de PDF</h1>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} />
        <button type="submit">Enviar</button>
      </form>
      {text && (
        <div>
          <h2>Texto Extraído:</h2>
          <pre>{text}</pre>
        </div>
      )}
      <div>
        <img src={"/https://soqvrdtalkuswdififwe.supabase.co/storage/v1/object/public/images-jinfo/Dicas-para-Escritores-um-Guia-Descomplicado-Nano-Fregonese.pdf"} />
      </div>
      
    </div>
  );
};

export default Home;
