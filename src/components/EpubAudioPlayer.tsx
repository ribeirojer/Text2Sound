import React from "react";
import { useAudioPlayer } from "@/hooks/useEpubAudioPlayer";

interface AudioPlayerProps {
  audioUrls: string[];
  dataTestId?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrls, dataTestId }) => {
  const {
    audioRef,
    isPlaying,
    playAudio,
    pauseAudio,
    volume,
    handleVolumeChange,
  } = useAudioPlayer(audioUrls);

  return (
    <div className="audio-player-container p-4 bg-gray-100 rounded-md shadow-md" data-testid={dataTestId}>
      <audio ref={audioRef} />
      <div className="flex items-center space-x-4">
        <button
          onClick={isPlaying ? pauseAudio : playAudio}
          className={`p-2 rounded-full ${
            isPlaying ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-blue-500 rounded-lg"
        />
      </div>
    </div>
    
  );
};

export default AudioPlayer;
