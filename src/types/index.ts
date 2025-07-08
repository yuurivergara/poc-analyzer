export interface InputData {
  val: number;
  flag1: boolean;
  text: string;
  hour: number;
  email: string;
  addr1: string;
  addr2: string;
  count: number;
  date: string;
}

export interface FactorBreakdown {
  name: string;
  score: number;
  active: boolean;
  description: string;
}

export interface AnalysisResult {
  score: number;
  level: 'GREEN' | 'YELLOW' | 'RED';
  factors: string[];
  breakdown: FactorBreakdown[];
}
