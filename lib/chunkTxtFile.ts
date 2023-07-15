import { MODEL } from "@/constants";
import countTokens from "@/lib/countTokens";
import { promises as fsPromises, createReadStream } from "fs";
import { parse, join, dirname } from "path";
import { createInterface } from "readline";

const chunkTxtFile = async(txtFilePath: string, prompts: string[]): Promise<string[]> => {
  const { name: fileName } = parse(txtFilePath);
  console.log(`File Name: ${fileName}`);

  const outputDir = dirname(txtFilePath);
  console.log(`Output Directory: ${outputDir}`);

  const promptTokens = countTokens(prompts);
  console.log(`Prompt Tokens: ${promptTokens}`);

  const fileTokens = countTokens(await fsPromises.readFile(txtFilePath, "utf8"));
  console.log(`File Size in Tokens: ${fileTokens}`);

  const totalTokens = promptTokens + fileTokens;
  console.log(`Total Tokens: ${totalTokens}`);

  if (MODEL.tokenLimit >= totalTokens){
    console.log("File size is within the token limit");
    return [ txtFilePath ];
  }

  // This is to be able to read the file line by line
  const fileStream = createReadStream(txtFilePath, { encoding: "utf8" });
  const readStream = createInterface({ input: fileStream });

  let chunk = "";
  let chunkTokens = 0;
  let chunkIndex = 1;
  const outputChunkPaths: string[] = [];

  for await (const line of readStream){
    const lineTokens = countTokens(line);
    console.log(`Line Tokens: ${lineTokens}`);

    if (chunkTokens + lineTokens > MODEL.tokenLimit){
      if (chunk){
        const chunkPath = join(outputDir, `${fileName}_chunk${String(chunkIndex).padStart(3, "0")}.txt`);
        console.log(`Writing chunk to: ${chunkPath}`);
        await fsPromises.writeFile(chunkPath, chunk);
        outputChunkPaths.push(chunkPath);
      }

      chunk = "";
      chunkTokens = 0;
      chunkIndex++;
    }

    if (lineTokens > MODEL.tokenLimit){
      // Split the line into smaller chunks
      const lineChunks = chunkString(line, MODEL.tokenLimit);
      for (const lineChunk of lineChunks){
        if (chunkTokens + countTokens(lineChunk) > MODEL.tokenLimit){
          const chunkPath = join(outputDir, `${fileName}_chunk${String(chunkIndex).padStart(3, "0")}.txt`);
          console.log(`Writing chunk to: ${chunkPath}`);
          await fsPromises.writeFile(chunkPath, chunk);
          outputChunkPaths.push(chunkPath);

          chunk = "";
          chunkTokens = 0;
          chunkIndex++;
        }

        chunk += `${lineChunk}\n`;
        chunkTokens += countTokens(lineChunk);
        console.log(`Current Chunk Tokens: ${chunkTokens}`);
      }
    } else {
      if (chunkTokens + lineTokens > MODEL.tokenLimit){
        const chunkPath = join(outputDir, `${fileName}_chunk${String(chunkIndex).padStart(3, "0")}.txt`);
        console.log(`Writing chunk to: ${chunkPath}`);
        await fsPromises.writeFile(chunkPath, chunk);
        outputChunkPaths.push(chunkPath);

        chunk = "";
        chunkTokens = 0;
        chunkIndex++;
      }

      chunk += `${line}\n`;
      chunkTokens += lineTokens;
      console.log(`Current Chunk Tokens: ${chunkTokens}`);
    }
  }

  if (chunk){
    const chunkPath = join(outputDir, `${fileName}_chunk${String(chunkIndex).padStart(3, "0")}.txt`);
    console.log(`Writing chunk to: ${chunkPath}`);
    await fsPromises.writeFile(chunkPath, chunk);
    outputChunkPaths.push(chunkPath);
  }

  return outputChunkPaths;
};

const chunkString = (str: string, size: number): string[] => {
  // Split the string into words
  const words = str.split(/\s+/);

  const chunks = [];
  let currChunk = "";
  let currChunkSize = 0;

  for (const word of words){
    // Check if adding the next word would exceed the chunk size
    if (currChunkSize + word.length + 1 > size){
      // Add the current chunk
      chunks.push(currChunk.trim());

      // Start a new chunk
      currChunk = "";
      currChunkSize = 0;
    }

    // Add the word to the current chunk
    currChunk += `${word} `;
    currChunkSize += word.length + 1;
  }

  // Add the last chunk
  chunks.push(currChunk.trim());

  return chunks;
};

export default chunkTxtFile;
