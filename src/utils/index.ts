import fs from 'fs';
import JSZip from 'jszip';
import cheerio from 'cheerio';

export function isValidKey(key: string): boolean {
    // only allow s3 safe characters and characters which require special handling for now
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
    return /^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(key)
  }

function readEPUBFile(epubFilePath: string) {
  return fs.readFileSync(epubFilePath);
}

async function unzipEPUB(epubBuffer: Buffer) {
  return await JSZip.loadAsync(epubBuffer);
}

async function extractChapterOrder(zip: JSZip) {
  const tocFile = zip.file('OEBPS/toc.ncx');
  
  if (!tocFile) {
    throw new Error('Arquivo toc.ncx não encontrado');
  }

  const tocContent = await tocFile.async('text');
  const $ = cheerio.load(tocContent, { xmlMode: true });

  const chapters: string[] = [];
  $('navPoint').each((index, element) => {
    const src = $(element).find('content').attr('src');
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

  const content = await chapterFile.async('text');
  const $ = cheerio.load(content);
  return $('body').text();
}

export async function extractTextFromEPUB(epubFilePath: string) {
  const epubBuffer = readEPUBFile(epubFilePath);
  const zip = await unzipEPUB(epubBuffer);
  const chapters = await extractChapterOrder(zip);

  const textContents = [];
  for (const chapterPath of chapters) {
    const text = await extractChapterText(zip, chapterPath);
    textContents.push(text);
  }

  return textContents;
}
