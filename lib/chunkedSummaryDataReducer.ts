import { PROMPT_PRIMERS } from "@/constants";
import callGptConcatinatorApi from "./callGptConcatinatorApi";

 type ProcessedData = Record<string, any>;

/**
 * An asynchronous function that abstracts and summarises the input data.
 * The function is recursive in nature, processing nested objects within the data.
 * It passes values through the GPT summarizer API and returns a processed data object
 * with the same structure as the input.
 *
 * @async
 * @function abstractChuckedSummariesData
 * @param {ProcessedData} data - The data to be summarised.
 * @returns {Promise<ProcessedData>} - A promise that resolves with the summarised data.
 *
 * @example
 *
 * abstractChuckedSummariesData(data).then(summarisedData => {
 *    console.log(summarisedData);
 * });
 */
const chunkedSummaryDataReducer = async<T>(data: ProcessedData): Promise<T> => {
  /**
   * An inner asynchronous function that processes a key-value pair.
   * If the value is an object, it will recursively process its entries.
   * If the value is not an object, it will pass it through the GPT summarizer API.
   * In case of an error with the API call, the function will log the error and return null for the key.
   *
   * @async
   * @function processValue
   * @param {string} key - The key of the data entry to process.
   * @param {any} value - The value of the data entry to process.
   * @returns {Promise<[string, any]>} - A promise that resolves with a tuple of the key and processed value.
   *
   * @example
   *
   * processValue('myKey', 'myValue').then(([key, value]) => {
   *    console.log(key, value);
   * });
   */
  const processValue = async(key: string, value: any): Promise<[string, any]> => {
    if (typeof value === "object" && value !== null){
      const entries = Object.entries(value);
      const results = await Promise.all(entries.map(async([ nestedKey, nestedValue ]) => {
        return await processValue(nestedKey, nestedValue);
      }));

      return [ key, Object.fromEntries(results) ];
    }

    try {
      const responseData = await callGptConcatinatorApi(value, PROMPT_PRIMERS.concatenate);
      return [ key, responseData ];
    } catch (error){
      console.error(`Error sending data for key "${key}":`, error);
      return [ key, null ];
    }
  };

  const processedData = Object.fromEntries(await Promise.all(Object.entries(data).map(async([ key, value ]) => {
    return await processValue(key, value);
  })));

  return processedData as T;
};

export default chunkedSummaryDataReducer;