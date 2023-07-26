import { FetchStatus } from "@/constants";
import { atom, selector } from "recoil";

type SummarizationsData = {
  summary: string,
  name: string,
  status: FetchStatus
  id: string
};

const mockSummarizationsData: SummarizationsData[] = [
  {
    summary: `
## 1. AUDIENCE ANALYSIS
  - **Intended Audience:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
        
## 2. CONTENT ANALYSIS
  - **Main Topics:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
  - **Critical Components:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
            
## 3. TEXT DECONSTRUCTION
  - **Procedure Breakdown:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
  1. Step 1
  2. Step 2
  3. Step 3
            
## 4. CONCLUSION
  - **Summary:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
            
## 5. INFERRED INNOVATION
  - **Deep Analysis:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
          `,
    name: "Example 1",
    status: "success",
    id: "1"
  },
  {
    summary: `
## 1. AUDIENCE ANALYSIS
  - **Intended Audience:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        
## 2. CONTENT ANALYSIS
  - **Main Topics:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  - **Critical Components:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            
## 3. TEXT DECONSTRUCTION
  - **Procedure Breakdown:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  1. Step 1
  2. Step 2
  3. Step 3
            
## 4. CONCLUSION
  - **Summary:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            
## 5. INFERRED INNOVATION
  - **Deep Analysis:** lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          `,
    name: "Example 2",
    status: "success",
    id: "2"
  },
];

const SUMMARIZATIONS_ATOM_KEY = "summarizationsAtomKey";
export const summarizationsAtom = atom<SummarizationsData[]>({
  key: SUMMARIZATIONS_ATOM_KEY,
  default: mockSummarizationsData
});

const SELECTED_SUMMARIZATION_ID_ATOM_KEY = "selectedSummarizationIdAtomKey";
export const selectedSummarizationIdAtom = atom<string | null>({
  key: SELECTED_SUMMARIZATION_ID_ATOM_KEY,
  default: null
});

const SELECTED_SUMMARIZATION_SELECTOR_KEY = "selectedSummarizationSelectorKey";
export const selectedSummarizationSelector = selector({
  key: SELECTED_SUMMARIZATION_SELECTOR_KEY,
  get: ({ get }) => {
    const selectedSummarizationId = get(selectedSummarizationIdAtom);
    const summarizations = get(summarizationsAtom);
    return summarizations.find(summarization => summarization.name === selectedSummarizationId);
  }
});

