/**
 * Sends a text file to a local server endpoint for summarization.
 * The server summarizes the text and returns it in markdown format.
 *
 * @async
 * @function sendFileToTranscribe
 * @param {string} transcript - The text to be summarized.
 * @returns {Promise<string>} A promise that resolves to the summarized text in markdown format.
 * @throws {Error} If the fetch request fails.
 *
 * @example
 * async function example() {
 *   try {
 *     const markdown = await sendFileToTranscribe("Hello, world!");
 *     console.log(markdown);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * }
 * example();
 */
const sendFileToTranscribe = async(transcript:string):Promise<string> => {
  const textFile = new Blob([ transcript ], { type: "text/plain" });
  const url = "http://localhost:3000/api/summarize";
  const headers = { Accept: "application/json" };

  const formData = new FormData();
  formData.append("file", textFile, "filename.txt");

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  return data;
};

export default sendFileToTranscribe;