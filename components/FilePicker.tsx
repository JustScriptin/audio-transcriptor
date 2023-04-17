import React, { useRef, ChangeEvent } from 'react';
import styles from './FilePicker.module.css';

interface FilePickerProps {
  onFileSelect: (file:File) => void;
}

// Main component
const FilePicker: React.FC<FilePickerProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When a file is selected, calls the onFileSelect function that will be passed as a prop
  const sendToUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    file && onFileSelect(file);
  };

  // Calls the input ref to open the file picker interface
  const openFilePickerInterface = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={openFilePickerInterface}>
        Select File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,video/mp4"
        onChange={sendToUploadFile}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FilePicker;