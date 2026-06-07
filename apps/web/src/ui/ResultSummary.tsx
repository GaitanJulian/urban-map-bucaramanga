import React from "react";

interface ResultSummaryProps {
  totalItems: number;
  scopeLabel?: string;
}

export function ResultSummary({ totalItems, scopeLabel = "Bucaramanga" }: ResultSummaryProps) {
  return (
    <div className="result-summary">
      <h2 className="result-summary__count">{totalItems} eventos encontrados</h2>
      <p className="result-summary__scope">en {scopeLabel}</p>
    </div>
  );
}
