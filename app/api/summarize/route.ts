import { USER_PROMPTS, SYSTEM_PROMPTS, PROMPT_PRIMERS } from "@/constants";
import assembleSummary from "@/lib/assembleSummary";
import callGptSummarizerApi from "@/lib/callGptSummarizerApi";
import chunkedSummaryDataReducer from "@/lib/chunkedSummaryDataReducer";
import chunkTxtFile from "@/lib/chunkTxtFile";

import deleteFilesInDir from "@/lib/deleteFilesInDir";
import extractSummaryData from "@/lib/extractSummaryData";

import fs from "fs";
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


  const [ summaryChunkedTxtPaths ] = await Promise.all(files.map(async file => {
    const inputFilePath = path.join(baseDir, file.name); // Create the path to the file

    // Write the file to disk. fs needs it as a buffer, so we convert it.
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(inputFilePath, buffer);

    // Chunk the text file by tokens for the OpenAI API, The prompts are passed in to account for the tokens they occupy
    return await chunkTxtFile(
      inputFilePath,
      [
        USER_PROMPTS.summarize,
        SYSTEM_PROMPTS.summarize,
        PROMPT_PRIMERS.summarize
      ]
    );
  }));

  // Send each chunk to the OpenAI API for summarization, returning an array of summaries for every chunk
  const summaries = await Promise.all(summaryChunkedTxtPaths.map(async chunkedTxtPath => {
    const userInput = fs.readFileSync(chunkedTxtPath, "utf-8");

    return await callGptSummarizerApi(userInput, PROMPT_PRIMERS.summarize);
  }));

  // Extract the summary data into an object
  const summaryData = await extractSummaryData(summaries);

  // Summarize the summaries into a single summary
  const summarizedSummaryData = await chunkedSummaryDataReducer(summaryData) as ReturnType<typeof extractSummaryData>;

  // Put the summary data together into a string
  const summary = assembleSummary(summarizedSummaryData);

  // Delete the files transiently stored on disk. We don't need them anymore.
  deleteFilesInDir(baseDir);
  return new Response(JSON.stringify(summary), { status: 200 });
};