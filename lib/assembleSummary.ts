import type extractSummaryData from "./extractSummaryData";

type SummaryData = ReturnType<typeof extractSummaryData>;

/**
 * Gets an object with structured data and assembles it into a summary.
 *
 * @param {object} summaryData - An object containing the extracted summary data.
 * @returns {string} The assembled summary.
 */
const assembleSummary = (summaryData: SummaryData) => {
  const {
    audienceAnalysis,
    contentAnalysis,
    textDeconstruction,
    conclusion,
    inferredInnovation
  } = summaryData;

  const template = `
# Text Analysis Template
    
## 1. AUDIENCE ANALYSIS
  - **Intended Audience:** ${ audienceAnalysis.intendedAudience }

## 2. CONTENT ANALYSIS
  - **Main Topics:** ${ contentAnalysis.mainTopics }
  - **Critical Components:** ${ contentAnalysis.criticalComponents }
    
## 3. TEXT DECONSTRUCTION
  - **Procedure Breakdown:** ${ textDeconstruction.procedureBreakdown }
    
## 4. CONCLUSION
  - **Summary:** ${ conclusion.summary }
    
## 5. INFERRED INNOVATION
  - **Deep Analysis:** ${ inferredInnovation.deepAnalysis }
  `;

  return template;
};

export default assembleSummary;
