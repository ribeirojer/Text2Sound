import Layout from "@/components/Layout";
import Link from "next/link";
import React from "react";

export default function Home() {
	return (
		<Layout>
			<h2 className="text-xl md:text-4xl font-extrabold mb-4">
				Bem-vindo(a) ao Conversor de Mídia
			</h2>
			<p className="mb-8">Escolha uma das opções abaixo para começar:</p>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Link
					href="/text-to-audio"
					className="option-card bg-gradient-to-r from-[--zomp] to-[--yellow-green] p-0.5 rounded-lg cursor-pointer hover:shadow-md hover:shadow-[--zomp]"
				>
					<div className="flex flex-col items-center bg-[--charcoal] rounded-md gap-4 p-4">
						<img
							src="/undraw_speech_to_text_re_8mtf.svg"
							alt=""
							className="w-2/3 max-h-40"
						/>

						<h2 className="text-2xl font-bold text-white">Texto para Áudio</h2>
						<p className="text-white">Converta texto digitado em áudio.</p>
					</div>
				</Link>
				<Link
					href="/epub-to-audio"
					className="option-card bg-gradient-to-r from-[--yellow-green] to-[--zomp] p-0.5 rounded-lg cursor-pointer hover:shadow-md hover:shadow-[--zomp]"
				>
					<div className="flex flex-col items-center bg-[--charcoal] rounded-md gap-4 p-4">
						<img
							src="/undraw_folder_files_re_2cbm.svg"
							alt=""
							className="w-2/3 max-h-40"
						/>
						<h2 className="text-2xl font-bold text-white">EPUB para Áudio</h2>
						<p className="text-white">
							Faça upload de um arquivo EPUB para conversão.
						</p>
					</div>
				</Link>
				<Link
					href="/audio-to-text"
					className="option-card bg-gradient-to-tl from-[--zomp] to-[--yellow-green] p-0.5 rounded-lg cursor-pointer hover:shadow-md hover:shadow-[--zomp]"
				>
					<div className="flex flex-col items-center bg-[--charcoal] rounded-md gap-4 p-4">
						<img
							src="/undraw_audio_player_re_cl20.svg"
							alt=""
							className="w-2/3 max-h-40"
						/>
						<h2 className="text-2xl font-bold text-white">Áudio para Texto</h2>
						<p className="text-white">
							Faça upload de um áudio para transcrição.
						</p>
					</div>
				</Link>
			</div>
		</Layout>
	);
}
