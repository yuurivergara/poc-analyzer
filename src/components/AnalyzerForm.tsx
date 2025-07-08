'use client';

import React, { useEffect, useState } from 'react';
import { InputData } from '@/types';

const defaultData: InputData = {
  val: 2.5,
  flag1: true,
  text: 'short',
  hour: 3,
  email: 'user@temp.com',
  addr1: 'Street A',
  addr2: 'Street B',
  count: 8,
  date: '2025-07-05',
};

const testCases: { [key: string]: InputData } = {
  CaseGreen: {
    val: 1.0,                  
    flag1: false,              
    text: 'ok',                
    hour: 12,                  
    email: 'user@normal.com',  
    addr1: 'Rua A',
    addr2: 'Rua A',            
    count: 3,                  
    date: '2024-06-01',
  },
  CaseYellow: {
    val: 1.5,                 
    flag1: false,             
    text: 'suspeito',         
    hour: 14,                 
    email: 'x@normal.com',    
    addr1: 'Rua A',
    addr2: 'Rua B',           
    count: 2,                 
    date: '2025-07-01',  
  },
  CaseRed: {
    val: 0.8,                     
    flag1: true,                 
    text: 'alerta crítico!',     
    hour: 1,                     
    email: 'user@temp.io',       
    addr1: 'Rua A',
    addr2: 'Rua B',              
    count: 8,                   
    date: '2025-07-07', 
  },
};


export function AnalyzerForm({
  onAnalyze,
  onDataChange
}: {
  onAnalyze: (data: InputData) => void;
  onDataChange?: (data: InputData) => void;
}) {
  const [formData, setFormData] = useState<InputData>(defaultData);

  useEffect(() => {
  if (onDataChange) {
    onDataChange(formData);
  }
}, [formData]);

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const target = e.target;
  let newFormData: InputData;

  if (target instanceof HTMLInputElement) {
    const { name, type, value, checked } = target;
    newFormData = {
      ...formData,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? Number(value)
          : value,
    };
  } else if (target instanceof HTMLTextAreaElement) {
    const { name, value } = target;
    newFormData = {
      ...formData,
      [name]: value,
    };
  } else {
    return;
  }

  setFormData(newFormData);

  if (onDataChange) {
    onDataChange(newFormData);
  }
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const loadTestCase = (key: string) => {
  const newData = testCases[key];
  setFormData(newData);
  if (onDataChange) {
    onDataChange(newData);
  }
};

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">TESTADOR DE ALGORITMO</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">💰 Valor:</label>
          <input
            type="number"
            step="0.1"
            name="val"
            value={formData.val}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold flex items-center gap-2">
            🔘 Flag1:
            <input
              type="checkbox"
              name="flag1"
              checked={formData.flag1}
              onChange={handleChange}
            />
            Ativo
          </label>
        </div>

        <div>
          <label className="block font-semibold">📝 Texto:</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            rows={2}
          />
        </div>

        <div>
          <label className="block font-semibold">🕐 Hora (0-23):</label>
          <input
            type="number"
            name="hour"
            min={0}
            max={23}
            value={formData.hour}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">📧 Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">🏠 Endereço 1:</label>
          <input
            type="text"
            name="addr1"
            value={formData.addr1}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">🏠 Endereço 2:</label>
          <input
            type="text"
            name="addr2"
            value={formData.addr2}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">🔢 Contador:</label>
          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">📅 Data:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 w-full hover:bg-blue-700"
        >
          🔍 ANALISAR
        </button>
      </form>

      <div className="mt-6 flex gap-2 flex-wrap">
        {Object.keys(testCases).map((key) => (
          <button
            key={key}
            onClick={() => loadTestCase(key)}
            className="bg-gray-300 rounded px-3 py-1 hover:bg-gray-400"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
