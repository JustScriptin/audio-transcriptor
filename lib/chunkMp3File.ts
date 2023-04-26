import ffmpeg, { FfprobeData } from "fluent-ffmpeg";
import fs from "fs/promises";
import path from "path";

ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");

/**
 * Chunks an MP3 file if its size exceeds 20 MB and disregards any chunks that are less than 180 KB.
 *
 * @param {string} mp3FilePath - The path to the MP3 file to be chunked.
 * @returns {Promise<string[]>} An array of paths corresponding to the chunked files or the
 * original file if its size is under 20 MB.
 * @example
 * ```
 * // If the original file is "input.mp3" and it's chunked into 3 parts, the output might look like:
 * ["input_chunk001.mp3", "input_chunk002.mp3", "input_chunk003.mp3"]
 * ```
 */
const chunkMp3File = async(mp3FilePath: string): Promise<string[]> => {
  const fullFileName = path.basename(mp3FilePath);
  const [ fileName ] = fullFileName.split(".");
  const outputChunkPaths: string[] = [];
  const outputDir = path.dirname(mp3FilePath);

  // Retrieve file data using ffprobe and fs
  const stats = await fs.stat(mp3FilePath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  const fileData: FfprobeData = await new Promise((resolve, reject) => {
    // eslint-disable-next-line no-confusing-arrow
    ffmpeg.ffprobe(mp3FilePath, (err, data) => err ? reject(err) : resolve(data));
  });

  const { duration: fileDuration = 0, format_name: inputFormat = "" } =
    fileData.format ?? {};

  // If file size is less than or equal to 20 MB, do not chunk
  if (fileSizeInMB <= 20){
    outputChunkPaths.push(mp3FilePath);
  } else {
    const targetChunkSizeInBytes = 20 * 1024 * 1024;
    const targetChunkDurationInSeconds =
      targetChunkSizeInBytes / stats.size * fileDuration;

    // Create chunks using ffmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(mp3FilePath)
        .inputFormat(inputFormat)
        .format("mp3")
        .outputOptions(
          "-map",
          "0",
          "-segment_time",
          targetChunkDurationInSeconds.toString(),
          "-f",
          "segment"
        )
        .on("error", err => reject(err))
        .on("end", () => resolve())
        .saveToFile(path.join(outputDir, `${fileName}_chunk%03d.mp3`));
    });

    // Filters output directory for chunked files
    const outputFiles = await fs.readdir(outputDir);
    const chunkFiles = outputFiles.filter(file => file.startsWith(`${fileName}_chunk`));

    /* Saves file paths of chunked files that are greater than or equal to 180 KB but smaller than 20 MB into an
         array to be returned */
    // eslint-disable-next-line arrow-parens
    await Promise.all(chunkFiles.map(async(file) => {
      const filePath = path.join(outputDir, file);
      const fileStats = await fs.stat(filePath);
      if (fileStats.size >= 180 * 1024){
        outputChunkPaths.push(filePath);
      } else {
        await fs.unlink(filePath);
      }
    }));
  }

  return outputChunkPaths;
};

export default chunkMp3File;
