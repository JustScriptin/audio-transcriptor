import { promises as fsPromises } from "fs";

type ConcatenateFiles = (filePaths: string[], outputPath: string) => Promise<void>;

/**
 * Concatenates the content of multiple files into a single file.
 *
 * @param {string[]} filePaths - An array of file paths to concatenate.
 * @param {string} outputPath - The path of the output file.
 * @returns {Promise<void>} A promise that resolves when the operation is completed.
 */
const concatenateTxtFiles: ConcatenateFiles = async(filePaths, outputPath) => {
  const data = await Promise.all(filePaths.map(filePath => fsPromises.readFile(filePath, "utf-8")));
  const content = data.join(" ");
  await fsPromises.writeFile(outputPath, content, "utf8");
};

export default concatenateTxtFiles;
