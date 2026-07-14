import React from "react";
import PropTypes from "prop-types";

/**
 * Renders the last 5 translation operations.
 * Clicking a card restores the state, and clicking "Clear History" clears them.
 */
export const HistoryList = ({ history, onRestore, onClear, languages }) => {
  if (!history || history.length === 0) return null;

  const getLanguageName = (code) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? lang.name.split(" ")[0] : code.toUpperCase();
  };

  return (
    <div className="mt-8 space-y-4 w-full" data-testid="history-list">
      <div className="flex items-center justify-between border-b border-slate-700/30 pb-2">
        <h3 className="text-base md:text-lg font-bold text-white flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Translation History</span>
        </h3>
        <button
          onClick={onClear}
          className="text-xs font-bold text-indigo-300 hover:text-indigo-100 underline cursor-pointer transition-colors"
          aria-label="Clear translation history"
        >
          Clear History
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {history.map((item, index) => (
          <div
            key={index}
            onClick={() => onRestore(item)}
            className="p-4 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-700/30 hover:border-indigo-500/40 rounded-xl cursor-pointer transition-all duration-350 group shadow-md flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
              <span>
                {getLanguageName(item.sourceLang)} ➔ {getLanguageName(item.targetLang)}
              </span>
              <span className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity duration-200 flex items-center space-x-1">
                <span>Restore</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-200 font-medium truncate group-hover:text-white transition-colors">
                "{item.text}"
              </p>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {item.result}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

HistoryList.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      sourceLang: PropTypes.string.isRequired,
      targetLang: PropTypes.string.isRequired,
      result: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRestore: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
};
