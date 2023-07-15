/* eslint-disable max-len */

/**
* Extracts and organizes data from an array of summaries into an object.
* @param {string[]} rawSummaries - An array of summaries.
* @returns {object} - An object containing the extracted summary data.
*/
const extractSummaryData = (rawSummaries: string[]) => {
  const mainSectionRegex = /##\s\d+\.\s[A-Z\s]+/; // Matches text in this format: ## 1. AUDIENCE ANALYSIS

  return rawSummaries.reduce((accumulator, rawSummary) => {
    const lines = rawSummary.split("\n");

    const findIndex = (keyword: string) => lines.findIndex(line => line.includes(keyword));

    const findEndIndex = (keyword: string, nextKeywordIndex: number) => lines.findIndex((line, index) => index > findIndex(keyword) && (line.includes(lines[nextKeywordIndex]) || mainSectionRegex.test(line))) - 1;

    const indices = {
      intendedAudienceStart: findIndex("**Intended Audience:**"),
      mainTopicsStart: findIndex("**Main Topics:**"),
      criticalComponentsStart: findIndex("**Critical Components:**"),
      procedureBreakdownStart: findIndex("**Procedure Breakdown:**"),
      summaryStart: findIndex("**Summary:**"),
      deepAnalysisStart: findIndex("**Deep Analysis:**")
    };

    const endIndices = {
      intendedAudienceEnd: findEndIndex("**Intended Audience:**", indices.mainTopicsStart),
      mainTopicsEnd: findEndIndex("**Main Topics:**", indices.criticalComponentsStart),
      criticalComponentsEnd: findEndIndex("**Critical Components:**", indices.procedureBreakdownStart),
      procedureBreakdownEnd: findEndIndex("**Procedure Breakdown:**", indices.summaryStart),
      summaryEnd: findEndIndex("**Summary:**", indices.deepAnalysisStart),
      deepAnalysisEnd: lines.findIndex((line, index) => index > indices.deepAnalysisStart && (line.includes("**Deep Analysis:**") || index === lines.length - 1)) - 1
    };

    if (endIndices.deepAnalysisEnd === -2){
      endIndices.deepAnalysisEnd = lines.length - 1;
    }

    const extractSection = (start: number, end: number) => lines.slice(start, end + 1).join("\n");

    accumulator.audienceAnalysis.intendedAudience += `${extractSection(indices.intendedAudienceStart, endIndices.intendedAudienceEnd)}\n`;
    accumulator.contentAnalysis.mainTopics += `${extractSection(indices.mainTopicsStart, endIndices.mainTopicsEnd)}\n`;
    accumulator.contentAnalysis.criticalComponents += `${extractSection(indices.criticalComponentsStart, endIndices.criticalComponentsEnd)}\n`;
    accumulator.textDeconstruction.procedureBreakdown += `${extractSection(indices.procedureBreakdownStart, endIndices.procedureBreakdownEnd)}\n`;
    accumulator.conclusion.summary += `${extractSection(indices.summaryStart, endIndices.summaryEnd)}\n`;
    accumulator.inferredInnovation.deepAnalysis += `${extractSection(indices.deepAnalysisStart, endIndices.deepAnalysisEnd)}\n`;

    return accumulator;
  }, {
    audienceAnalysis: {
      intendedAudience: ""
    },
    contentAnalysis: {
      mainTopics: "",
      criticalComponents: ""
    },
    textDeconstruction: {
      procedureBreakdown: ""
    },
    conclusion: {
      summary: ""
    },
    inferredInnovation: {
      deepAnalysis: ""
    }
  });
};

export default extractSummaryData;
