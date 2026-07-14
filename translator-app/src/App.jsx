import React from "react";
import { useTranslate } from "./hooks/useTranslate";
import { LanguageSelector } from "./components/LanguageSelector";
import { TranslatorInput } from "./components/TranslatorInput";
import { TranslatorOutput } from "./components/TranslatorOutput";
import { HistoryList } from "./components/HistoryList";
import { LANGUAGES } from "./constants/languages";

/**
 * Main application component layout.
 * Combines all translator views under a dark mode glassmorphism theme.
 */
function App() {
  const {
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
  } = useTranslate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans select-none">
      {/* Gradient Ambient Lighting (Mesh Design) */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-indigo-600/10 blur-[100px] md:blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-purple-600/10 blur-[100px] md:blur-[150px] pointer-events-none"></div>

      {/* Main Workspace Frame */}
      <div className="relative z-10 w-full max-w-5xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-indigo-100 to-purple-300 drop-shadow-sm">
          TransVerse
        </h1>
        <p className="text-center text-indigo-200/50 mb-10 text-xs md:text-base font-medium tracking-wider max-w-md mx-auto">
          Experience real-time, context-aware translations powered by debounced live queries and intelligent caching.
        </p>

        {/* Central Translation Console Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-800/80 shadow-2xl shadow-slate-950/50">
          
          {/* Header Controls (Language Selectors & Swap) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <LanguageSelector
              id="source-lang-select"
              label="Source Language"
              value={sourceLang}
              onChange={setSourceLang}
              languages={LANGUAGES}
            />

            {/* Swap Button with 180deg Rotation on hover */}
            <button
              onClick={swapLanguages}
              className="mt-6 sm:mt-5 p-3 rounded-full bg-slate-800/80 border border-slate-700/50 text-indigo-300 hover:text-white hover:bg-slate-700 hover:border-indigo-500/30 transition-all duration-300 transform hover:rotate-180 active:scale-95 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Swap source and target languages"
              title="Swap Languages"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <LanguageSelector
              id="target-lang-select"
              label="Target Language"
              value={targetLang}
              onChange={setTargetLang}
              languages={LANGUAGES}
            />
          </div>

          {/* Text Areas (Input and Output Grid) */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Input Section */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="translation-input" className="text-xs font-semibold text-indigo-300/30 uppercase tracking-widest pl-1">
                Input Text
              </label>
              <TranslatorInput
                id="translation-input"
                value={inputText}
                onChange={setInputText}
                placeholder="Type or paste text here to translate in real-time..."
              />
            </div>

            {/* Output Section */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-semibold text-indigo-300/30 uppercase tracking-widest">
                  Translation
                </label>
                {/* Manual Force Translation Action */}
                {inputText.trim() && (
                  <button
                    onClick={triggerTranslation}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold tracking-wider hover:underline transition-all cursor-pointer"
                    title="Force immediate translation bypassing the debounce delay"
                  >
                    Force Translate
                  </button>
                )}
              </div>
              <TranslatorOutput
                translatedText={translatedText}
                loading={loading}
                error={error}
                targetLang={targetLang}
                onRetry={triggerTranslation}
              />
            </div>
          </div>

          {/* History Widget */}
          <HistoryList
            history={history}
            onRestore={restoreTranslation}
            onClear={clearHistory}
            languages={LANGUAGES}
          />
        </div>
      </div>
    </div>
  );
}

export default App;