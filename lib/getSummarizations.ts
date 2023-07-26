import { FetchStatus } from "@/constants";
import callSummarizerApi from "./callSummarizerApi";
import callTranscriptorApi from "./callTranscriptorApi";
import { v4 as uuidv4 } from "uuid";

export type Summarization = { summary: string, name: string, status: FetchStatus, id: string };
type OnFileSelect = (files: File[]) => Promise<Summarization[]>;

/**
 * Sends the selected files to the server and gets the summary and name of each file.
 * @async
 * @param {File[]} files - An array of files to send.
 * @returns {Promise<Summarization[]>} - A Promise that resolves to the file summarizations and file names.
 */
const getNewSummarizations: OnFileSelect = async files => {
  const transcriptResponse = await callTranscriptorApi(files);

  // Download each file
  const response = Promise.allSettled(transcriptResponse.map(async({ fileName, transcription }) => {
    const summary = await callSummarizerApi(transcription);
    return { summary, name: fileName };
  }));

  return (await response).map(summarizationResponse => {
    if (summarizationResponse.status === "fulfilled"){
      return { ...summarizationResponse.value, status: "success", id: uuidv4() };
    } else {
      return { summary: summarizationResponse.reason, name: "ERROR", status: "error", id: uuidv4() };
    }
  });
};

export default getNewSummarizations;