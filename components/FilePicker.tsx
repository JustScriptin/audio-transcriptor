import React, { ChangeEvent, useRef } from "react";

import styles from "./FilePicker.module.scss";
import sendToServer from "@/lib/sendToServer";

// Main component
const FilePicker: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When files are selected, calls the onFilesSelect function that will be passed as a prop
  const sendToUploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    files && sendToServer(Array.from(files));
  };

  // Calls the input ref to open the file picker interface
  const openFilePickerInterface = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={openFilePickerInterface}>
        Select Files
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,video/mp4"
        onChange={sendToUploadFiles}
        style={{ display: "none" }}
        multiple
      />
    </div>
  );
};

export default FilePicker;
