import { AIAnalysis, HuangliData, InterpretationStyle, Palace, UserInfo, UserProfile } from "../types";

export const buildDestinyPrompt = (user: UserInfo, chart: Palace[]) => {
  const chartDescription = chart.map(p => `${p.name}(${p.zodiac}): ${p.stars.map(s => s.name).join(",")}`).join("; ");
  return `
    作为命理大宗师，解析以下紫微命盘：
    命主：${user.name || "匿名"}，性别：${user.gender === "MALE" ? "男" : "女"}，出生：${user.birthDate} ${user.birthTime}
    命盘：${chartDescription}

    要求：无论画像是否完整，解析必须专业且具有极高情绪价值。若画像缺失，请侧重于宇宙星辰对该命局的共性指引。
    限制：正文不得提及星座、MBTI、常驻城市等画像信息。
  `;
};

export const buildZiweiQuestionPrompt = (
  user: UserInfo,
  chart: Palace[],
  analysis: AIAnalysis,
  question: string,
  profile?: UserProfile
) => {
  const chartDescription = chart.map(p => `${p.name}(${p.zodiac}): ${p.stars.map(s => s.name).join(",")}`).join("; ");
  const profileContext = profile && profile.constellation
    ? `【画像校准】星座：${profile.constellation}，性格：${profile.mbti || "未知"}。`
    : "【画像缺失】请以命盘为主给出共性指引。";

  return `
    你是紫微斗数大师。结合命盘与既有解析，为用户的近期困惑提供具体指引。
    命主：${user.name || "匿名"}，性别：${user.gender === "MALE" ? "男" : "女"}，出生：${user.birthDate} ${user.birthTime}
    命盘：${chartDescription}
    既有解析摘要：${analysis.summary}
    追加问题：${question}
    重点：请围绕最近一次追问给出更具体、可执行的指引与建议。
    ${profileContext}

    要求：语气笃定但温和，条理清晰，避免泛泛而谈；建议不少于 300 字。
  `;
};

export const buildTarotPrompt = (
  question: string,
  cardsInfo: string,
  vip: boolean,
  profile?: UserProfile,
  lastFollowupQuestion?: string
) => {
  const profileContext = vip && profile && profile.constellation
    ? `问卜者背景：${profile.constellation}座，MBTI ${profile.mbti || "未知"}，常驻城市 ${profile.city || "未知"}。`
    : "【画像缺失】问卜者保持神秘，请基于牌阵本身产出高度灵性的通感解读，提供深度心理疗愈。";
  const nonVipConstraint = vip ? "" : "限制：正文不要提及星座、MBTI或常驻城市等个人画像信息。";
  const followupContext = vip && lastFollowupQuestion
    ? `最近一次追问聚焦：${lastFollowupQuestion}。VIP建议请优先围绕该问题给出更具体、更可执行的指引。`
    : "";

  return `
    作为塔罗大宗师，请对以下三牌阵进行深度解读：
    问题：${question}，牌阵：${cardsInfo}
    ${vip ? profileContext : ""}
    ${followupContext}
    ${nonVipConstraint}
    
    要求：若画像不完整，请提供“跨越时空的灵魂共振”解读，字数不少于 600 字。确保即使没有具体背景，读者也能感到被精准洞察和深深抚慰。
  `;
};

export const buildTarotFollowupPrompt = (
  originalQuestion: string,
  originalCardsInfo: string,
  followupQuestion: string,
  extraCardsInfo: string,
  vip: boolean,
  profile?: UserProfile
) => {
  const profileContext = vip && profile && profile.constellation
    ? `问卜者背景：${profile.constellation}座，MBTI ${profile.mbti || "未知"}，常驻城市 ${profile.city || "未知"}。`
    : "";
  const nonVipConstraint = vip ? "" : "限制：正文不要提及星座、MBTI或常驻城市等个人画像信息。";

  return `
    你是资深塔罗师。现在对同一牌阵进行“追加提问”的深挖解读。
    初始问题：${originalQuestion}
    初始牌阵：${originalCardsInfo}
    追加提问：${followupQuestion}
    追加抽取的指示牌/辅助牌：${extraCardsInfo || "无"}
    ${vip ? profileContext : ""}
    ${nonVipConstraint}

    输出要求：
    - 以 2-4 段短小、有条理的答复回应追加提问。
    - 每段以“### 标题”开头，标题简洁。
    - 语气清晰、具象、可执行，避免泛泛而谈。
  `;
};

const DREAM_STYLE_MAP: Record<InterpretationStyle, string> = {
  ZHOUGONG: "传统民俗专家（周公解梦）",
  FREUD: "弗洛伊德精神分析学派",
  JUNG: "荣格分析心理学派（原型与集体无意识）",
  COGNITIVE: "认知心理学派（记忆与情绪加工）",
  ANTHROPOLOGY: "文化人类学视角（象征与仪式）"
};

export const buildDreamPrompt = (
  content: string,
  style: InterpretationStyle,
  vip: boolean,
  profile?: UserProfile
) => {
  const profileContext = vip && profile && profile.constellation
    ? `梦者背景：${profile.constellation}, MBTI ${profile.mbti || "未知"}，常驻城市 ${profile.city || "未知"}。`
    : "【画像缺失】请提供通用的集体无意识深度剖析。";
  const nonVipConstraint = vip ? "" : "限制：正文不要提及星座、MBTI或常驻城市等个人画像信息。";

  return `
    解析梦境：${content}
    视角：${DREAM_STYLE_MAP[style]}
    ${vip ? profileContext : ""}
    ${nonVipConstraint}

    要求：若缺乏画像，请从梦境意象的原始力量入手。产出不少于 500 字，提供极高的心理支持。
  `;
};

export const buildHuangliPrompt = (
  date: string,
  vip: boolean,
  profile?: UserProfile,
  lastPlanTopic?: string
) => {
  const profileContext = vip && profile && profile.constellation
    ? `命主画像：${profile.constellation}，MBTI ${profile.mbti || "未知"}，常驻城市 ${profile.city || "未知"}。`
    : "【画像缺失】提供通用开运指引。";
  const nonVipConstraint = vip ? "" : "限制：正文不要提及星座、MBTI或常驻城市等个人画像信息。";
  const followupContext = vip && lastPlanTopic
    ? `最近一次事项追问：${lastPlanTopic}。VIP建议请围绕该事项给出更贴合的趋利避害建议。`
    : "";
  return `推演日期 ${date} 的老黄历。${vip ? profileContext : ""}${followupContext}${nonVipConstraint}`;
};

export const buildHuangliPlanPrompt = (
  date: string,
  plan: string,
  data: HuangliData
) => {
  return `
    你是老黄历推演师。基于当天黄历信息，判断“计划事项”是否适合进行，并给出趋利避害的具体建议。
    日期：${date}
    黄历：${data.lunarDate}（${data.ganzhi}），五行 ${data.wuxing}，冲 ${data.chong}
    宜：${data.yi.join("、")}
    忌：${data.ji.join("、")}
    计划事项：${plan}

    要求：
    1) 不要寒暄或自我介绍，语气自然不机械；
    2) 输出格式固定为 4 行，分别以【判断】【理由】【趋利】【避害】开头；
    3) 判断只能是“适合/不适合/谨慎可行”之一；
    4) 每行 1-2 句，具体、好执行；
    5) 正文不要提及星座、MBTI或常驻城市等个人画像信息。
  `;
};
