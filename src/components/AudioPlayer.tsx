import type { WordTiming } from "@/hooks/useTextToAudio";
import type React from "react";

type Props = {
	audioUrl: string;
	wordTimings: WordTiming[];
	currentWordIndex: number;
	audioRef: React.RefObject<HTMLAudioElement>;
	resetCurrentWordIndex: () => void; // Função para resetar o índice atual
};

const AudioPlayer = ({
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
			a.download = "audio.mp3";
			a.click();
		}
	};

	return (
		<div className="mt-6">
			<h2 className="text-2xl mb-4 font-semibold">Seu áudio está pronto:</h2>
			<div className="custom-audio-player flex flex-col items-center mb-4">
				<audio ref={audioRef} src={audioUrl} className="hidden" />

				<div className="text-lg flex flex-wrap justify-center border border-[--zomp] rounded-lg p-4 mb-4">
					{wordTimings &&
						wordTimings.map((word, index) => (
							<span
								key={index}
								className={`mx-1 ${index === currentWordIndex ? "bg-emerald-800 rounded" : ""}`}
							>
								{word.word}{" "}
							</span>
						))}
				</div>

				<div className="flex space-x-4 mb-4">
					<button
						onClick={handlePlayPause}
						className="bg-gradient-to-r from-[--zomp] to-[--yellow-green] px-4 py-2 rounded-full text-white"
					>
						▶️ / ⏸️
					</button>
					<button
						onClick={resetCurrentWordIndex}
						className="bg-gradient-to-r from-[--zomp] to-[--yellow-green] px-4 py-2 rounded-full text-white"
					>
						Reiniciar
					</button>
					<button
						onClick={handleDownload}
						className="bg-gradient-to-r from-[--yellow-green] to-[--zomp] px-4 py-2 rounded-full text-white"
					>
						Baixar
					</button>
				</div>
			</div>
		</div>
	);
};

export default AudioPlayer;
