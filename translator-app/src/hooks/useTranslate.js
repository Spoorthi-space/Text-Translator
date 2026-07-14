import { useState, useEffect, useRef } from "react";
import { translateText } from "../api/translate";

/**
 * Custom React hook for translator state and logic.
 * Handles debouncing, request caching, history management, and language swapping.
 */
export const useTranslate = (initialInput = "", initialSource = "en", initialTarget = "hi") => {
  const [inputText, setInputText] = useState(initialInput);
  const [sourceLang, setSourceLang] = useState(initialSource);
  const [targetLang, setTargetLang] = useState(initialTarget);
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // History state: initialize from localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("translation_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cache in-memory structure using a ref to prevent unnecessary re-renders
  const cache = useRef(new Map());

  // Debouncing effect for real-time translation
  useEffect(() => {
    const trimmedInput = inputText.trim();

    if (!trimmedInput) {
      setTranslatedText("");
      setError(null);
      setLoading(false);
      return;
    }

    // If source language and target language are the same, skip API and copy text directly
    if (sourceLang === targetLang) {
      setTranslatedText(inputText);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    // Check Cache first
    const cacheKey = `${sourceLang}|${targetLang}|${trimmedInput}`;
    if (cache.current.has(cacheKey)) {
      setTranslatedText(cache.current.get(cacheKey));
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await translateText(trimmedInput, sourceLang, targetLang, signal);
        
        // Cache the translation
        cache.current.set(cacheKey, result);
        setTranslatedText(result);
        setError(null);

        // Add item to history
        setHistory((prev) => {
          const filtered = prev.filter(
            (item) =>
              !(
                item.text.toLowerCase() === trimmedInput.toLowerCase() &&
                item.sourceLang === sourceLang &&
                item.targetLang === targetLang
              )
          );
          const updated = [
            { text: trimmedInput, sourceLang, targetLang, result },
            ...filtered,
          ].slice(0, 5);
          localStorage.setItem("translation_history", JSON.stringify(updated));
          return updated;
        });
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          // Request was aborted by user typing or layout change, do not update UI
          return;
        }
        setError(err.message || "Translation failed.");
        setTranslatedText("");
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }, 500); // 500ms debounce interval

    // Cleanup logic: clear the timeout and cancel the API call
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [inputText, sourceLang, targetLang]);

  // Manual translation trigger for retry button or immediate translation
  const triggerTranslation = async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;

    setLoading(true);
    setError(null);

    try {
      const result = await translateText(trimmedInput, sourceLang, targetLang);
      const cacheKey = `${sourceLang}|${targetLang}|${trimmedInput}`;
      
      // Update Cache and Output
      cache.current.set(cacheKey, result);
      setTranslatedText(result);
      setError(null);

      // Add to History
      setHistory((prev) => {
        const filtered = prev.filter(
          (item) =>
            !(
              item.text.toLowerCase() === trimmedInput.toLowerCase() &&
              item.sourceLang === sourceLang &&
              item.targetLang === targetLang
            )
        );
        const updated = [
          { text: trimmedInput, sourceLang, targetLang, result },
          ...filtered,
        ].slice(0, 5);
        localStorage.setItem("translation_history", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError(err.message || "Translation failed.");
      setTranslatedText("");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("translation_history");
  };

  const restoreTranslation = (item) => {
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setInputText(item.text);
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    if (translatedText) {
      setInputText(translatedText);
    }
  };

  return {
    inputText,
    setInputText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    translatedText,
    loading,
    error,
    history,
    triggerTranslation,
    clearHistory,
    restoreTranslation,
    swapLanguages,
  };
};
