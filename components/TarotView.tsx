
import React, { useState, useEffect } from 'react';
import { TarotCard, TarotAnalysis, Gender, HistoryRecord, UserProfile } from '@/types';
import { analyzeTarot } from '@/services/geminiService';
import VIPRecommendationSection from './VIPRecommendationSection';
import TarotLoading from './TarotLoading';
import { Sparkles, RefreshCw, BrainCircuit, Bookmark, ShieldCheck, Crown, X, Star, HelpCircle } from 'lucide-react';

const TAROT_IMAGES: Record<string, string> = {
  "愚者": "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  "魔术师": "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  "女教皇": "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  "皇后": "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
  "皇帝": "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  "教皇": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  "恋人": "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg",
  "战车": "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
  "力量": "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
  "隐士": "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
  "命运之轮": "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
  "正义": "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
  "倒吊人": "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
  "死神": "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
  "节制": "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
  "恶魔": "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
  "高塔": "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
  "星星": "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
  "月亮": "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
  "太阳": "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
  "审判": "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
  "世界": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg"
};
const MAJOR_ARCANA = Object.keys(TAROT_IMAGES);

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
  onSave?: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
  onTriggerOnboarding?: (callback?: () => void) => void;
  customAnalyze?: (question: string, cards: TarotCard[], gender: Gender, vip: boolean) => Promise<TarotAnalysis>;
  initialCards?: TarotCard[];
  initialAnalysis?: TarotAnalysis;
}

const TarotView: React.FC<TarotViewProps> = ({ userProfile, onUpdateProfile, onSave, onTriggerOnboarding, customAnalyze, initialCards, initialAnalysis }) => {
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
    if (forceVip && analysis) setVipLoading(true); else setLoading(true);
    try {
      const isVip = forceVip || vipEnabled;
      const result = await analyzeTarot(question, pickedCards, gender, (userProfile || undefined), isVip);
      setAnalysis(result);
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
    setTimeout(() => setPickingPhase('FAN'), 1500); 
  };
  
  const handlePickCard = (idx: number) => {
    if (selectedIndices.includes(idx) || selectedIndices.length >= 3) return;
    const newIndices = [...selectedIndices, idx];
    setSelectedIndices(newIndices);
    if (newIndices.length === 3) {
      setTimeout(() => {
        const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3).map(name => ({ name, image: TAROT_IMAGES[name], isUpright: Math.random() > 0.3 }));
        setPickedCards(selected);
        setPickingPhase('DONE');
      }, 800);
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
  };

  const handleSave = () => {
    if (!onSave || !analysis) return;
    onSave({
      type: 'TAROT',
      analysis,
      pickedCards
    });
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
