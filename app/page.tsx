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

    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const url = "http://localhost:3000/api/transcribe";
      const headers = { "Accept": "application/json" };
      const response = await fetch(url, { method: "POST", headers, body: formData });

      if (!response.ok) throw new Error("Failed to fetch data from the server.");

      const parsedResponse: TranscriptionType[] = await response.json();

      parsedResponse.forEach(({ fileName, transcription }) => {
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