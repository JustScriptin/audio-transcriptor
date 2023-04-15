"use client";

import { NextPage } from "next";
import styles from "./page.module.css";
import FilePicker from "@/components/FilePicker";

type OnFileSelect = (file: File) => void;

const Home: NextPage = () => {
  const sendToServer: OnFileSelect = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = "http://localhost:3000/api/transcribe";
      const headers = { "Accept": "application/json" };
      const response = await fetch(url, { method: "POST", headers, body: formData });

      if (!response.ok) throw new Error("Failed to fetch data from the server.");

      const { fileName, transcription } = await response.json();

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(new Blob([transcription], { type: "text/plain" }));
      downloadLink.download = fileName;
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error(`Error on Page.tsx: ${error}`);
    }
  };

  return (
    <>
      <FilePicker onFileSelect={sendToServer} />
    </>
  );
};

export default Home;