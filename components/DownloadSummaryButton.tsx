import { FetchStatus } from "@/constants";
import downloadFile from "@/lib/downloadFile";
import { Summarization } from "@/lib/getSummarizations";

type DownloadSummaryButtonProps = {
    summarization: Omit<Summarization, "id">;
    summarizationDataStatus: FetchStatus;
  };

const DownloadSummaryButton: React.FC<DownloadSummaryButtonProps> = ({ summarization, summarizationDataStatus }) => {
  const handleDownloadButtonClick = () => downloadFile(summarization.name, summarization.summary);
  const hasSummarizations = summarizationDataStatus === "success";

  return (
    <button
      className="button"
      onClick={handleDownloadButtonClick}
      disabled={!hasSummarizations}
    >
        🡇
    </button>
  );
};

export default DownloadSummaryButton;