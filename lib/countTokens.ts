import { get_encoding } from "@dqbd/tiktoken";

/**
 * Counts the number of tokens in a text or an array of texts.
 *
 * @param {string | string[]} texts - The text or an array of texts to count tokens in.
 * @returns {number} The number of tokens.
 */
const countTokens = (texts: string | string[]): number => {
  const encoding = get_encoding("cl100k_base");

  const calculateTokenCount = (text: string) => encoding.encode(text).length;

  const tokenCount = Array.isArray(texts)
    ? texts.reduce((total, text) => total + calculateTokenCount(text), 0)
    : calculateTokenCount(texts);

  encoding.free();

  return tokenCount;
};

export default countTokens;