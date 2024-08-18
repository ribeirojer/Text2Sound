import fs from "node:fs";
import cheerio from "cheerio";
import JSZip from "jszip";
import https from "https";

export function isValidKey(key: string): boolean {
	// only allow s3 safe characters and characters which require special handling for now
	// https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
	return /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key);
}

function readEPUBFile(epubFilePath: string) {
	return fs.readFileSync(epubFilePath);
}

async function unzipEPUB(epubBuffer: Buffer) {
	return await JSZip.loadAsync(epubBuffer);
}

async function extractChapterOrder(zip: JSZip) {
	const tocFile = zip.file("OEBPS/toc.ncx");

	if (!tocFile) {
		throw new Error("Arquivo toc.ncx não encontrado");
	}

	const tocContent = await tocFile.async("text");
	const $ = cheerio.load(tocContent, { xmlMode: true });
	console.log(tocContent);

	const chapters: string[] = [];
	$("navPoint").each((index, element) => {
		const src = $(element).find("content").attr("src");
		if (src) {
			chapters.push(src);
		}
	});

	return chapters;
}

async function extractChapterText(zip: JSZip, chapterPath: string) {
	const chapterFile = zip.file(`OEBPS/${chapterPath}`);

	if (!chapterFile) {
		throw new Error(`Arquivo ${chapterPath} não encontrado`);
	}

	const content = await chapterFile.async("text");
	const $ = cheerio.load(content);
	return $("body").text();
}

export async function extractTextFromEPUB(epubFilePath: string) {
	const response: Buffer = await new Promise((resolve, reject) => {
		https
			.get(epubFilePath, (res) => {
				const data: any[] = [];
				res.on("data", (chunk) => data.push(chunk));
				res.on("end", () => resolve(Buffer.concat(data)));
			})
			.on("error", reject);
	});

	const textContents = [];
	const zip = await unzipEPUB(response);

	const chapters = await extractChapterOrder(zip);
	console.log(chapters);

	for (const chapterPath of chapters) {
		const text = await extractChapterText(zip, chapterPath);
		textContents.push(text);
	}
	console.log(textContents);

	return textContents;
}

async function extractImagesFromChapter(zip: JSZip, chapterPath: string) {
	const chapterFile = zip.file(`OEBPS/${chapterPath}`);

	if (!chapterFile) {
		throw new Error(`Arquivo ${chapterPath} não encontrado`);
	}

	const content = await chapterFile.async("text");
	const $ = cheerio.load(content);

	const images = $("img")
		.map((index, element) => $(element).attr("src"))
		.get();
	return images;
}

async function extractImageFiles(zip: JSZip, imagePaths: string[]) {
	const images: { name: string; data: Buffer }[] = [];

	for (const imagePath of imagePaths) {
		const imageFile = zip.file(`OEBPS/${imagePath}`);
		if (imageFile) {
			const imageData = await imageFile.async("nodebuffer");
			images.push({ name: imagePath, data: imageData });
		}
	}

	return images;
}

export async function extractImagesFromEPUB(epubFilePath: string) {
	const epubBuffer = readEPUBFile(epubFilePath);
	const zip = await unzipEPUB(epubBuffer);
	const chapters = await extractChapterOrder(zip);

	const allImages: string[] = [];

	for (const chapterPath of chapters) {
		const images = await extractImagesFromChapter(zip, chapterPath);
		allImages.push(...images);
	}

	const imageFiles = await extractImageFiles(zip, allImages);

	// Opcional: Salvar as imagens em arquivos locais
	for (const imageFile of imageFiles) {
		fs.writeFileSync(`./output/${imageFile.name}`, imageFile.data);
	}

	return imageFiles;
}
