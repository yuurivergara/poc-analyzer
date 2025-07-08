'use client';

import React from 'react';
import { AnalysisResult } from '@/types';
import { FactorBar } from './FactorBar';

type ResultDisplayProps = {
  result: AnalysisResult | null;
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) return null;

  const colorMap = {
    RED: 'text-red-600',
    YELLOW: 'text-yellow-600',
    GREEN: 'text-green-600',
  };

  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <h2 className="text-xl font-bold mb-2">🎯 SCORE FINAL: {result.score}</h2>
      <p className={`text-lg font-semibold mb-4 ${colorMap[result.level]}`}>
        🔴 NÍVEL: {result.level}
      </p>

      <h3 className="font-bold mb-2">📊 BREAKDOWN DOS FATORES:</h3>
      <div>
        {result.breakdown.map((item, index) => (
          <FactorBar
            key={index}
            label={item.name}
            value={item.score}
            max={100}
            />

        ))}
      </div>

      <p className="mt-4">🚩 Fatores detectados: {result.factors.join(', ')}</p>

      <div className="mt-6 flex gap-4">
        <button
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => window.location.reload()}
        >
          🔄 Testar novamente
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
        >
          📋 Copiar dados
        </button>
      </div>
    </div>
  );
}
