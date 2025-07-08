import React, { useState } from 'react';

type FactorBarProps = {
  label: string;
  value: number;
  max: number;
  description?: string;
};

export function FactorBar({ label, value, max, description }: FactorBarProps) {
  const [hover, setHover] = useState(false);
  const widthPercent = Math.min((value / max) * 100, 100);

  return (
    <div
      className="mb-1 relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex justify-between text-sm mb-0.5 cursor-help">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-4">
        <div
          className="bg-blue-600 h-4 rounded"
          style={{ width: `${widthPercent}%` }}
        ></div>
      </div>

      {hover && description && (
        <div className="absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 mt-1 left-0 shadow-lg w-max max-w-xs">
          {description}
        </div>
      )}
    </div>
  );
}
