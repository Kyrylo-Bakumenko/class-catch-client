// components/Filters.jsx
"use client";
import { useState } from "react";

// Terms
const ALL_TERMS = [
  { label: "Winter Term 2025 (202501)", value: "202501" },
  { label: "Fall Term 2024 (202409)", value: "202409" },
  { label: "Summer Term 2024 (202406)", value: "202406" },
  { label: "Spring Term 2024 (202403)", value: "202403" },
];

// Distributive Requirements
const ALL_DISTRIBS = [
  { label: "ART", value: "ART" },
  { label: "LIT", value: "LIT" },
  { label: "TMV", value: "TMV" },
  { label: "INT", value: "INT" },
  { label: "SOC", value: "SOC" },
  { label: "QDS", value: "QDS" },
  { label: "SCI", value: "SCI" },
  { label: "SLA", value: "SLA" },
  { label: "TAS", value: "TAS" },
  { label: "TLA", value: "TLA" },
];

// World Culture Requirements
const ALL_WCULTURES = [
  { label: "W (Western Cultures)", value: "W" },
  { label: "NW (Non-Western Cultures)", value: "NW" },
  { label: "CI (Culture & Identity)", value: "CI" },
];

// Language Requirements (if you want them separate)
const ALL_LANGREQS = [
  { label: "Advanced Language (LADV)", value: "LADV" },
  { label: "Accelerated Language (LACC)", value: "LACC" },
  { label: "Language Proficiency (LRP)", value: "LRP" },
];

// Periods
const ALL_PERIODS = [
  "8", "9", "9L", "9S", "10", "10+", "10A", "11", "11+", "12",
  "2", "2A", "3A", "3B", "6A", "6B", "ARR", "FS", "LS", "OT",
];

/**
 * onTermChange       => function(arrayOfTermCodes)
 * onDistribChange    => function(arrayOfDistribCodes)
 * onWorldCultureChange => function(arrayOfWCultureCodes)
 * onLanguageReqChange => function(arrayOfLangCodes)
 * onPeriodChange    => function(arrayOfPeriodCodes)
 */
export default function Filters({
  onTermChange,
  onDistribChange,
  onWorldCultureChange,
  onLanguageReqChange,
  onPeriodChange,
}) {
  // Local state for each filter category
  const [selectedTerms, setSelectedTerms] = useState([]);
  const [selectedDistribs, setSelectedDistribs] = useState([]);
  const [selectedWorldCultures, setSelectedWorldCultures] = useState([]);
  const [selectedLangReqs, setSelectedLangReqs] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);

  // Collapsible toggles
  const [termOpen, setTermOpen] = useState(true);
  const [distribOpen, setDistribOpen] = useState(true);
  const [wcOpen, setWcOpen] = useState(true);
  const [langOpen, setLangOpen] = useState(true);
  const [periodOpen, setPeriodOpen] = useState(true);

  // Handler for Terms
  const handleToggleTerm = (value) => {
    let newSelected = selectedTerms.includes(value)
      ? selectedTerms.filter((t) => t !== value)
      : [...selectedTerms, value];
    setSelectedTerms(newSelected);
    onTermChange?.(newSelected);
  };

  // Handler for Distributions
  const handleToggleDistrib = (value) => {
    let newSelected = selectedDistribs.includes(value)
      ? selectedDistribs.filter((d) => d !== value)
      : [...selectedDistribs, value];
    setSelectedDistribs(newSelected);
    onDistribChange?.(newSelected);
  };

  // Handler for World Cultures
  const handleToggleWorldCulture = (value) => {
    let newSelected = selectedWorldCultures.includes(value)
      ? selectedWorldCultures.filter((c) => c !== value)
      : [...selectedWorldCultures, value];
    setSelectedWorldCultures(newSelected);
    onWorldCultureChange?.(newSelected);
  };

  // Handler for Language Reqs
  const handleToggleLangReq = (value) => {
    let newSelected = selectedLangReqs.includes(value)
      ? selectedLangReqs.filter((l) => l !== value)
      : [...selectedLangReqs, value];
    setSelectedLangReqs(newSelected);
    onLanguageReqChange?.(newSelected);
  };

  // Handler for Periods
  const handleTogglePeriod = (value) => {
    let newSelected = selectedPeriods.includes(value)
      ? selectedPeriods.filter((p) => p !== value)
      : [...selectedPeriods, value];
    setSelectedPeriods(newSelected);
    onPeriodChange?.(newSelected);
  };

  return (
    <div className="relative h-full overflow-y-auto border-r border-gray-200 p-4 space-y-4">
      {/* Terms */}
      <section>
        <button
          onClick={() => setTermOpen(!termOpen)}
          className="w-full text-left font-semibold border-b border-gray-200 pb-1 mb-2"
        >
          Terms {termOpen ? "▾" : "▸"}
        </button>
        {termOpen && (
          <div className="pl-2">
            {ALL_TERMS.map((term) => (
              <label key={term.value} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedTerms.includes(term.value)}
                  onChange={() => handleToggleTerm(term.value)}
                />
                <span className="ml-2">{term.label}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* Distributive Requirements */}
      <section>
        <button
          onClick={() => setDistribOpen(!distribOpen)}
          className="w-full text-left font-semibold border-b border-gray-200 pb-1 mb-2"
        >
          Distributions {distribOpen ? "▾" : "▸"}
        </button>
        {distribOpen && (
          <div className="pl-2">
            {ALL_DISTRIBS.map((dist) => (
              <label key={dist.value} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedDistribs.includes(dist.value)}
                  onChange={() => handleToggleDistrib(dist.value)}
                />
                <span className="ml-2">{dist.label}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* World Cultures */}
      <section>
        <button
          onClick={() => setWcOpen(!wcOpen)}
          className="w-full text-left font-semibold border-b border-gray-200 pb-1 mb-2"
        >
          World Cultures {wcOpen ? "▾" : "▸"}
        </button>
        {wcOpen && (
          <div className="pl-2">
            {ALL_WCULTURES.map((wc) => (
              <label key={wc.value} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedWorldCultures.includes(wc.value)}
                  onChange={() => handleToggleWorldCulture(wc.value)}
                />
                <span className="ml-2">{wc.label}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* Language Requirements */}
      <section>
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="w-full text-left font-semibold border-b border-gray-200 pb-1 mb-2"
        >
          Language Reqs {langOpen ? "▾" : "▸"}
        </button>
        {langOpen && (
          <div className="pl-2">
            {ALL_LANGREQS.map((lang) => (
              <label key={lang.value} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedLangReqs.includes(lang.value)}
                  onChange={() => handleToggleLangReq(lang.value)}
                />
                <span className="ml-2">{lang.label}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* Periods */}
      <section>
        <button
          onClick={() => setPeriodOpen(!periodOpen)}
          className="w-full text-left font-semibold border-b border-gray-200 pb-1 mb-2"
        >
          Periods {periodOpen ? "▾" : "▸"}
        </button>
        {periodOpen && (
          <div className="pl-2">
            {ALL_PERIODS.map((p) => (
              <label key={p} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedPeriods.includes(p)}
                  onChange={() => handleTogglePeriod(p)}
                />
                <span className="ml-2">{p}</span>
              </label>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
