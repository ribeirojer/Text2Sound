import { getSinglePageByBookId } from "@/utils/supabaseService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    
    try {
      const { id, pageNumber } = JSON.parse(req.body);

      if (!id) {
        res.status(400).json({ error: "Book ID is required" });
        return;
      }

      if (!pageNumber) {
        res.status(400).json({ error: "Page number is required" });
        return;
      }

      const pageNumberConverted = Number.parseInt(pageNumber);

      if (Number.isNaN(pageNumberConverted) || pageNumberConverted < 1) {
        res.status(400).json({ error: "Invalid page number" });
        return;
      }

      const pageContent = await getSinglePageByBookId(id, pageNumberConverted);

      res.status(200).json({
        success: true,
        message: "Page content retrieved successfully",
        page_id: pageContent?.id,
        content: pageContent?.content,
        audioUrl: pageContent?.audio_urls,
      });
    } catch (err) {
      console.error("Error extracting text:", err);
      res.status(500).json({ error: "Internal server error" });
    }

  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
