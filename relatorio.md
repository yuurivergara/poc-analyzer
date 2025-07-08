# Engenharia Reversa - Relatório

## Hipótese sobre o Propósito
A função `mysteryFunction` calcula uma espécie de **score de risco ou alerta** baseado em dados de entrada diversos, como valor numérico, flags booleanas, hora do dia, presença de email temporário, diferenças de endereço, contagem de eventos e recência da data. O resultado classifica o risco em três níveis: GREEN (baixo), YELLOW (médio) e RED (alto), provavelmente para sinalizar situações suspeitas ou críticas.

## Decodificação das Variáveis

- **w1 (val * 100):** Base quantitativa da pontuação, multiplicada por 100 para dar peso significativo ao valor.
- **w2 (flag1):** Indicador booleano simples ativando um fator (10 pontos se ativo).
- **w3 (text.length > 4):** Texto "longo" (mais que 4 caracteres) adiciona peso, possivelmente indicando complexidade ou conteúdo significativo.
- **w4 (hour > 23 || hour < 6):** Horário noturno — período de risco ou atenção especial (15 pontos).
- **w5 (email inclui '@temp'):** Email temporário, que pode indicar conta de baixo histórico ou suspeita (12 pontos).
- **w6 (addr1 !== addr2):** Endereços diferentes — possível indicador de inconsistência ou múltiplas localizações (20 pontos).
- **w7 (count > 5):** Contador alto, sugerindo atividade intensa ou anômala (9 pontos).
- **w8 (data recente < 7 dias):** Data muito recente, indicando evento ou ação recente (14 pontos).

## Lógica do Scoring

Cada fator binário (exceto o `val`) soma um valor fixo ao score final, ponderado para refletir sua importância relativa. A base do score vem de `val * 100` multiplicado por 0.2, dando um peso menor ao valor numérico que aos fatores binários.

O score final é arredondado para inteiro e classificado em níveis:

- Score > 60 → RED (risco alto)
- 30 < Score ≤ 60 → YELLOW (risco médio)
- Score ≤ 30 → GREEN (baixo risco)

## Processo de Investigação

- Identifiquei o peso de cada variável lendo as operações de multiplicação.
- Relacionei cada fator ao seu significado plausível (ex: horário noturno como potencial risco).
- Testei valores e datas para ver como eles influenciavam o score e os níveis.
- Mapeei os fatores ativados em `factors` para entender o que contribui para o resultado.
- Organizei tudo em interfaces e código mais legível para melhor documentação e uso futuro.

### 2. **Código Refatorado**
```typescript
export interface InputData {
  val: number;               // Valor base da operação
  flag1: boolean;            // Flag de ativação (booleano)
  text: string;              // Texto a ser avaliado
  hour: number;              // Hora da ação (0–23)
  email: string;             // Email do usuário
  addr1: string;             // Endereço principal
  addr2: string;             // Endereço secundário
  count: number;             // Número de eventos
  date: string;              // Data no formato YYYY-MM-DD
}

export interface FactorBreakdown {
  name: string;              // Código do fator (ex: F1)
  score: number;             // Pontuação associada ao fator
  active: boolean;           // Se o fator está ativo ou não
  description: string;       // Descrição do fator
}

export interface AnalysisResult {
  score: number;             // Score final arredondado
  level: 'GREEN' | 'YELLOW' | 'RED'; // Classificação de risco
  factors: string[];         // Lista dos fatores ativos (ex: ['F1', 'F3'])
  breakdown: FactorBreakdown[]; // Detalhes do score por fator
}

export function analyzeSomething(data: InputData): AnalysisResult {
  // Calcula o score base multiplicando o valor por 100
  const baseScore = data.val * 100;

  // Define os fatores binários (0 ou 1) baseados nas condições
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

  // Array com os valores binários dos fatores
  const factorValues = [
    isFlagActive,
    isTextLong,
    isNightTime,
    isTempEmail,
    isAddressMismatch,
    isHighCount,
    isRecentDate,
  ];

  // Pesos atribuídos a cada fator
  const factorWeights = [10, 8, 15, 12, 20, 9, 14];

  // Calcula o score total somando o baseScore ponderado e os fatores ativos ponderados
  const totalScore =
    baseScore * 0.2 +
    factorValues.reduce(
      (acc, val, idx) => acc + val * factorWeights[idx],
      0
    );

  // Arredonda o score total
  const score = Math.round(totalScore);

  // Define o nível de risco com base no score
  const level = score > 60 ? 'RED' : score > 30 ? 'YELLOW' : 'GREEN';

  // Lista dos fatores ativos identificados pelo código (ex: 'F1')
  const factors = factorValues
    .map((v, i) => (v ? factorNames[i] : null))
    .filter(Boolean) as string[];

  // Cria o breakdown detalhado do score para cada fator
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
```

### 3. **Demo Funcional**
https://poc-analyzer-one.vercel.app/