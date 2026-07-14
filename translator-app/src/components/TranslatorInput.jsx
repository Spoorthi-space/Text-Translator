import React from "react";
import PropTypes from "prop-types";

/**
 * Textarea input component with character counter, warning color transitions, and a clear button.
 */
export const TranslatorInput = ({ value, onChange, placeholder, id }) => {
  const handleClear = () => {
    onChange("");
  };

  const isWarning = value.length >= 400;
  const isMax = value.length >= 500;

  return (
    <div className="relative flex flex-col space-y-2 w-full">
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={500}
          placeholder={placeholder}
          className={`w-full h-64 p-6 pb-12 bg-slate-900/50 backdrop-blur-md rounded-2xl border text-white text-base md:text-lg resize-none focus:outline-none focus:ring-2 shadow-inner leading-relaxed placeholder-indigo-200/40 transition-all duration-300 ${
            isMax
              ? "border-red-500/60 focus:ring-red-500 focus:border-red-500"
              : isWarning
              ? "border-amber-500/60 focus:ring-amber-500 focus:border-amber-500"
              : "border-slate-700/50 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-600/50"
          }`}
          aria-label="Source text to translate"
        />

        {value.length > 0 && (
          <button
            onClick={handleClear}
            className="absolute top-4 right-4 p-2 text-indigo-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 rounded-full transition-all duration-200 shadow-md border border-slate-700/30"
            aria-label="Clear input text"
            title="Clear text"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="absolute bottom-4 right-4 flex items-center space-x-1">
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded bg-slate-950/70 border backdrop-blur-md transition-all duration-300 ${
              isMax
                ? "text-red-400 font-bold border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                : isWarning
                ? "text-amber-400 font-bold border-amber-500/30"
                : "text-slate-400 border-slate-700/40"
            }`}
            aria-live="polite"
          >
            {value.length}/500
          </span>
        </div>
      </div>
    </div>
  );
};

TranslatorInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
};
