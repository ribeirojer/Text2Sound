import React, { useRef, useEffect } from 'react';

const drawWaveform = (
  buffer: AudioBuffer,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) => {
  const data = buffer.getChannelData(0);
  const step = Math.ceil(data.length / width);
  const amp = height / 2;

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(1, '#2196F3');
  //gradient.addColorStop(1, '#FF5722');

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = gradient;

  for (let i = 0; i < width; i++) {
    const segment = data.slice(i * step, (i + 1) * step);
    const min = Math.min(...Array.from(segment));
    const max = Math.max(...Array.from(segment));
    
    const barHeight = Math.max(2, (max - min) * amp);
    const barWidth = 2;
    
    ctx.fillRect(i * barWidth, (1 + min) * amp, barWidth, barHeight);
  }
};

const AudioWaveform: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const audioContext = new (window.AudioContext)();
      const request = new XMLHttpRequest();
      request.open('GET', audioUrl, true);
      request.responseType = 'arraybuffer';

      request.onload = () => {
        audioContext.decodeAudioData(request.response, buffer => {
          let progress = 0;

          const animate = () => {
            progress += 0.5;
            drawWaveform(buffer, ctx, canvas.width, canvas.height, progress);
            requestAnimationFrame(animate);
          };

          animate();
        });
      };
      request.send();
    }
  }, [audioUrl]);

  return <canvas ref={canvasRef} width={500} height={100}></canvas>;
};

export default AudioWaveform;
