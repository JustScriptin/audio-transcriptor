"use client";

import FilePicker from "@/components/FilePicker";
import downloadFile from "@/lib/downloadFile";
import { NextPage } from "next";

// import styles from "./page.module.css";

type OnFileSelect = (files: File[]) => Promise<void>;
type TranscriptionType = {
  fileName: string;
  transcription: string;
};

const Home: NextPage = () => {
  // Define the sendToServer function to handle file uploads
  const sendToServer: OnFileSelect = async files => {
    const formData = new FormData();

    // Append each file to the FormData object to be sent to the server
    files.forEach(file => {
      formData.append("file", file);
    });

    const url = "http://localhost:3000/api/transcribe";
    const headers = { Accept: "application/json" };

    // Send the POST request to the server with the FormData object
    const response = await fetch(url, { method: "POST", headers, body: formData });

    if (!response.ok) throw new Error("Failed to fetch data from the server.");

    // Parse the server response
    const parsedResponse: TranscriptionType[] = await response.json();

    // Iterate through the parsed response and download each file
    parsedResponse.forEach(({ fileName, transcription }) => {
      downloadFile(fileName, transcription);
    });
  };

  return (
    <>
      <FilePicker onFilesSelect={sendToServer} />
    </>
  );
};

export default Home;
