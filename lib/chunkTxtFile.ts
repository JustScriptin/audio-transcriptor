import { MODEL } from "@/constants";
import countTokens from "@/lib/countTokens";
import { readFileSync, writeFileSync } from "fs";
import { parse, join, dirname } from "path";

const chunkTxtFile = async (txtFilePath: string, prompts: string[]): Promise<string[]> => {
  const fileName = parse(txtFilePath).name;
  const outputDir = dirname(txtFilePath);
  const promptTokens = countTokens(prompts.join(' '));

  // Safety margin to avoid accidental exceedance of the token limit.
  const tokenLimitWithMargin = MODEL.tokenLimit * 0.9 - promptTokens;

  const fileContent = readFileSync(txtFilePath, "utf8");
  const words = fileContent.split(/\s+/);

  let chunk = "";
  let chunkTokens = 0;
  let chunkIndex = 1;
  const outputChunkPaths: string[] = [];

  for (const word of words) {
    const wordWithSpace = word + ' ';
    const wordTokens = countTokens(wordWithSpace);

    if (chunkTokens + wordTokens > tokenLimitWithMargin) {
      const chunkPath = join(outputDir, `${fileName}_chunk${String(chunkIndex).padStart(3, "0")}.txt`);
      writeFileSync(chunkPath, chunk.trim());
      outputChunkPaths.push(chunkPath);

      chunk = "";
      chunkTokens = 0;
      chunkIndex++;
    }

    chunk += wordWithSpace;
    chunkTokens += wordTokens;
  }

  if (chunk) {
    const chunkPath = join(outputDir, `${fileName}_chunk${String(chunkIndex).padStart(3, "0")}.txt`);
    writeFileSync(chunkPath, chunk.trim());
    outputChunkPaths.push(chunkPath);
  }

  return outputChunkPaths;
};

export default chunkTxtFile;
