import ffmpeg from "fluent-ffmpeg";
import path from "path";

ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");

/**
 * Converts a media file to an MP3 file using ffmpeg.
 *
 * @param {string} inputFilePath - The path of the input file.
 * @returns {Promise<string>} A promise that resolves with the output file path of the converted file.
 * @example
 * ```
 * // If the input file is "input.wav", the output might look like:
 * "input.mp3"
 * ```
 */
const convertToMp3 = (inputFilePath: string): Promise<string> => {
  const [ fileName, inputFileType ] = path.basename(inputFilePath).split(".");
  const outputFilePath = path.join(path.dirname(inputFilePath), `${fileName}.mp3`);

  if (inputFileType === "mp3") return Promise.resolve(inputFilePath);

  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .inputFormat(inputFileType)
      .format("mp3")
      .audioCodec("libmp3lame")
      .on("error", err => {
        reject(err);
      })
      .on("end", () => {
        resolve(outputFilePath);
      })
      .save(outputFilePath);
  });
};

export default convertToMp3;
