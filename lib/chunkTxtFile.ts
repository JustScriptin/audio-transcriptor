import { get_encoding } from "@dqbd/tiktoken";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
import readline from "readline";

/**
 * Chunks a text file if its size exceeds 4096 tokens
 *
 * @param {string} txtFilePath - The path to the txt file to be chunked.
 * @returns {Promise<string[]>} An array of paths corresponding to the chunked files or the
 * original file if its size is 4096 tokens or fewer.
 * @example
 * ```
 * // If the original file is "input.txt" and it's chunked into 3 parts, the output might look like:
 * ["input_chunk001.txt", "input_chunk002.txt", "input_chunk003.txt"]
 * ```
 */
const chunkTxtFile = async(txtFilePath: string): Promise<string[]> => {
  // Extract the file name from the provided path
  const { name: fileName } = path.parse(txtFilePath);

  // Get the directory path of the input file
  const outputDir = path.dirname(txtFilePath);

  // Get the encoding object to count tokens
  const encoding = get_encoding("cl100k_base");

  // Calculate the number of tokens in the input file
  const fileSizeInTokens = encoding.encode(await fsPromise.readFile(txtFilePath, "utf8")).length;

  // Release the memory of the encoding object
  encoding.free();

  // If the file size is 4096 tokens or fewer, return the original file path
  if (fileSizeInTokens <= 4096){
    return [ txtFilePath ];
  }

  // Create a read stream for the input file
  const fileStream = fs.createReadStream(txtFilePath, { encoding: "utf8" });

  // Create a readline interface to read the file line by line
  const readStream = readline.createInterface({ input: fileStream });

  // Initialize variables for chunking the file
  let chunk = "";
  let chunkTokens = 0;
  let chunkIndex = 1;
  const outputChunkPaths: string[] = [];

  // Iterate through each line of the input file
  for await (const line of readStream){
    // Calculate the number of tokens in the line
    const lineTokens = encoding.encode(line).length;

    // If adding the line tokens to the current chunk would exceed 4096 tokens, save the chunk and start a new one
    if (chunkTokens + lineTokens > 4096){
    // Generate the output path for the current chunk
      const chunkPath = path.join(outputDir, `${fileName}_chunk${String(chunkIndex).padStart(3, "0")}.txt`);

      // Write the current chunk to the output path
      await fsPromise.writeFile(chunkPath, chunk);

      // Add the output path to the list of chunk paths
      outputChunkPaths.push(chunkPath);

      // Reset the chunk and token count, increment the chunk index
      chunk = "";
      chunkTokens = 0;
      chunkIndex++;
    }

    // Add the line to the current chunk and update the token count
    chunk += `${line}\n`;
    chunkTokens += lineTokens;
  }

  // If there's still content in the chunk, save it to a file
  if (chunk){
    const chunkPath = path.join(outputDir, `${fileName}_chunk${String(chunkIndex).padStart(3, "0")}.txt`);
    await fsPromise.writeFile(chunkPath, chunk);
    outputChunkPaths.push(chunkPath);
  }

  // Return the list of output chunk paths
  return outputChunkPaths;
};

export default chunkTxtFile;