import Layout from "@/components/Layout";
import React, { useState } from "react";

type Props = {};

const AudioToText = (props: Props) => {
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	const [progress, setProgress] = useState(0);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleFileChange = (e: any) => {
		setFile(e.target.files[0]);
		setError("");
	};

	const handleDragOver = (e: any) => {
		e.preventDefault();
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
		const droppedFile = e.dataTransfer.files[0];
		setFile(droppedFile);
		setError("");
	};

	const handleUpload = async () => {
		if (!file) {
			setError("Nenhum arquivo selecionado.");
			return;
		}

		setUploading(true);
		setProgress(0);
		setError("");

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("/api/upload/audio", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Erro no upload do arquivo.");
			}

			const result = await response.json();
			console.log("Arquivo de áudio processado:", result);
		} catch (err) {
			setError(`Erro ao fazer upload do arquivo: ${err}`);
		} finally {
			setUploading(false);
		}
	};

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<Layout>
			<h1 className="text-center text-2xl md:text-4xl font-bold mb-6">
				Faça a transcrição de áudio em texto
			</h1>
			<div className="max-w-lg mx-auto upload-container flex flex-col">
				<div
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={handleClick}
					className="drag-drop-area border-2 border-dashed p-4 rounded-lg mb-4"
				>
					{file ? (
						<p className="file-name">{file}</p>
					) : (
						<div className="cursor-pointer">
							<img
								src="/undraw_add_files_re_v09g.svg"
								alt=""
								className="w-2/3 max-h-40 mx-auto mb-4"
							/>
							<p className="text-gray-500 text-center">
								Arraste e solte o arquivo de áudio aqui ou clique para
								selecionar.
							</p>
						</div>
					)}
					<input
						type="file"
						accept="audio/*"
						ref={fileInputRef}
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>
				<button
					onClick={handleUpload}
					disabled={uploading}
					className={`px-4 py-2 mt-4 rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700 ${uploading ? "cursor-not-allowed" : ""}`}
				>
					{uploading ? `Upload... ${progress}%` : "Fazer Upload e Transcrever"}
				</button>
				{error && <p className="text-red-500 mt-2">{error}</p>}
			</div>
		</Layout>
	);
};

export default AudioToText;
