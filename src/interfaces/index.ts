
export interface UploadResponse {
    success: boolean;
    message: string;
    bookId: string;
    fileUrl: string;
    filename: string;
  }
  
  export interface UploadedBook {
    bookId: string;
    fileUrl: string;
    filename: string;
  }
  