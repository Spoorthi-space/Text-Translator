import axios from "axios";

const API_URL = "https://api.mymemory.translated.net/get";

/**
 * Translates text via the MyMemory API.
 * @param {string} text - The text to translate.
 * @param {string} sourceLang - The source language code (e.g., 'en').
 * @param {string} targetLang - The target language code (e.g., 'hi').
 * @param {AbortSignal} [signal] - Optional AbortSignal for request cancellation.
 * @param {boolean} [isRetry=false] - Internal flag for retry logic.
 * @returns {Promise<string>} - The translated text.
 */
export const translateText = async (text, sourceLang, targetLang, signal, isRetry = false) => {
  const email = import.meta.env.VITE_MYMEMORY_EMAIL || "a@b.com";

  try {
    const response = await axios.get(API_URL, {
      params: {
        q: text,
        langpair: `${sourceLang}|${targetLang}`,
        mt: "1",
        de: email,
      },
      timeout: 6000, // 6 seconds timeout
      signal,
    });

    const data = response.data;
    const status = data?.responseStatus || response.status;
    const details = data?.responseDetails || "";

    // Check for MyMemory rate limit indicators
    if (
      status === 429 ||
      status === 403 ||
      status === 423 ||
      (details && (details.toLowerCase().includes("limit exceeded") || details.toLowerCase().includes("quota")))
    ) {
      throw new Error("rate-limit");
    }

    const translatedText = data?.responseData?.translatedText;
    
    // Check if the response matches MyMemory's invalid pair message
    if (
      (translatedText && (translatedText.toUpperCase().includes("IS NOT A VALID PAIR") || translatedText.toUpperCase().includes("INVALID LANGUAGE PAIR"))) || 
      (details && (details.toLowerCase().includes("is not a valid pair") || details.toLowerCase().includes("invalid language pair") || details.toLowerCase().includes("invalid langpair")))
    ) {
      throw new Error("invalid-pair");
    }

    if (!translatedText) {
      throw new Error("empty-response");
    }

    return translatedText;
  } catch (error) {
    // If it's aborted, let the caller handle it (or rethrow cleanly)
    if (axios.isCancel(error) || error.name === "CanceledError" || error.name === "AbortError") {
      throw error;
    }

    // Check custom errors we threw above
    if (error.message === "rate-limit") {
      throw new Error("MyMemory API rate limit exceeded. Please wait a minute or set a custom VITE_MYMEMORY_EMAIL.");
    }
    if (error.message === "empty-response") {
      throw new Error("Received an empty response from the translation server.");
    }
    if (error.message === "invalid-pair") {
      throw new Error(`The language pair ${sourceLang.toUpperCase()} ⇄ ${targetLang.toUpperCase()} is not supported by MyMemory.`);
    }

    // Try exactly one retry for network errors/timeouts
    if (!isRetry && (error.code === "ECONNABORTED" || !error.response)) {
      console.warn("Network issue encountered, retrying once...");
      // Wait 800ms before retry
      await new Promise((resolve) => setTimeout(resolve, 800));
      return translateText(text, sourceLang, targetLang, signal, true);
    }

    // Handle standard HTTP/Axios errors
    if (error.code === "ECONNABORTED") {
      throw new Error("Translation request timed out. Please check your connection stability.");
    }

    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        throw new Error("Too many requests. Please wait a few seconds before typing more.");
      }
      throw new Error(`Server error (${status}). Please try again later.`);
    }

    throw new Error("Network error. Please verify your internet connection.");
  }
};
