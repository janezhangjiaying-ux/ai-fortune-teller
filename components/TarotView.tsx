
import React, { useState, useEffect } from 'react';
import { TarotCard, TarotAnalysis, Gender, SaveRecordPayload, UserProfile } from '@/types';
import { analyzeTarot, analyzeTarotFollowup } from '@/services/geminiService';
import VIPRecommendationSection from './VIPRecommendationSection';
import TarotLoading from './TarotLoading';
import { Sparkles, RefreshCw, BrainCircuit, Bookmark, ShieldCheck, Crown, X, Star, HelpCircle, MessageCircle } from 'lucide-react';

const TAROT_ASSET_BASE = "/assets/tarot";
const TAROT_IMAGES: Record<string, string> = {
  "愚者": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_00_The_Fool.jpg`,
  "魔术师": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_01_The_Magician.jpg`,
  "女教皇": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_02_The_High_Priestess.jpg`,
  "皇后": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_03_The_Empress.jpg`,
  "皇帝": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_04_The_Emperor.jpg`,
  "教皇": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_05_The_Hierophant.jpg`,
  "恋人": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_06_The_Lovers.jpg`,
  "战车": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_07_The_Chariot.jpg`,
  "力量": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_08_Strength.jpg`,
  "隐士": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_09_The_Hermit.jpg`,
  "命运之轮": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_10_Wheel_of_Fortune.jpg`,
  "正义": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_11_Justice.jpg`,
  "倒吊人": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_12_The_Hanged_Man.jpg`,
  "死神": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_13_Death.jpg`,
  "节制": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_14_Temperance.jpg`,
  "恶魔": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_15_The_Devil.jpg`,
  "高塔": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_16_The_Tower.jpg`,
  "星星": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_17_The_Star.jpg`,
  "月亮": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_18_The_Moon.jpg`,
  "太阳": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_19_The_Sun.jpg`,
  "审判": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_20_Judgement.jpg`,
  "世界": `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_21_The_World.jpg`
};

const SUIT_FILES: Record<string, string> = {
  "圣杯": "Cups",
  "权杖": "Wands",
  "宝剑": "Swords",
  "钱币": "Pentacles"
};

const RANK_LABELS = [
  "王牌", "二", "三", "四", "五", "六", "七", "八", "九", "十", "侍从", "骑士", "皇后", "国王"
];

const buildMinorDeck = () => {
  const minors: { name: string; image: string }[] = [];
  Object.entries(SUIT_FILES).forEach(([suitCn, suitEn]) => {
    RANK_LABELS.forEach((rank, idx) => {
      const number = String(idx + 1).padStart(2, "0");
      minors.push({
        name: `${suitCn}${rank}`,
        image: `${TAROT_ASSET_BASE}/Pictorial_Key_to_the_Tarot_${suitEn}_${number}.jpg`
      });
    });
  });
  return minors;
};

const TAROT_DECK = [
  ...Object.entries(TAROT_IMAGES).map(([name, image]) => ({ name, image })),
  ...buildMinorDeck()
];

const CardBack: React.FC<{ active?: boolean; className?: string }> = ({ active, className = "" }) => (
  <div className={`w-full h-full bg-[#0a0a1a] border-2 border-[#c0a060] rounded-xl flex items-center justify-center p-2 shadow-inner overflow-hidden relative transition-all duration-300 ${active ? 'ring-4 ring-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : ''} ${className}`}>
    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    <div className="w-full h-full border border-[#c0a060]/30 rounded-lg flex flex-col items-center justify-center relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a1a]">
       <div className="w-10 h-16 border border-[#c0a060]/50 rounded-full flex items-center justify-center animate-pulse"><Star size={20} className="text-[#c0a060]" /></div>
    </div>
  </div>
);

interface TarotViewProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onSave?: (record: SaveRecordPayload) => string | void;
  onTriggerOnboarding?: (callback?: () => void) => void;
  customAnalyze?: (question: string, cards: TarotCard[], gender: Gender, vip: boolean) => Promise<TarotAnalysis>;
  initialCards?: TarotCard[];
  initialAnalysis?: TarotAnalysis;
  initialFollowupQuestion?: string;
  initialFollowupAnswer?: string;
  initialFollowupCards?: TarotCard[];
  initialFollowups?: { question: string; answer: string; cards: TarotCard[]; timestamp: number }[];
}

const TarotView: React.FC<TarotViewProps> = ({ userProfile, onUpdateProfile, onSave, onTriggerOnboarding, customAnalyze, initialCards, initialAnalysis, initialFollowupQuestion, initialFollowupAnswer, initialFollowupCards, initialFollowups }) => {
  const [question, setQuestion] = useState(initialAnalysis?.question || '');
  const [gender, setGender] = useState<Gender>(Gender.UNKNOWN);
  const [pickedCards, setPickedCards] = useState<TarotCard[]>(initialCards || []);
  const [analysis, setAnalysis] = useState<TarotAnalysis | null>(initialAnalysis || null);
  const [loading, setLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [vipEnabled, setVipEnabled] = useState(!!initialAnalysis?.vipData);
  const [showPayment, setShowPayment] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [mysticProgress, setMysticProgress] = useState(0);
  const [pickingPhase, setPickingPhase] = useState<'IDLE' | 'SHUFFLING' | 'FAN' | 'DONE'>(initialCards ? 'DONE' : 'IDLE');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);
  const [followupQuestion, setFollowupQuestion] = useState(initialFollowupQuestion || '');
  const [followupAnswer, setFollowupAnswer] = useState(initialFollowupAnswer || '');
  const [followupError, setFollowupError] = useState<string>('');
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupDrawing, setFollowupDrawing] = useState(false);
  const [followupCards, setFollowupCards] = useState<TarotCard[]>(initialFollowupCards || []);
  const [followupNoDraw, setFollowupNoDraw] = useState(false);
  const [followupHistory, setFollowupHistory] = useState<{ question: string; answer: string; cards: TarotCard[]; timestamp: number }[]>(
    initialFollowups && initialFollowups.length
      ? initialFollowups
      : (initialFollowupQuestion || initialFollowupAnswer || (initialFollowupCards && initialFollowupCards.length))
        ? [{
            question: initialFollowupQuestion || '追加提问',
            answer: initialFollowupAnswer || '',
            cards: initialFollowupCards || [],
            timestamp: Date.now()
          }]
        : []
  );

  const parseFollowupSections = (answerText: string) => {
    return answerText
      .split(/###\s*/g)
      .map((section) => section.trim())
      .filter(Boolean)
      .map((section, index) => {
        const lines = section.split('\n').map((line) => line.trim()).filter(Boolean);
        if (!lines.length) {
          return { title: `要点 ${index + 1}`, body: '' };
        }
        if (lines.length === 1) {
          return { title: `要点 ${index + 1}`, body: lines[0] };
        }
        const [firstLine, ...rest] = lines;
        return { title: firstLine, body: rest.join('\n') };
      });
  };

  useEffect(() => {
    if (!showPayment) return;
    setMysticProgress(0);
    const timer = setInterval(() => {
      setMysticProgress(prev => (prev < 92 ? prev + Math.random() * 8 + 2 : prev));
    }, 260);
    return () => clearInterval(timer);
  }, [showPayment]);

  const handleVipClick = () => {
    if (vipEnabled || vipLoading || showPayment) return;
    setShowPayment(true);
    setPaymentStatus('VERIFYING');
    setTimeout(() => {
      setPaymentStatus('SUCCESS');
      setShowPayment(false);
      const isProfileComplete = !!(userProfile?.constellation && userProfile?.mbti);
      if (!isProfileComplete) {
        if (onTriggerOnboarding) {
          onTriggerOnboarding(() => {
            // VIP onboarding完成后，继续VIP分析
            handleAnalyze(true);
          });
        }
      } else if (analysis) {
        handleAnalyze(true);
      }
    }, 3000);
  };

  const handleAnalyze = async (forceVip: boolean = false) => {
    setError('');
    if (!question.trim()) {
      setError('请先输入您的问题');
      return;
    }
    if (pickedCards.length < 3) {
      setError('请先选择3张卡牌');
      return;
    }
    if (!forceVip) {
      setIsSaved(false);
      setSavedRecordId(null);
    }
    if (forceVip && analysis) setVipLoading(true); else setLoading(true);
    try {
      const isVip = forceVip || vipEnabled;
      const lastFollowupTopic = followupHistory.length ? followupHistory[followupHistory.length - 1].question : '';
      const result = await analyzeTarot(
        question,
        pickedCards,
        gender,
        (userProfile || undefined),
        isVip,
        isVip && lastFollowupTopic ? lastFollowupTopic : undefined
      );
      setAnalysis(result);
      if (!forceVip) {
        setFollowupQuestion('');
        setFollowupAnswer('');
        setFollowupCards([]);
        setFollowupError('');
        setFollowupNoDraw(false);
        setFollowupHistory([]);
      }
      if (isVip) setIsSaved(false);
      if (isVip) setVipEnabled(true);
    } catch (err) { 
      console.error(err);
      setError(err.message || '分析失败，请重试');
    } finally { 
      setLoading(false); 
      setVipLoading(false); 
    }
  };

  const startPicking = () => { 
    setError('');
    if (!question.trim()) {
      setError('请先输入您的问题');
      return;
    }
    setPickingPhase('SHUFFLING'); 
    setAnalysis(null); 
    setSelectedIndices([]); 
    setImageErrors({}); 
    setIsSaved(false);
    setSavedRecordId(null);
    setFollowupQuestion('');
    setFollowupAnswer('');
    setFollowupCards([]);
    setFollowupError('');
    setFollowupNoDraw(false);
    setFollowupHistory([]);
    setTimeout(() => setPickingPhase('FAN'), 1500); 
  };
  
  const handlePickCard = (idx: number) => {
    if (selectedIndices.includes(idx) || selectedIndices.length >= 3) return;
    const newIndices = [...selectedIndices, idx];
    setSelectedIndices(newIndices);
    if (newIndices.length === 3) {
      setTimeout(() => {
        const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3).map(card => ({
          name: card.name,
          image: card.image,
          isUpright: Math.random() > 0.3
        }));
        setPickedCards(selected);
        setPickingPhase('DONE');
      }, 800);
    }
  };

  const drawFollowupCards = (count: number) => {
    const usedNames = new Set(pickedCards.map((card) => card.name));
    const available = TAROT_DECK.filter((card) => !usedNames.has(card.name));
    const selected: TarotCard[] = [];
    const pool = [...available];
    for (let i = 0; i < Math.min(count, pool.length); i += 1) {
      const index = Math.floor(Math.random() * pool.length);
      const card = pool.splice(index, 1)[0];
      selected.push({
        name: card.name,
        image: card.image,
        isUpright: Math.random() > 0.3
      });
    }
    return selected;
  };

  const handleFollowupAsk = async () => {
    setFollowupError('');
    if (!analysis) {
      setFollowupError('请先完成塔罗解读');
      return;
    }
    if (!followupQuestion.trim()) {
      setFollowupError('请写下你的追加提问');
      return;
    }
    const roll = Math.random();
    const drawCount = roll < 0.4 ? 0 : roll < 0.8 ? 1 : 2;
    const extraCards = drawCount > 0 ? drawFollowupCards(drawCount) : [];
    setFollowupCards(extraCards);
    setFollowupDrawing(drawCount > 0);
    setFollowupNoDraw(drawCount === 0);
    setFollowupLoading(true);
    setIsSaved(false);
    try {
      if (drawCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
      const answer = await analyzeTarotFollowup(
        question,
        pickedCards,
        followupQuestion.trim(),
        extraCards,
        userProfile || undefined,
        vipEnabled
      );
      setFollowupAnswer(answer);
      setFollowupHistory((prev) => [
        ...prev,
        {
          question: followupQuestion.trim(),
          answer,
          cards: extraCards,
          timestamp: Date.now()
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setFollowupError(err?.message || 'AI分析服务暂时不可用，请稍后重试。');
    } finally {
      setFollowupDrawing(false);
      setFollowupLoading(false);
    }
  };

  const handleImageError = (idx: number) => {
    setImageErrors(prev => ({ ...prev, [idx]: true }));
  };

  const handleRestart = () => {
    setPickingPhase('IDLE');
    setPickedCards([]);
    setAnalysis(null);
    setVipEnabled(false);
    setSelectedIndices([]);
    setError('');
    setIsSaved(false);
    setSavedRecordId(null);
    setFollowupQuestion('');
    setFollowupAnswer('');
    setFollowupCards([]);
    setFollowupError('');
    setFollowupNoDraw(false);
    setFollowupHistory([]);
  };

  const handleSave = () => {
    if (!onSave || !analysis) return;
    const savedId = onSave({
      type: 'TAROT',
      analysis,
      pickedCards,
      tarotFollowupQuestion: followupQuestion.trim() ? followupQuestion.trim() : '',
      tarotFollowupAnswer: followupAnswer || '',
      tarotFollowupCards: followupCards,
      tarotFollowups: followupHistory,
      replaceId: savedRecordId || undefined
    });
    if (savedId) setSavedRecordId(savedId);
    setIsSaved(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto px-4">
      {loading && <TarotLoading />}
      
      <style>{`
        @keyframes tarot-shuffle { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(30px, -8px) rotate(8deg); } }
        @keyframes card-fly-in { 0% { transform: scale(0.4) translateY(600px) rotate(45deg); opacity: 0; } 100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; } }
        .animate-tarot-shuffle { animation: tarot-shuffle 0.4s infinite ease-in-out; }
        .animate-card-fly-in { animation: card-fly-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .vip-active-glow { animation: vip-glow 2s infinite ease-in-out; }
        @keyframes vip-glow { 0%, 100% { box-shadow: 0 0 10px rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 20px rgba(245,158,11,0.4); border-color: rgba(245,158,11,0.8); } }
        @keyframes loading-shimmer { 0% { transform: translateX(-40%); } 100% { transform: translateX(220%); } }
      `}</style>

      <div className="text-center space-y-1">
        <h2 className="text-5xl md:text-6xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent calligraphy-font">神秘塔罗占卜</h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em] font-light italic">AI 命理大师为您拨云见日</p>
      </div>

      <div className="w-full mx-auto space-y-6">
        {pickingPhase === 'IDLE' && (
          <div className="space-y-6">
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="你想问什么？" className="w-full bg-white dark:bg-[#0a0a14] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-800 dark:text-slate-200 focus:outline-none min-h-[140px] shadow-inner font-light text-lg transition-all focus:ring-2 focus:ring-purple-500/20" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">性别选择</span>
                <div className="flex bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-inner">
                  <button onClick={() => setGender(Gender.MALE)} className={`flex-1 py-2.5 rounded-xl text-[10px] transition-all font-bold ${gender === Gender.MALE ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>男</button>
                  <button onClick={() => setGender(Gender.FEMALE)} className={`flex-1 py-2.5 rounded-xl text-[10px] transition-all font-bold ${gender === Gender.FEMALE ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400'}`}>女</button>
                  <button onClick={() => setGender(Gender.UNKNOWN)} className={`flex-1 py-2.5 rounded-xl text-[10px] transition-all font-bold ${gender === Gender.UNKNOWN ? 'bg-slate-300 dark:bg-slate-700 text-white shadow-md' : 'text-slate-400'}`}>潜</button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1"><Crown size={12} /> VIP 特权</span>
                  <button onClick={() => setShowRules(true)} className="text-slate-400 hover:text-amber-500 transition-colors"><HelpCircle size={12} /></button>
                </div>
                <button 
                  onClick={handleVipClick} 
                  className={`flex-1 py-2.5 px-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${
                    vipEnabled 
                    ? 'bg-amber-500/10 border-amber-500/60 text-amber-600 vip-active-glow' 
                    : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-amber-500/30 shadow-inner'
                  }`}
                >
                  <span className="text-[10px] font-bold chinese-font">{vipEnabled ? '开运已激活' : '解锁穿搭建议'}</span>
                  {vipEnabled ? <ShieldCheck size={16} className="text-amber-500 animate-in zoom-in" /> : <Crown size={16} />}
                </button>
              </div>
            </div>
            <button onClick={startPicking} disabled={!question.trim()} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-5 rounded-3xl shadow-xl active:scale-95 disabled:opacity-30 tracking-[0.2em] uppercase text-sm hover:brightness-110 transition-all">开始占卜</button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
        )}
        {pickingPhase === 'SHUFFLING' && <div className="flex flex-col items-center justify-center py-24 gap-8"><div className="relative w-28 h-40 animate-tarot-shuffle"><CardBack /></div><p className="text-purple-600 dark:text-purple-400 chinese-font text-xl tracking-[0.3em] animate-pulse">命运齿轮重组中...</p></div>}
        {pickingPhase === 'FAN' && <div className="space-y-16 py-12"><div className="relative h-64 flex justify-center items-end">{[...Array(11)].map((_, i) => (<button key={i} onClick={() => handlePickCard(i)} disabled={selectedIndices.includes(i) || selectedIndices.length >= 3} style={{ transform: `rotate(${(i - 5) * 14}deg) translateY(${selectedIndices.includes(i) ? -40 : 0}px)`, left: `calc(50% + ${(i - 5) * 32}px)`, bottom: `${Math.abs(i - 5) * 5}px`, zIndex: selectedIndices.includes(i) ? 100 : 10 + i }} className={`absolute w-24 h-36 rounded-2xl transition-all duration-500 ${selectedIndices.includes(i) ? 'scale-110 ring-4 ring-amber-500/50' : 'hover:translate-y-[-10px]'}`}><CardBack active={selectedIndices.includes(i)} /></button>))}</div><p className="text-center text-slate-400 text-xs animate-bounce tracking-widest">请凭直觉点选 3 张卡牌</p></div>}
      </div>

      {pickingPhase === 'DONE' && (
        <div className="w-full flex flex-col items-center py-4 gap-10">
          <div className="grid grid-cols-3 gap-6 md:gap-10 w-full max-w-4xl">
            {pickedCards.map((card, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 animate-card-fly-in" style={{ animationDelay: `${idx * 400}ms` }}>
                <div className={`relative aspect-[2/3.1] w-full rounded-3xl overflow-hidden border-2 border-purple-500/20 dark:border-amber-500/30 bg-slate-900 shadow-2xl transition-all duration-1000 ${!card.isUpright ? 'rotate-180' : ''}`}>
                  {imageErrors[idx] ? (
                    <CardBack className="h-full w-full" />
                  ) : (
                    <img 
                      src={card.image} 
                      alt={card.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={() => handleImageError(idx)}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-2 left-0 right-0 text-center z-10">
                    <span className="text-[11px] md:text-xs font-bold text-white tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">{card.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!analysis && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => handleAnalyze()}
                disabled={loading}
                className="w-full min-h-[64px] px-8 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-[2.2rem] shadow-[0_20px_60px_-20px_rgba(124,58,237,0.7)] flex items-center justify-center gap-3 active:scale-95 transition-all hover:brightness-110 hover:shadow-[0_25px_70px_-20px_rgba(236,72,153,0.7)]"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <BrainCircuit />}
                {loading ? '星轨推演中...' : '深度解读牌阵'}
              </button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
          )}
        </div>
      )}

      {analysis && (
        <div className="space-y-12 animate-in slide-in-from-bottom-12 duration-1000 max-w-4xl mx-auto pb-12">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl text-center text-2xl font-light italic text-slate-700 dark:text-slate-300">“{question}”</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {['past', 'present', 'future'].map((k, i) => (
               <div key={k} className="p-8 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${i === 0 ? 'bg-purple-500/40' : i === 1 ? 'bg-indigo-500/40' : 'bg-pink-500/40'}`}></div>
                  <h5 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-500"><Bookmark size={14} /> {['过去','现在','未来'][i]}</h5>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm text-justify font-light">{(analysis.pastPresentFuture as any)[k]}</p>
               </div>
             ))}
          </div>
          <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/10 p-10 md:p-14 rounded-[3.5rem] border border-indigo-100 dark:border-indigo-900/30 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px]"></div>
             <h4 className="text-indigo-700 dark:text-indigo-400 font-bold mb-8 flex items-center gap-3 chinese-font text-2xl tracking-widest"><BrainCircuit size={28} className="text-amber-500" /> 命运综合解读</h4>
             <p className="text-slate-800 dark:text-slate-200 leading-relaxed chinese-font text-lg font-light tracking-wide text-justify">{analysis.interpretation}</p>
          </div>

          <div className="p-10 md:p-12 bg-gradient-to-br from-purple-500/10 via-white/70 dark:via-slate-900/70 to-indigo-500/10 rounded-[3rem] border border-purple-200/30 dark:border-purple-800/30 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 font-bold chinese-font text-2xl tracking-widest">
              <MessageCircle size={24} /> 追加提问
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              可补充细节、寻求建议或澄清疑惑。必要时，我会再抽取 1-2 张指示牌辅助解读。
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                '刚才提到的“阻碍”，更像人际还是流程问题？',
                '既然会有变数，我该做什么来降低风险？',
                '那张“逆位牌”的含义能再展开讲讲吗？'
              ].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setFollowupQuestion(tip)}
                  className="px-3 py-1.5 rounded-full border border-purple-300/40 text-[10px] text-purple-500 tracking-widest hover:bg-purple-500/10 transition-colors"
                >
                  {tip}
                </button>
              ))}
            </div>
            <textarea
              value={followupQuestion}
              onChange={(e) => setFollowupQuestion(e.target.value)}
              placeholder="写下你的追加提问..."
              className="w-full min-h-[140px] bg-white/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 text-slate-800 dark:text-slate-200 focus:outline-none shadow-inner font-light text-base"
            />
            {followupError && <p className="text-rose-500 text-sm">{followupError}</p>}
            <div className="flex items-center gap-4">
              <button
                onClick={handleFollowupAsk}
                disabled={followupLoading}
                className="flex-1 py-4 rounded-[2rem] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 text-white font-bold tracking-widest uppercase text-xs shadow-xl shadow-purple-500/30 hover:brightness-110 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {followupLoading ? <RefreshCw size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                {followupLoading ? '推演中' : '提交追加提问'}
              </button>
              <button
                onClick={() => {
                  setFollowupQuestion('');
                  setFollowupAnswer('');
                  setFollowupError('');
                  setFollowupCards([]);
                }}
                className="px-6 py-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                清空
              </button>
            </div>

            {(followupDrawing || followupCards.length > 0) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-500/80 text-sm font-bold chinese-font tracking-widest">
                  <Sparkles size={18} /> 指示牌 / 辅助牌
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(followupDrawing ? followupCards : followupCards).map((card, idx) => (
                    <div key={`${card.name}-${idx}`} className="relative aspect-[2/3.1] w-full rounded-2xl overflow-hidden border border-purple-500/20 bg-slate-900 shadow-2xl">
                      {followupDrawing ? (
                        <div className="w-full h-full animate-tarot-shuffle">
                          <CardBack />
                        </div>
                      ) : (
                        <>
                          <img
                            src={card.image}
                            alt={card.name}
                            className={`w-full h-full object-cover animate-card-fly-in ${!card.isUpright ? 'rotate-180' : ''}`}
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                          <div className="absolute bottom-2 left-0 right-0 text-center z-10">
                            <span className="text-[10px] font-bold text-white tracking-widest bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">{card.name}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {followupNoDraw && !followupDrawing && followupCards.length === 0 && (
              <div className="flex items-center gap-2 text-purple-500/80 text-xs font-bold chinese-font tracking-widest">
                <Sparkles size={16} />
                本次无需补牌
              </div>
            )}

            {followupHistory.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white/80 dark:bg-slate-950/70 border border-purple-500/20 rounded-[2rem] px-6 py-4 shadow-inner">
                  <div className="flex items-center gap-2 text-purple-500">
                    <Sparkles size={18} />
                    <div className="text-sm font-bold chinese-font tracking-widest">塔罗答复</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-purple-400">Tarot Guidance</span>
                </div>
                {followupHistory.map((entry, entryIndex) => {
                  const sections = parseFollowupSections(entry.answer);
                  return (
                    <div key={`${entry.timestamp}-${entryIndex}`} className="space-y-4">
                      <div className="flex flex-col gap-2 px-2">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">追加提问 {entryIndex + 1}</div>
                        <p className="text-sm chinese-font text-slate-600 dark:text-slate-300">{entry.question}</p>
                      </div>
                      {sections.length ? (
                        <div className="space-y-4">
                          {sections.map((section, idx) => (
                            <div key={`${section.title}-${idx}`} className="bg-white/80 dark:bg-slate-950/70 border border-white/10 dark:border-slate-800 rounded-[2rem] p-6 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]">
                              <div className="flex items-center gap-2 text-purple-500/90 mb-3">
                                <h5 className="text-sm font-bold chinese-font tracking-wide">{section.title}</h5>
                              </div>
                              <div className="space-y-2 text-slate-700 dark:text-slate-200 chinese-font text-sm leading-relaxed">
                                {section.body
                                  .split(/\n+/)
                                  .map((line, lineIndex) => (
                                    <p key={`${entryIndex}-${idx}-${lineIndex}`} className="text-left">
                                      {line}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white/80 dark:bg-slate-950/70 border border-purple-500/20 rounded-[2rem] p-6 shadow-inner">
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed chinese-font text-base font-light">
                            {entry.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="px-2 space-y-3 mt-8">
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              <Crown size={18} />
              <h4 className="text-sm font-bold chinese-font tracking-widest uppercase">VIP 特权</h4>
              <button onClick={() => setShowRules(true)} className="ml-1 text-slate-400 hover:text-amber-500 transition-colors"><HelpCircle size={14} /></button>
            </div>
            <button onClick={handleVipClick} disabled={vipEnabled || vipLoading} className={`w-full group relative overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800 transition-all duration-300 text-left flex items-center justify-between p-6 ${vipEnabled ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)] vip-active-glow' : 'bg-white dark:bg-slate-900/60 hover:border-amber-500/50 shadow-sm'}`}>
              <div className="flex flex-col gap-1">
                 <span className={`text-lg font-bold chinese-font tracking-wide ${vipEnabled ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>{vipEnabled ? '尊贵 VIP 用户 · 开运建议已开启' : '查看今日开运穿搭、手串与避坑指南'}</span>
                 <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-light">EXCLUSIVE CELESTIAL GUIDANCE</span>
              </div>
              {vipEnabled ? <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg animate-in zoom-in"><ShieldCheck size={20} /></div> : <Crown size={24} className={`text-slate-400 ${vipLoading ? 'animate-pulse' : 'group-hover:text-amber-500'}`} />}
            </button>
            {vipLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-5">
                <div className="relative w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-[spin_6s_linear_infinite]"></div>
                  <RefreshCw className="text-amber-500 animate-spin" size={24} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-amber-500 chinese-font tracking-[0.3em]">塔罗启示中</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em]">Reading the Tarot Thread</p>
                </div>
                <div className="w-full max-w-xs h-1.5 bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full w-1/3 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-200 animate-[loading-shimmer_1.6s_ease-in-out_infinite]"></div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-amber-600/70 chinese-font">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  牌语回响，正在揭示隐秘线索
                </div>
              </div>
            ) : vipEnabled && analysis.vipData && (
              <div className="mt-6 animate-in slide-in-from-top-4 duration-700">
                <VIPRecommendationSection data={analysis.vipData} />
              </div>
            )}
          </div>
          <div className="flex gap-4 pt-6 max-w-sm mx-auto">
            <button onClick={handleSave} disabled={!analysis || isSaved} className="flex-1 py-5 rounded-2xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all text-indigo-700 disabled:text-slate-400">
              {isSaved ? '已存入档案' : '保存结果'}
            </button>
            <button onClick={handleRestart} className="flex-1 py-5 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50 transition-all text-slate-600">重新占卜</button>
          </div>
        </div>
      )}

      {showRules && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative border border-white/10">
            <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-all p-2"><X size={20} /></button>
            <h3 className="text-2xl font-bold chinese-font text-amber-500 mb-8 mt-2 px-2 text-center">VIP 特权使用规则</h3>
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-2">
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold">1</span>
                <p className="chinese-font font-light">解锁塔罗牌定制化深度推演报告。</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold">2</span>
                <p className="chinese-font font-light">饰品及出行穿搭、家中装饰物推荐。</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold">3</span>
                <p className="chinese-font font-light">每次解锁仅对本次推演有效（按次计费）。</p>
              </div>
            </div>
            <button onClick={() => setShowRules(false)} className="w-full py-5 mt-10 bg-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all text-sm tracking-widest">我知道了</button>
          </div>
        </div>
      )}

      {showPayment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm overflow-hidden flex flex-col items-center">
            <div className="w-full bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 py-8 px-6 flex flex-col items-center rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Sparkles size={28} className="text-amber-400 animate-spin" />
              </div>
              <h3 className="text-white text-lg font-bold chinese-font tracking-[0.4em] mb-3">女祭司箴言</h3>
              <p className="text-slate-300 text-sm chinese-font leading-relaxed text-center">
                “请静心聆听，神谕自深处浮现。三息之后，真言将启。” 
              </p>
              <div className="mt-6 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-purple-500 animate-pulse transition-all duration-300"
                  style={{ width: `${mysticProgress}%` }}
                ></div>
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.5em] text-slate-400">
                {paymentStatus === 'VERIFYING' ? '神谕召唤中' : '真言将临'}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TarotView;
