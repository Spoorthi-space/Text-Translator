import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Helper to map 2-letter language codes to Web Speech BCP 47 locale codes
const getSpeechLocale = (langCode) => {
  const map = {
    en: "en-US",
    hi: "hi-IN",
    kn: "kn-IN",
    te: "te-IN",
    ta: "ta-IN",
    ml: "ml-IN",
    bn: "bn-IN",
    gu: "gu-IN",
    mr: "mr-IN",
    pa: "pa-IN",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    pt: "pt-PT",
    ru: "ru-RU",
    zh: "zh-CN",
    ja: "ja-JP",
    ko: "ko-KR",
    ar: "ar-SA",
    tr: "tr-TR",
  };
  return map[langCode] || "en-US";
};

/**
 * Output displaying panel showing translation results, error alerts, loading skeletons, copy, and TTS features.
 */
export const TranslatorOutput = ({ translatedText, loading, error, targetLang, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Stop speaking on unmount or when text changes
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [translatedText]);

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSpeak = () => {
    if (!translatedText || typeof window === "undefined" || !window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    const localeCode = getSpeechLocale(targetLang);
    
    // Find matching voices in the browser dynamically
    if (window.speechSynthesis.getVoices) {
      const voices = window.speechSynthesis.getVoices();
      
      // 1. Try to find exact locale match (e.g. es-ES, hi-IN)
      let voice = voices.find((v) => v.lang.toLowerCase() === localeCode.toLowerCase());
      
      // 2. Try to find general language match (e.g. starting with "es", "hi")
      if (!voice) {
        voice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLang.toLowerCase()));
      }
      
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = localeCode;
      }
    } else {
      utterance.lang = localeCode;
    }
    
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className="flex flex-col h-64 p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 justify-between shadow-lg relative"
      aria-live="polite"
      aria-busy={loading}
    >
      {/* Content Area */}
      <div className="overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {loading ? (
          // Loading Skeleton
          <div className="space-y-4 animate-pulse mt-1" data-testid="loading-skeleton">
            <div className="h-4 bg-slate-700/60 rounded-md w-3/4"></div>
            <div className="h-4 bg-slate-700/60 rounded-md w-5/6"></div>
            <div className="h-4 bg-slate-700/60 rounded-md w-1/2"></div>
          </div>
        ) : error ? (
          // Custom error message display
          <div className="flex items-start space-x-3 text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex flex-col space-y-2">
              <p className="text-sm md:text-base font-medium">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline text-left cursor-pointer transition-colors"
                >
                  Retry Translation
                </button>
              )}
            </div>
          </div>
        ) : translatedText ? (
          // Translated Text
          <p className="text-white text-base md:text-lg leading-relaxed select-text" data-testid="translated-output">
            {translatedText}
          </p>
        ) : (
          // Empty State Placeholder
          <p className="text-indigo-200/40 text-base md:text-lg select-none">
            Your translation will appear here...
          </p>
        )}
      </div>

      {/* Control Footer */}
      {!loading && !error && translatedText && (
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-2">
          <div className="flex items-center space-x-2">
            {/* TTS Button */}
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl transition-all duration-200 border cursor-pointer ${
                speaking
                  ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300 shadow-md"
                  : "bg-slate-800/50 border-slate-700/50 text-indigo-300 hover:bg-slate-700/80 hover:text-white"
              }`}
              aria-label={speaking ? "Stop voice playback" : "Listen to translated text"}
              title={speaking ? "Stop" : "Listen"}
            >
              {speaking ? (
                // Speaker active/stop icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 animate-pulse"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Speaker icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`p-2 rounded-xl transition-all duration-200 border cursor-pointer flex items-center space-x-1.5 ${
                copied
                  ? "bg-emerald-600/30 border-emerald-500/50 text-emerald-400"
                  : "bg-slate-800/50 border-slate-700/50 text-indigo-300 hover:bg-slate-700/80 hover:text-white"
              }`}
              aria-label={copied ? "Text copied to clipboard" : "Copy translation to clipboard"}
              title="Copy translation"
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-semibold pr-1">Copied!</span>
                </>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </button>
          </div>
          <span className="text-xs font-medium text-indigo-300/40">
            Powered by MyMemory
          </span>
        </div>
      )}
    </div>
  );
};

TranslatorOutput.propTypes = {
  translatedText: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  targetLang: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};
