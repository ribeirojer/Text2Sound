export interface UploadResponse {
	success: boolean;
	message: string;
	bookId: string;
	fileUrl: string;
	filename: string;
	number_of_pages: number;
}

export interface UploadedBook {
	is_extract_text?: any;
	bookId: string;
	public_url: string;
	filename: string;
	number_of_pages: number;
}
