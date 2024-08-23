import React, { useState, useEffect, useRef } from "react";

interface WordTiming {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
}

interface TranscriptionProps {
  transcriptionData: {
    text: string;
    wordTimings: WordTiming[];
  };
  audioUrl: string;
}

const Transcription: React.FC<TranscriptionProps> = ({ transcriptionData, audioUrl }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateCurrentWord = () => {
      const currentTime = audio.currentTime * 1000; // Convert to milliseconds
      const wordIndex = transcriptionData.wordTimings.findIndex(
        (word) => currentTime >= word.start && currentTime <= word.end
      );
      setCurrentWordIndex(wordIndex);
    };

    if (isPlaying) {
      audio.play();
      audio.addEventListener("timeupdate", updateCurrentWord);
    } else {
      audio.pause();
    }

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentWordIndex(null);
    };

    audio.addEventListener("ended", handleAudioEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentWord);
      audio.removeEventListener("ended", handleAudioEnd);
    };
  }, [isPlaying, transcriptionData.wordTimings]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={togglePlay}
          className={`px-4 py-2 font-semibold rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] ${
            isPlaying ? "hover:bg-orange-700" : "hover:bg-blue-700"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <audio ref={audioRef} src={audioUrl} className="hidden" />
      <div className="whitespace-pre-wrap">
        {transcriptionData.wordTimings.map((word, index) => (
          <span
            key={word.id}
            className={`transition-colors ${
              index === currentWordIndex ? "bg-yellow-300" : ""
            }`}
          >
            {word.text}{" "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Transcription;
