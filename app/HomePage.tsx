"use client";

import FileUploadButton, { useUpdateSummarizationState } from "@/components/FileUploadButton";
import MarkdownInterpreter from "@/components/MarkdownInterpreter";
import SummarizationsList from "@/components/SummarizationsList";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRecoilValue } from "recoil";
import { selectedSummarizationSelector } from "./atoms/summariztionsAtom";
import styles from "./page.module.scss";

const FileUploadDropzone = () => {
  const updateSummarizationState = useUpdateSummarizationState();
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    updateSummarizationState(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  return (
    <div
      className={styles.header}
      {...getRootProps()}
      style={isDragActive ? { backgroundColor: "lightgray" } : {}}
    >
      <input {...getInputProps()} />
      <div className={styles.buttons}>
        <FileUploadButton />
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const selectedSummarization = useRecoilValue(selectedSummarizationSelector);

  const summary = selectedSummarization?.summary ?? "";

  return (
    <div className={styles.homepage}>
      <FileUploadDropzone />
      <SummarizationsList />
      <MarkdownInterpreter markdown={summary}/>
    </div>
  );
};


export default HomePage;
