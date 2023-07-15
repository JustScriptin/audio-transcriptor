type TranscriptionType = {
    fileName: string;
    transcription: string;
  };

const callTranscriptorApi = async(files: File[]): Promise<TranscriptionType[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("file", file);
  });

  const url = "http://localhost:3000/api/transcribe";
  const headers = { Accept: "application/json" };

  const response = await fetch(url, { method: "POST", headers, body: formData });

  if (!response.ok) throw new Error("Failed to fetch data from the server.");

  return await response.json();
};

export default callTranscriptorApi;