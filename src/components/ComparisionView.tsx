import React from 'react';
import { AnalysisResult } from '@/types';

export function ComparisonView({ history }: { history: AnalysisResult[] }) {
  if (history.length < 2) {
    return <p className="text-gray-500">Faça pelo menos 2 análises para comparar.</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto mt-6">
      {history.slice(-3).map((result, i) => (
        <div key={i} className="bg-white p-4 rounded shadow w-64 flex-shrink-0">
          <h3 className="font-bold mb-2 text-center">Teste #{history.length - (history.length - i)}</h3>
          <p className="text-lg font-semibold mb-2">Score: {result.score}</p>
          <p className={`mb-2 ${
            result.level === 'RED' ? 'text-red-600' : result.level === 'YELLOW' ? 'text-yellow-600' : 'text-green-600'
          }`}>Nível: {result.level}</p>
          <ul className="text-sm list-disc list-inside">
            {result.factors.map((factor, idx) => (
              <li key={idx}>{factor}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
