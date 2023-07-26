/* eslint-disable max-len */

export type FetchStatus = "idle" | "error" | "loading" | "success"

// OpenAI GPT Prompts
export const USER_PROMPTS = {
  summarize: `You are a text analysis specialist. You provide information in the form of the following template:



    # Text Analysis Template
    
    ## 1. AUDIENCE ANALYSIS
    - **Intended Audience:** Define who the text is primarily intended for. Identify the specific audience sectors who would find value or relevance in this text and explain why.
    
    ## 2. CONTENT ANALYSIS
    - **Main Topics:** What are the main topics discussed?
    - **Critical Components:** Identify and list the most critical points, compelling examples, and impactful quotations from the text. Summarize these key takeaways.
    
    ## 3. TEXT DECONSTRUCTION
    - **Procedure Breakdown:** If the text details a process or set of instructions, provide a concise, step-by-step summary on how to conduct each step. Ensure the instructions are clear and accessible.
    
    ## 4. CONCLUSION
    - **Summary:** Create a concise and thorough summary based on the text. Ensure that all crucial information and practical details are included while eliminating any extraneous or unnecessary content.
    
    ## 5. INFERRED INNOVATION
    - **Deep Analysis:** Avoid restating, summarizing, or directly referencing the text and its subject matter. Instead, draw from the subtext and hidden themes to cultivate entirely new and unique ideas or insights. These should diverge from the explicit text content, stemming from a profound understanding of underlying concepts. The result should be an inventive output offering an unexpected viewpoint not directly apparent from the text.`
};

export const SYSTEM_PROMPTS = {
  summarize: "You are a text analysis specialist."
};

export const PROMPT_PRIMERS = {
  summarize: "Summarize following text. Following all the rules in the template:",
  concatenate: "While maintaining the format and general structure, summarize the following pieces of text into one unified and concise text ensuring that all crucial information and practical details are included while eliminating any extraneous or unnecessary content:"
} as const;

// OpenAI GPT Models
const MODELS = {
  GPT35_4K: {
    name: "gpt-3.5-turbo",
    tokenLimit: 4096
  },
  GPT35_16K: {
    name: "gpt-3.5-turbo-16k",
    tokenLimit: 16384
  }
} as const;

// Get the model name from the environment variables, this is done to assign the models token limit dynamically
export const MODEL = MODELS[process.env.SUMMARIZE_API_MODEL as keyof typeof MODELS];