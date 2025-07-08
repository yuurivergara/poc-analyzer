'use client';

import React, { useState, useCallback } from 'react';
import { AnalyzerForm } from '@/components/AnalyzerForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { analyzeSomething } from '@/lib/analyzer';
import { InputData, AnalysisResult } from '@/types';

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

  const handleDataChange = useCallback((data: InputData) => {
    const analysis = analyzeSomething(data);
    setResult(analysis);
  }, []);

  const handleAnalyze = useCallback((data: InputData) => {
    const analysis = analyzeSomething(data);
    setResult(analysis);
    setSelectedResult(null);
    setHistory((h) => [...h, analysis]);
  }, []);
  

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-center text-3xl font-extrabold mb-10">
        🚀 POC Analyzer
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-4">
        <AnalyzerForm onAnalyze={handleAnalyze} onDataChange={handleDataChange} />

        <div className="flex flex-col gap-6">
          <ResultDisplay result={result} />
          <section className="bg-white p-4 rounded shadow max-h-96 overflow-auto">
            <h2 className="text-xl font-bold mb-2">Histórico de Testes</h2>
            {history.length === 0 ? (
              <p>Nenhum teste realizado ainda.</p>
            ) : (
              <ul className="divide-y divide-gray-300">
                {history.map((res, i) => (
                  <li key={i}>
                    <button
                      className={`text-left px-4 py-2 w-full hover:bg-gray-200 rounded ${
                        selectedResult === res ? 'bg-gray-300 font-semibold' : ''
                      }`}
                      onClick={() => setSelectedResult(res)}
                    >
                      Teste #{i + 1} — Score: {res.score} — Nível: {res.level}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {history.length > 1 && (
            <section className="bg-white p-4 rounded shadow overflow-auto">
              <h2 className="text-xl font-bold mb-4">Comparação Últimos Testes</h2>
              <div className="flex gap-4 overflow-x-auto">
                {history.slice(-3).map((res, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-4 rounded shadow w-64 flex-shrink-0"
                  >
                    <h3 className="font-semibold mb-1">
                      Teste #{history.length - 3 + i + 1}
                    </h3>
                    <p>Score: {res.score}</p>
                    <p
                      className={`font-bold ${
                        res.level === 'RED'
                          ? 'text-red-600'
                          : res.level === 'YELLOW'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      Nível: {res.level}
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2">
                      {res.factors.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
