import React, { useState } from "react";
import Loading from "@/components/Loading";

interface BookOptionsProps {
	id: string;
	isExtractText: boolean;
	onTextExtracted: (numberPages: number) => void;
}

const BookOptions: React.FC<BookOptionsProps> = ({
	id,
	isExtractText,
	onTextExtracted,
}) => {
	const handleViewSyncedText = () => {
		onTextExtracted(0); // Apenas para simular a ação
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-2">Opções de Leitura:</h2>
			{isExtractText && (
				<button
					onClick={handleViewSyncedText}
					className="w-full mb-4 px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
				>
					Ouvir com texto sincronizado
				</button>
			)}
		</div>
	);
};

export default BookOptions;
