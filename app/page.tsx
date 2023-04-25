"use client";

import { NextPage } from "next";
import styles from "./page.module.css";
import FilePicker from "@/components/FilePicker";
import downloadFile from "@/lib/downloadFile";

type OnFileSelect = (files: File[]) => void;
type TranscriptionType = {
  fileName: string;
  transcription: string;
};

const Home: NextPage = () => {
  const sendToServer: OnFileSelect = async (files) => {
    const formData = new FormData();

  // Loop through the files array and append each file to the formData (This does not overwrite the key, so each file will be appended with the same key)
  files.forEach((file) => {
    formData.append(`file`, file);
  });

    try {
      const url = "http://localhost:3000/api/transcribe";
      const headers = { "Accept": "application/json" };
      const response = await fetch(url, { method: "POST", headers, body: formData });
      const parsedResponse = JSON.parse(await response.text());
      if (!response.ok) throw new Error("Failed to fetch data from the server.");

      parsedResponse.forEach((res: TranscriptionType) => {
      const { fileName, transcription } = res;
      downloadFile(fileName, transcription);
    });
    } catch (error) {
      console.error(`Error on Page.tsx: ${error}`);
    }
  };

  return (
    <>
      <FilePicker onFilesSelect={sendToServer} />
    </>
  );
};

export default Home;