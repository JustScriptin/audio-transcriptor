import { USER_PROMPTS, SYSTEM_PROMPTS, PROMPT_PRIMERS, MODEL } from "@/constants";
import fetch from "node-fetch";

type PromptPrimerValues = typeof PROMPT_PRIMERS[keyof typeof PROMPT_PRIMERS];

/**
 * This function interacts with OpenAI's GPT API to create a summary of a provided text.
 * It first sets up the necessary information for the API call, including the URL, headers,
 * and the sequence of messages for the conversation model to process.
 * It then makes a POST request to the API and parses the response to get the summarized text.
 *
 * @async
 * @function callGptSummarizerApi
 * @param {string} userInput - The text that the user wants to summarize. This could be a
 * paragraph, an article, or any other form of text.
 * @param {PromptPrimerValues} summaryPrimer - The summary primer value to guide the AI model
 * in generating the summary. It is part of the message sequence that will be processed by the model.
 * The promise could reject if there is an error with the API call, so be sure to handle potential rejections.
 * @throws Will throw an error if the API call fails
 * @example
 * async function getSummary() {
 *   try {
 *     const summary = await callGptSummarizerApi("Once upon a time...", PROMPT_PRIMERS.summarize);
 *     console.log(summary); // logs the summarized text
 *   } catch (error) {
 *     console.error(error); // logs any error that occurred during the API call
 *   }
 * }
 * getSummary();
 */
const callGptSummarizerApi = async(userInput: string, summaryPrimer: PromptPrimerValues): Promise<string> => {
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_APIKEY}`
  };

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPTS.summarize
    },
    {
      role: "user",
      content: USER_PROMPTS.summarize
    },
    {
      role: "user",
      content: `${summaryPrimer}} ${userInput}`
    }
  ];

  const payload = JSON.stringify({
    model: MODEL.name,
    messages
  });

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: payload
  });
  const data = await response.json() as Record<any, any>;
  const summary: string = data.choices[0].message.content;
  return summary;
};

export default callGptSummarizerApi;