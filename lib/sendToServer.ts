import callSummarizerApi from "./callSummarizerApi";
import callTranscriptorApi from "./callTranscriptorApi";
import downloadFile from "./downloadFile";

type OnFileSelect = (files: File[]) => Promise<void>;

/**
 * Sends the selected files to the server.
 * @async
 * @param {File[]} files - An array of files to send.
 * @returns {Promise<void>} - A Promise that resolves when the files are successfully sent.
 */
const sendToServer: OnFileSelect = async files => {
    const transcriptResponse = await callTranscriptorApi(files);
  
    // Download each file
    await Promise.all(transcriptResponse.map(async ({ fileName, transcription }) => {
      const summary = await callSummarizerApi(transcription);
      downloadFile(fileName, summary);
    }));
  }

export default sendToServer;