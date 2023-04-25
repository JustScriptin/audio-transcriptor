import fs from "fs/promises";
import path from "path";

/**
 * Deletes all files and subdirectories within the specified directory.
 *
 * @param {string} directoryPath - The path of the directory to delete files from.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
const deleteFiles = async (directoryPath: string): Promise<void> => {
  try {
    const files = await fs.readdir(directoryPath);
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          await deleteFiles(filePath);
        } else {
          await fs.unlink(filePath);
          console.log(`File ${file} deleted successfully`);
        }
      })
    );
  } catch (error) {
    console.error(`Error deleting files: ${error}`);
  }
};

export default deleteFiles;
