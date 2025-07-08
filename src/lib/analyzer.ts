import { InputData, AnalysisResult, FactorBreakdown } from '../types';

const factorNames = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'];
const factorDescriptions = [
  'Flag1 está ativo',
  'Texto maior que 4 caracteres',
  'Hora está no período noturno (0-5 ou >23)',
  'Email contém domínio temporário (@temp)',
  'Endereços são diferentes',
  'Contador maior que 5',
  'Data é recente (menos de 7 dias)',
];

export function analyzeSomething(data: InputData): AnalysisResult {
  const baseScore = data.val * 100;

  const isFlagActive = data.flag1 ? 1 : 0;
  const isTextLong = data.text.length > 4 ? 1 : 0;
  const isNightTime = (data.hour >= 23 || data.hour < 6) ? 1 : 0;
  const isTempEmail = data.email.includes('@temp') ? 1 : 0;
  const isAddressMismatch = data.addr1 !== data.addr2 ? 1 : 0;
  const isHighCount = data.count > 5 ? 1 : 0;
  const isRecentDate =
    (Date.now() - new Date(data.date).getTime()) / (1000 * 60 * 60 * 24) < 7
      ? 1
      : 0;

  const factorValues = [
    isFlagActive,
    isTextLong,
    isNightTime,
    isTempEmail,
    isAddressMismatch,
    isHighCount,
    isRecentDate,
  ];

  const factorWeights = [10, 8, 15, 12, 20, 9, 14];

  const totalScore =
    baseScore * 0.2 +
    factorValues.reduce(
      (acc, val, idx) => acc + val * factorWeights[idx],
      0
    );

  const score = Math.round(totalScore);

  const level = score > 60 ? 'RED' : score > 30 ? 'YELLOW' : 'GREEN';

  const factors = factorValues
    .map((v, i) => (v ? factorNames[i] : null))
    .filter(Boolean) as string[];

  const breakdown: FactorBreakdown[] = factorValues.map((active, i) => ({
    name: factorNames[i],
    active: Boolean(active),
    score: factorWeights[i] * (active ? 1 : 0),
    description: factorDescriptions[i],
  }));

  return {
    score,
    level,
    factors,
    breakdown,
  };
}
