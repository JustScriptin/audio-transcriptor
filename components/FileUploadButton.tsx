import { summarizationsAtom } from "@/app/atoms/summariztionsAtom";
import getNewSummarizations from "@/lib/getSummarizations";
import React, { ChangeEvent, useRef } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

export const useUpdateSummarizationState = () => {
  return useRecoilCallback(({ set }) => async(files: File[]) => {
    if (files){
      const filesList = Array.from(files);
      const loadingSummarizations = filesList.map(() => ({
        name: "Loading...",
        summary: "",
        status: "loading",
        id: uuidv4()
      } as const
      ));
      set(summarizationsAtom, currentSummarizations => [ ...currentSummarizations, ...loadingSummarizations ]);
      const newSummarizations = await getNewSummarizations(filesList);
      set(summarizationsAtom, currentSummarizations => currentSummarizations.filter(({ status }) => status !== "loading"));
      set(summarizationsAtom, currentSummarizations => [ ...currentSummarizations, ...newSummarizations ]);
    }
  });
};

// Main component
const FileUploadButton: React.FC = () => {
  const [ summarizations, setSummarizations ] = useRecoilState(summarizationsAtom);

  const isUploading = summarizations.some(({ status }) => status === "loading");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateSummarizationState = useUpdateSummarizationState();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      updateSummarizationState(Array.from(files));
    }
  };

  // Calls the input ref to open the file picker interface
  const openFilePickerInterface = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        className={`button ${isUploading ? "loading" : ""}`}
        onClick={openFilePickerInterface}
        disabled={isUploading}
      >
        {isUploading ? "Uploading Files" : "Upload Files"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,video/mp4"
        onChange={handleInputChange}
        style={{ display: "none" }}
        multiple
      />
    </>
  );
};

export default FileUploadButton;