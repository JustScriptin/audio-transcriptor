import chunkTxtFile from "@/lib/chunkTxtFile";
import deleteFilesInDir from "@/lib/deleteFilesInDir";
import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";
import path from "path";

/**
 * Handles the summarization of a text file sent as a multipart form data request.
 * The text file is first split into chunks according to the API's token requirements.
 * Each chunk is then sent to the OpenAI API for summarization.
 * Finally, the summaries are concatenated and returned in a JSON response.
 *
 * @async
 * @function
 * @param {Request} req - The incoming request containing the text file.
 * @returns {Promise<Response>} A promise that resolves to a JSON response containing the
 * summary results in an array.
 * @example
 * ```
 * // Input (form data with a text file):
 * // file: example.txt
 *
 * // Output (JSON response):
 * "[{\"fileName\": \"example.txt\", \"summary\": \"This is an example summary of the text file.\"}]"
 * ```
 */
export const POST = async(req: Request): Promise<Response> => {
  // Retrieve form data and the file from the request
  const form = await req.formData();
  const files = form.getAll("file") as File[];
  const baseDir = path.join(process.cwd(), "public", "uploads");

  // Create the base directory if it doesn't exist
  !fs.existsSync(baseDir) && fs.mkdirSync(baseDir, { recursive: true });

  const results: { fileName: string; summary?: string }[] = [];

  await Promise.all(files.map(async(file: File) => {
    const [ fileName ] = file.name.split(".");
    const inputFilePath = path.join(baseDir, file.name);

    // Write the file to disk. fs needs it as a buffer, so we convert it.
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(inputFilePath, buffer);

    // Chunk the text file by tokens for the OpenAI API
    const chunkedTxtPaths = await chunkTxtFile(inputFilePath);

    const url = "https://api.openai.com/v1/chat/completions";
    const header = {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.OPENAI_APIKEY}`
    };

    // Map over chunked MP3 paths and create a promise for each file to be transcribed
    const promises = chunkedTxtPaths.map(async chunkedTxtPath => {
      const fileContent = await fs.promises.readFile(chunkedTxtPath, "utf-8");

      const formData = new FormData();
      formData.append("model", "gpt-3.5-turbo");

      // Serialize the messages object as a JSON string and include the file content as text.
      formData.append("messages", JSON.stringify([
        { role: "user", content: "Summarize the following video transcript ${fileContent}" }
      ]));

      try {
        // Send a transcription request for each chunked MP3 file
        const response = await fetch(url, {
          method: "POST",
          headers: { ...header, ...formData.getHeaders() },
          body: formData
        });

        if (!response.ok) throw new Error(response.statusText);

        const responseText = await response.text();
        console.log("Summarization Route Res: ", responseText);
        return { output: responseText };
      } catch (error){
        return { error };
      }
    });

    const result = await Promise.all(promises);

    // Assembles all the transcribed chuncks back into a single output
    const { output: summary } = result.reduce<{ output?: string }>(
      (acc, cur) => ({
        output: acc.output ? acc.output + cur.output : cur.output
      }),
      {}
    );

    // Pairs the file name with the transcription and pushes it to the results array
    results.push({ fileName: `${fileName}.txt`, summary });
  }));

  // Delete all files in the uploads directory once the files aren't needed anymore.
  deleteFilesInDir(baseDir);
  return new Response(JSON.stringify(results), { status: 200 });
};
