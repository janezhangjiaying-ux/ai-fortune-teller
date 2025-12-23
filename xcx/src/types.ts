export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNKNOWN = 'UNKNOWN'
}

export interface UserProfile {
  constellation: string;
  birthDate: string; // YYYY-MM-DD
  birthYM?: string;  // YYYY-MM (Optional, for month-only selectors)
  mbti: string;
  province?: string;
  city?: string;
}

export interface VIPRecommendations {
  crystal: {
    variety: string;
    outfitTips: string;
  };
  homeTreasure: {
    item: string;
    benefit: string;
    placement: string;
  };
  pitfallGuide: string; // 当日避坑指南
  weatherContext?: {
    temp?: string;
    condition?: string;
  };
}

export interface UserInfo {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  gender: Gender;
  birthPlace?: string;
}

export interface Star {
  name: string;
  type: 'MAJOR' | 'MINOR' | 'LUCKY' | 'UNLUCKY';
  level: number; // 0-5
}

export interface Palace {
  id: number;
  zodiac: string; // 地支: 子, 丑, 寅...
  name: string; // 命宫, 兄弟, 夫妻...
  stars: Star[];
  isMainPalace: boolean;
}

export interface AIAnalysis {
  summary: string;
  personality: string;
  career: string;
  wealth: string;
  relationship: string;
  health: string;
  suggestions: string[];
}

export interface TarotCard {
  name: string;
  image: string;
  isUpright: boolean;
}

export interface TarotAnalysis {
  question?: string; // 占卜的问题
  interpretation: string;
  advice: string;
  pastPresentFuture?: {
    past: string;
    present: string;
    future: string;
  };
  vipData?: VIPRecommendations;
}

export type InterpretationStyle = 'FREUD' | 'ZHOUGONG';

export interface DreamAnalysis {
  dreamContent: string;
  style: InterpretationStyle;
  coreSymbols: { symbol: string; meaning: string }[];
  mainAnalysis: string;
  hiddenMeaning: string;
  lifeAdvice: string;
  vipData?: VIPRecommendations;
}

export interface HuangliData {
  date: string;
  lunarDate: string;
  ganzhi: string;
  yi: string[];
  ji: string[];
  wuxing: string;
  chong: string;
  luckyDirection: string;
  summary: string;
  vipData?: VIPRecommendations;
}

export type RecordType = 'ASTROLOGY' | 'TAROT' | 'DREAM' | 'HUANGLI';

export interface HistoryRecord {
  id: string;
  timestamp: number;
  type: RecordType;
  userInfo?: UserInfo;
  analysis: AIAnalysis | TarotAnalysis | DreamAnalysis | HuangliData;
  pickedCards?: TarotCard[];
  chart?: Palace[];
}