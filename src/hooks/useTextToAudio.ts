import { useHistoryContext } from "@/contexts/HistoryContext";
import { type SetStateAction, useRef, useState } from "react";
import axios from "axios";

export interface ITextToAudioResponse {
	audioUrl: string;
	wordTimings: WordTiming[];
}

export interface WordTiming {
	word: string;
	start: number;
	end: number;
}

export function useTextToAudio() {
	const [text, setText] = useState("");
	const [audioUrl, setAudioUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [progress, setProgress] = useState(0);
	const { history, addEntry } = useHistoryContext();
	const [wordTimings, setWordTimings] = useState<WordTiming[]>([]);
	const [currentWordIndex, setCurrentWordIndex] = useState(-1);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const resetCurrentWordIndex = () => setCurrentWordIndex(0);

	const handleTextChange = (e: {
		target: { value: SetStateAction<string> };
	}) => {
		setText(e.target.value);
	};

	const handleConvert = async () => {
		if (!text.trim()) {
			setError("O texto não pode estar vazio.");
			return;
		}

		if (text.length < 5) {
			setError("O texto deve ter pelo menos 5 caracteres.");
			return;
		}

		if (text.length > 500) {
			setError("O texto não pode ter mais de 500 caracteres.");
			return;
		}
		setLoading(true);
		setError("");

		try {
			const response = await axios.post("/api/text-to-audio", { text });
			const data = response.data;
            console.log(data);
			addEntry({ text, audioUrl: data.audioUrls[0], type: "text", timestamp: new Date().toISOString() })
			setAudioUrl(data.audioUrls[0]);
			setWordTimings(data.wordTimings.words);
		} catch (error) {
			console.error("Erro ao converter texto:", error);
			setError("Falha ao converter o texto.");
		} finally {
			setLoading(false);
			setProgress(0);
		}
	};
	/** 
	useEffect(() => {
		if (audioRef.current && wordTimings.length > 0) {
			const handleTimeUpdate = () => {
				const currentTime = audioRef.current?.currentTime || 0;
				let currentIndex = -1;
				for (let i = 0; i < wordTimings.length; i++) {
					if (
						currentTime >= wordTimings[i].start &&
						currentTime <= wordTimings[i].end
					) {
						currentIndex = i;
						break;
					}
				}
				setCurrentWordIndex(currentIndex);
			};

			audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
			return () => {
				audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
			};
		}
	}, [wordTimings]);
*/
	const handleNewConversion = () => {
		setText("");
		setAudioUrl("");
	};

	return {
		text,
		audioUrl,
		loading,
		error,
		progress,
		history,
		wordTimings,
		currentWordIndex,
		resetCurrentWordIndex,
		audioRef,
		handleTextChange,
		handleConvert,
		handleNewConversion,
	};
}
