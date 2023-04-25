import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";
import convertToMp3 from "@/lib/convertToMp3";
import chunkMp3File from "@/lib/chunkMp3File";
import deleteFilesInDir from "@/lib/deleteFilesInDir";

/**
 * Handles the transcription of an audio file sent as a multipart form data request.
 * The audio file is first converted to MP3 format and split into chunks.
 * Each chunk is then sent to the OpenAI API for transcription.
 * Finally, the transcriptions are concatenated and returned in a JSON response.
 *
 * @async
 * @function
 * @param {Request} req - The incoming request containing the audio file.
 * @returns {Promise<Response>} A promise that resolves to a JSON response containing the transcription results in an array.
 * @example
 * ```
 * // Input (form data with an audio file):
 * // file: example.wav
 *
 * // Output (JSON response):
 * "[{\"fileName\": \"example.txt\", \"transcription\": \"This is an example transcription of the audio file.\"}]"
 * ```
 */
export const POST = async (req: Request): Promise<Response> => {
  // Retrieve form data and the file from the request
  const form = await req.formData();
  const files = form.getAll("file") as File[];
  const baseDir = path.join(process.cwd(), "public", "uploads");

  // Create the base directory if it doesn't exist
  !fs.existsSync(baseDir) && fs.mkdirSync(baseDir, { recursive: true });

  const results: { fileName: string; transcription?: string }[] = [];

  await Promise.all(
    files.map(async (file: File) => {
      const [fileName] = file.name.split(".");
      const inputFilePath = path.join(baseDir, file.name);

      // Write the file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(inputFilePath, buffer);

      // Convert the file to MP3 and split it into chunks
      const mp3FilePath = await convertToMp3(inputFilePath);
      const chunkedMp3Paths = await chunkMp3File(mp3FilePath);

      const url = "https://api.openai.com/v1/audio/transcriptions";
      const header = {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.OPENAI_APIKEY}`,
      };

      // Map over chunked MP3 paths and create a promise for each file to be transcribed
      const promises = chunkedMp3Paths.map(async (chunkedMp3Path) => {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(chunkedMp3Path));
        formData.append("model", "whisper-1");
        formData.append("response_format", "text");

        try {
          // Send a transcription request for each chunked MP3 file
          const response = await fetch(url, {
            method: "POST",
            headers: { ...header, ...formData.getHeaders() },
            body: formData,
          });

          if (!response.ok) throw new Error(response.statusText);

          const responseText = await response.text();
          return { output: responseText };
        } catch (error) {
          return { error };
        }
      });

      const result = await Promise.all(promises);

      // Assembles all the transcribed chuncks back into a single output
      const { output: transcription } = result.reduce<{ output?: string }>(
        (acc, cur) => ({
          output: acc.output ? acc.output + cur.output : cur.output,
        }),
        {}
      );

      // Pairs the file name with the transcription and pushes it to the results array
      results.push({ fileName: `${fileName}.txt`, transcription });
    })
  );

  // Delete all files in the uploads directory once the files aren't needed anymore.
  deleteFilesInDir(baseDir);
  return new Response(JSON.stringify(results), { status: 200 });
};