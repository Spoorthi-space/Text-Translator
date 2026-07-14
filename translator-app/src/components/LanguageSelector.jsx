import React from "react";
import PropTypes from "prop-types";

/**
 * Styled drop-down language selector with accessibility support.
 */
export const LanguageSelector = ({ value, onChange, languages, label, id, excludeCode }) => {
  const filteredLanguages = excludeCode
    ? languages.filter((lang) => lang.code !== excludeCode)
    : languages;

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label htmlFor={id} className="text-xs md:text-sm font-semibold text-indigo-200 tracking-wider uppercase">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-700/50 text-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-md transition-all appearance-none cursor-pointer hover:bg-slate-900/80"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a5b4fc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "1.2em",
            paddingRight: "2.5rem",
          }}
        >
          {filteredLanguages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

LanguageSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  excludeCode: PropTypes.string,
};
