import React from "react";

interface FileUploadProps {
	file: File | null;
	setFile: (file: File | null) => void;
	setError: (error: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, setFile, setError }) => {
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setError(null);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const droppedFile = e.dataTransfer.files?.[0];
		if (droppedFile) {
			setFile(droppedFile);
			setError(null);
		}
	};

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onClick={handleClick}
			className="drag-drop-area border-2 border-dashed p-4 rounded-lg mb-4 cursor-pointer"
		>
			{file ? (
				<p className="file-name text-center text-emerald-700">{file.name}</p>
			) : (
				<div>
					<img
						src="/undraw_add_files_re_v09g.svg"
						alt=""
						className="w-2/3 max-h-40 mx-auto mb-4"
					/>
					<p className="text-gray-500 text-center">
						Arraste e solte o arquivo EPUB aqui ou clique para selecionar.
					</p>
				</div>
			)}
			<input
				type="file"
				accept=".epub"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
			/>
		</div>
	);
};

export default FileUpload;
