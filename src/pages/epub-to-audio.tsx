import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import UploadedBooksList from "@/components/UploadedBooksList";
import ErrorMessage from "@/components/ErrorMessage";
import { useEpubUpload } from "@/hooks/useEpubUpload";
import Loading from "@/components/Loading";

const EpubToAudio = () => {
	const {
		file,
		uploading,
		error,
		uploadedBooks,
		showUploadForm,
		setFile,
		setError,
		handleUpload,
		handleDeleteBook,
		startNewUpload,
	} = useEpubUpload();

	return (
		<Layout>
			<h1 className="text-center text-2xl md:text-4xl font-bold mb-6">
				Transforme seu EPUB em áudio
			</h1>
			<div className="max-w-lg mx-auto mt-10">
				{uploadedBooks.length > 0 && !showUploadForm ? (
					<>
						<UploadedBooksList
							books={uploadedBooks}
							onDeleteBook={handleDeleteBook}
						/>
						<button
							onClick={startNewUpload}
							className="w-full px-4 py-2 mt-4 rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700"
							data-testid="new-upload-button"
						>
							Novo Upload
						</button>
					</>
				) : (
					<>
						<FileUpload file={file} setFile={setFile} setError={setError} />
						<button
							onClick={handleUpload}
							disabled={uploading}
							className={`w-full px-4 py-2 mt-4 rounded-md text-white bg-gradient-to-r from-[--zomp] to-[--yellow-green] hover:bg-orange-700 ${
								uploading ? "cursor-not-allowed opacity-75" : ""
							}`}
							data-testid="upload-button"
						>
							{uploading ? "Carregando..." : "Fazer Upload"}
						</button>
						{uploading && <Loading message="Carregando, aguarde..." />}
					</>
				)}
				{error && <ErrorMessage message={error} />}
				{uploading && <Loading message="Carregando, aguarde..." />}
			</div>
		</Layout>
	);
};

export default EpubToAudio;
