
import { Type } from "@google/genai";
import { UserInfo, AIAnalysis, Palace, TarotCard, TarotAnalysis, Gender, DreamAnalysis, InterpretationStyle, HuangliData, UserProfile } from "../types";

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

export const analyzeDestiny = async (user: UserInfo, chart: Palace[], profile?: UserProfile): Promise<AIAnalysis> => {
  const chartDescription = chart.map(p => `${p.name}(${p.zodiac}): ${p.stars.map(s => s.name).join(',')}`).join('; ');
  const profileContext = profile && profile.constellation ? `【画像校准】星座：${profile.constellation}，性格：${profile.mbti || '未知'}。` : '【画像缺失】请基于天时共性进行高频能量引导。';
  
  const prompt = `
    作为命理大宗师，解析以下紫微命盘：
    命主：${user.name || "匿名"}，性别：${user.gender === 'MALE' ? '男' : '女'}，出生：${user.birthDate} ${user.birthTime}
    命盘：${chartDescription}
    ${profileContext}

    要求：无论画像是否完整，解析必须专业且具有极高情绪价值。若画像缺失，请侧重于宇宙星辰对该命局的共性指引。
  `;

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

export const analyzeTarot = async (question: string, cards: TarotCard[], gender: Gender, profile?: UserProfile, vip: boolean = false): Promise<TarotAnalysis> => {
  const cardsInfo = cards.map((c, i) => `位置 ${i+1}：${c.name} (${c.isUpright ? '正位' : '逆位'})`).join('；');
  const profileContext = profile && profile.constellation ? `问卜者背景：${profile.constellation}座，MBTI ${profile.mbti || '未知'}。` : '【画像缺失】问卜者保持神秘，请基于牌阵本身产出高度灵性的通感解读，提供深度心理疗愈。';
  
  const prompt = `
    作为塔罗大宗师，请对以下三牌阵进行深度解读：
    问题：${question}，牌阵：${cardsInfo}
    ${profileContext}
    
    要求：若画像不完整，请提供“跨越时空的灵魂共振”解读，字数不少于 600 字。确保即使没有具体背景，读者也能感到被精准洞察和深深抚慰。
  `;

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

export const analyzeDream = async (content: string, style: InterpretationStyle, profile?: UserProfile, vip: boolean = false): Promise<DreamAnalysis> => {
  const profileContext = profile && profile.constellation ? `梦者背景：${profile.constellation}, MBTI ${profile.mbti || '未知'}。` : '【画像缺失】请提供通用的集体无意识深度剖析。';
  const styleMap: Record<InterpretationStyle, string> = {
    ZHOUGONG: '传统民俗专家（周公解梦）',
    FREUD: '弗洛伊德精神分析学派',
    JUNG: '荣格分析心理学派（原型与集体无意识）',
    COGNITIVE: '认知心理学派（记忆与情绪加工）',
    ANTHROPOLOGY: '文化人类学视角（象征与仪式）'
  };

  const prompt = `
    解析梦境：${content}
    视角：${styleMap[style]}
    ${profileContext}

    要求：若缺乏画像，请从梦境意象的原始力量入手。产出不少于 500 字，提供极高的心理支持。
  `;

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

export const analyzeHuangli = async (date: string, profile?: UserProfile, vip: boolean = false): Promise<HuangliData> => {
  const profileContext = profile && profile.constellation ? `命主画像：${profile.constellation}。` : '【画像缺失】提供通用开运指引。';
  const prompt = `推演日期 ${date} 的老黄历。${profileContext}`;
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
