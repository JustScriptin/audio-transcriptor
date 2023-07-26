import { selectedSummarizationIdAtom, summarizationsAtom } from "@/app/atoms/summariztionsAtom";
import { FetchStatus } from "@/constants";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import DownloadSummaryButton from "../DownloadSummaryButton";
import styles from "./SummarizationList.module.scss";

interface SummarizationProps {
    summarization: string;
    summarizationName: string;
    summarizationStatus: FetchStatus;
  }

const Summarization: React.FC<SummarizationProps> = ({
  summarization,
  summarizationName,
  summarizationStatus,
}) => {
  const setSummarizations = useSetRecoilState(summarizationsAtom);
  const setSelectedSummarizationId = useSetRecoilState(selectedSummarizationIdAtom);
  const deleteSummarization = () => {
    setSummarizations(currentSummarizations => currentSummarizations.filter(({ name }) => name !== summarizationName));
  };
  const selectSummarization = () => {
    setSelectedSummarizationId(summarizationName);
  };
  return (
    <div
      className={styles.item}
      onClick={selectSummarization}
    >
      <h2 className={styles.item__name}>{summarizationName}</h2>
      <div>
        <button className={`button ${styles.item__delete}`} onClick={deleteSummarization}>🗑</button>
        <DownloadSummaryButton
          summarization={{ summary: summarization, name: summarizationName, status: summarizationStatus }}
          summarizationDataStatus={summarizationStatus}
        />
      </div>
    </div>
  );
};

const SummarizationsList = () => {
  const summarizations = useRecoilValue(summarizationsAtom);
  console.log(summarizations);
  return (
    <div className={styles.sidebar}>
      {summarizations.map(summarization => <Summarization
        key={summarization.id}
        summarization={summarization.summary}
        summarizationName={summarization.name}
        summarizationStatus={summarization.status}/>)
      }
    </div>
  );
};

export default SummarizationsList;