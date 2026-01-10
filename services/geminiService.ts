
import { Type } from "@google/genai";
import { UserInfo, AIAnalysis, Palace, TarotCard, TarotAnalysis, Gender, DreamAnalysis, InterpretationStyle, HuangliData, UserProfile } from "../types";
import {
  buildDestinyPrompt,
  buildZiweiQuestionPrompt,
  buildTarotPrompt,
  buildTarotFollowupPrompt,
  buildDreamPrompt,
  buildHuangliPrompt,
  buildHuangliPlanPrompt
} from "./aiPrompts";

const GEMINI_ENDPOINT = '/api/gemini';

const generateContent = async (payload: { model: string; contents: any; config?: any }) => {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error || 'AI分析服务暂时不可用，请稍后重试。';
    throw new Error(message);
  }

  const data = await response.json();
  return data.text as string;
};

async function fetchWeather(city?: string) {
  if (!city) return null;
  try {
    const mockConditions = ['晴朗', '多云', '阴天', '小雨', '阵雨'];
    const mockTemp = Math.floor(Math.random() * 25) + 5;
    return {
      temp: `${mockTemp}℃`,
      condition: mockConditions[Math.floor(Math.random() * mockConditions.length)]
    };
  } catch (e) {
    return null;
  }
}

const VIP_PROPERTIES = {
  vipData: {
    type: Type.OBJECT,
    properties: {
      crystal: {
        type: Type.OBJECT,
        properties: {
          variety: { type: Type.STRING, description: '推荐的水晶品种' },
          outfitTips: { type: Type.STRING, description: '结合当地天气（如有）或季节给出的今日穿搭建议' }
        },
        required: ["variety", "outfitTips"]
      },
      homeTreasure: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: '推荐的镇宅之宝' },
          benefit: { type: Type.STRING, description: '对运势的提升作用' },
          placement: { type: Type.STRING, description: '建议摆放位置' }
        },
        required: ["item", "benefit", "placement"]
      },
      pitfallGuide: { 
        type: Type.STRING, 
        description: '当日避坑指南。' 
      }
    },
    required: ["crystal", "homeTreasure", "pitfallGuide"]
  }
};

export const analyzeDestiny = async (user: UserInfo, chart: Palace[], _profile?: UserProfile): Promise<AIAnalysis> => {
  const prompt = buildDestinyPrompt(user, chart);

  try {
    const responseText = await generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            personality: { type: Type.STRING },
            career: { type: Type.STRING },
            wealth: { type: Type.STRING },
            relationship: { type: Type.STRING },
            health: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "personality", "career", "wealth", "relationship", "health", "suggestions"]
        }
      }
    });
    return JSON.parse(responseText.trim()) as AIAnalysis;
  } catch (err: any) {
    if (err?.message?.includes('API_KEY') || err?.message?.includes('INVALID_ARGUMENT') || err?.message?.includes('PERMISSION_DENIED')) {
      throw new Error('API密钥无效或未设置。请在.env.local里配置 VITE_GEMINI_API_KEY。');
    }
    throw err;
  }
};

export const analyzeZiweiQuestion = async (
  user: UserInfo,
  chart: Palace[],
  analysis: AIAnalysis,
  question: string,
  profile?: UserProfile
): Promise<string> => {
  const prompt = buildZiweiQuestionPrompt(user, chart, analysis, question, profile);

  try {
    const responseText = await generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return responseText.trim();
  } catch (err: any) {
    if (err?.message?.includes('API_KEY') || err?.message?.includes('INVALID_ARGUMENT') || err?.message?.includes('PERMISSION_DENIED')) {
      throw new Error('API密钥无效或未设置。请在.env.local里配置 VITE_GEMINI_API_KEY。');
    }
    throw new Error('AI分析服务暂时不可用，请稍后重试。');
  }
};

export const analyzeTarot = async (question: string, cards: TarotCard[], gender: Gender, profile?: UserProfile, vip: boolean = false, lastFollowupQuestion?: string): Promise<TarotAnalysis> => {
  const cardsInfo = cards.map((c, i) => `位置 ${i+1}：${c.name} (${c.isUpright ? '正位' : '逆位'})`).join('；');
  const prompt = buildTarotPrompt(question, cardsInfo, vip, profile, lastFollowupQuestion);

  try {
    const responseText = await generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interpretation: { type: Type.STRING },
            advice: { type: Type.STRING },
            pastPresentFuture: {
              type: Type.OBJECT,
              properties: { past: { type: Type.STRING }, present: { type: Type.STRING }, future: { type: Type.STRING } },
              required: ["past", "present", "future"]
            },
            ...(vip ? VIP_PROPERTIES : {})
          },
          required: vip ? ["interpretation", "advice", "pastPresentFuture", "vipData"] : ["interpretation", "advice", "pastPresentFuture"]
        }
      }
    });
    return { ...JSON.parse(responseText.trim()), question } as TarotAnalysis;
  } catch (err) {
    console.error('Gemini API Error:', err);
    if (err.message?.includes('API_KEY') || err.message?.includes('INVALID_ARGUMENT') || err.message?.includes('PERMISSION_DENIED')) {
      throw new Error('API密钥无效或未设置。请在.env.local文件中设置有效的GEMINI_API_KEY。');
    }
    throw new Error('AI分析服务暂时不可用，请稍后重试。');
  }
};

export const analyzeTarotFollowup = async (
  originalQuestion: string,
  originalCards: TarotCard[],
  followupQuestion: string,
  extraCards: TarotCard[],
  profile?: UserProfile,
  vip: boolean = false
): Promise<string> => {
  const originalCardsInfo = originalCards
    .map((c, i) => `位置 ${i + 1}：${c.name} (${c.isUpright ? '正位' : '逆位'})`)
    .join('；');
  const extraCardsInfo = extraCards
    .map((c, i) => `指示牌 ${i + 1}：${c.name} (${c.isUpright ? '正位' : '逆位'})`)
    .join('；');
  const prompt = buildTarotFollowupPrompt(originalQuestion, originalCardsInfo, followupQuestion, extraCardsInfo, vip, profile);

  try {
    const responseText = await generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return responseText.trim();
  } catch (err) {
    console.error('Gemini API Error:', err);
    throw new Error('AI分析服务暂时不可用，请稍后重试。');
  }
};

export const analyzeDream = async (content: string, style: InterpretationStyle, profile?: UserProfile, vip: boolean = false): Promise<DreamAnalysis> => {
  const prompt = buildDreamPrompt(content, style, vip, profile);

  try {
    const responseText = await generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2500 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coreSymbols: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { symbol: { type: Type.STRING }, meaning: { type: Type.STRING } }, required: ["symbol", "meaning"] } },
            mainAnalysis: { type: Type.STRING },
            hiddenMeaning: { type: Type.STRING },
            lifeAdvice: { type: Type.STRING },
            ...(vip ? VIP_PROPERTIES : {})
          },
          required: vip ? ["coreSymbols", "mainAnalysis", "hiddenMeaning", "lifeAdvice", "vipData"] : ["coreSymbols", "mainAnalysis", "hiddenMeaning", "lifeAdvice"]
        }
      }
    });
    return { ...JSON.parse(responseText.trim()), dreamContent: content, style };
  } catch (err) { throw err; }
};

export const analyzeHuangli = async (date: string, profile?: UserProfile, vip: boolean = false, lastPlanTopic?: string): Promise<HuangliData> => {
  const prompt = buildHuangliPrompt(date, vip, profile, lastPlanTopic);
  try {
    const responseText = await generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lunarDate: { type: Type.STRING },
            ganzhi: { type: Type.STRING },
            yi: { type: Type.ARRAY, items: { type: Type.STRING } },
            ji: { type: Type.ARRAY, items: { type: Type.STRING } },
            wuxing: { type: Type.STRING },
            chong: { type: Type.STRING },
            luckyDirection: { type: Type.STRING },
            summary: { type: Type.STRING },
            ...(vip ? VIP_PROPERTIES : {})
          },
          required: vip ? ["lunarDate", "ganzhi", "yi", "ji", "wuxing", "chong", "luckyDirection", "summary", "vipData"] : ["lunarDate", "ganzhi", "yi", "ji", "wuxing", "chong", "luckyDirection", "summary"]
        }
      }
    });
    return { ...JSON.parse(responseText.trim()), date };
  } catch (err) { throw err; }
};

export const analyzeHuangliPlan = async (
  date: string,
  plan: string,
  data: HuangliData
): Promise<string> => {
  const prompt = buildHuangliPlanPrompt(date, plan, data);

  try {
    const responseText = await generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return responseText.trim();
  } catch (err: any) {
    if (err?.message?.includes('API_KEY') || err?.message?.includes('INVALID_ARGUMENT') || err?.message?.includes('PERMISSION_DENIED')) {
      throw new Error('API密钥无效或未设置。请在.env.local里配置 VITE_GEMINI_API_KEY。');
    }
    throw new Error('AI分析服务暂时不可用，请稍后重试。');
  }
};
