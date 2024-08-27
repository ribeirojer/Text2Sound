import type { WordTiming } from "@/hooks/useTextToAudio";
import type React from "react";

type Props = {
  text: string;
  audioUrl: string;
  wordTimings: WordTiming[];
  currentWordIndex: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  resetCurrentWordIndex: () => void; // Função para resetar o índice atual
};

const AudioPlayer = ({
  text,
  audioUrl,
  wordTimings,
  currentWordIndex,
  audioRef,
  resetCurrentWordIndex,
}: Props) => {
  const handlePlayPause = () => {
    if (audioRef?.current?.paused) {
      audioRef.current.play();
    } else {
      audioRef?.current?.pause();
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.target = "_blank";
      a.download = "audio.mp3";
      a.click();
    }
  };

  return (
    <div className="mt-6" role="region" aria-label="Audio Player">
      <h2 className="text-2xl mb-4 font-semibold" role="heading" aria-level={2}>
        Seu áudio está pronto:
      </h2>
      <div
        className="custom-audio-player flex flex-col items-center mb-4"
        role="group"
        aria-label="Audio Controls"
      >
        <audio ref={audioRef} src={audioUrl} className="hidden" />
        <div
          className="text-lg flex flex-wrap justify-center border border-[--zomp] rounded-lg p-4 mb-4"
          role="textbox"
          aria-live="polite"
          aria-atomic="true"
          aria-label="Synchronized Text"
        >
          {wordTimings ? (
            wordTimings.map((word, index) => (
              <span
                key={index}
                className={`mx-1 ${index === currentWordIndex ? "bg-emerald-800 rounded" : ""}`}
                aria-hidden={index !== currentWordIndex}
              >
                {word.word}{" "}
              </span>
            ))
          ) : (
            <p className="text-lg mb-4" aria-label="Full Text">
              {text}
            </p>
          )}
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={handlePlayPause}
            className="bg-gradient-to-r from-[--zomp] to-[--yellow-green] px-4 py-2 rounded-full text-white"
            aria-label="Play or Pause Audio"
            data-testid="play-pause-button"
          >
            ▶️ / ⏸️
          </button>
          <button
            onClick={resetCurrentWordIndex}
            className="bg-gradient-to-r from-[--zomp] to-[--yellow-green] px-4 py-2 rounded-full text-white"
            aria-label="Reset Current Word Index"
            data-testid="reset-button"
          >
            Reiniciar
          </button>
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-[--yellow-green] to-[--zomp] px-4 py-2 rounded-full text-white"
            aria-label="Download Audio"
            data-testid="download-button"
          >
            Baixar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
