
import React, { useState, useEffect, useCallback } from 'react';
import { DreamAnalysis, InterpretationStyle, UserProfile, HistoryRecord } from '@/types';
import { analyzeDream } from '@/services/geminiService';
import VIPRecommendationSection from './VIPRecommendationSection';
import OnboardingForm from './OnboardingForm';
import DreamLoading from './DreamLoading';
import { Sparkles, RefreshCw, Crown, ShieldCheck, X, HelpCircle, Moon, Star, BookOpen, Brain, Layers, Cpu, Globe } from 'lucide-react';

interface DreamViewProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onSave?: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
  onTriggerOnboarding?: () => void;
  customAnalyze?: (content: string, style: InterpretationStyle, vip: boolean) => Promise<DreamAnalysis>;
  initialAnalysis?: DreamAnalysis | null;
}

const DreamView: React.FC<DreamViewProps> = ({ userProfile, onUpdateProfile, onSave, onTriggerOnboarding, customAnalyze, initialAnalysis }) => {
  const [content, setContent] = useState(initialAnalysis?.dreamContent || '');
  const [style, setStyle] = useState<InterpretationStyle>('ZHOUGONG');
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(initialAnalysis || null);
  const [analysesByStyle, setAnalysesByStyle] = useState<Record<InterpretationStyle, DreamAnalysis>>(
    initialAnalysis ? { [initialAnalysis.style]: initialAnalysis } as Record<InterpretationStyle, DreamAnalysis> : {} as Record<InterpretationStyle, DreamAnalysis>
  );
  const [compareStyle, setCompareStyle] = useState<InterpretationStyle | null>(null);
  const [loading, setLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [vipEnabled, setVipEnabled] = useState(!!initialAnalysis?.vipData);
  const [showPayment, setShowPayment] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [mysticProgress, setMysticProgress] = useState(0);
  const [vipTipIndex, setVipTipIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!showPayment) return;
    setMysticProgress(0);
    const timer = setInterval(() => {
      setMysticProgress(prev => (prev < 92 ? prev + Math.random() * 8 + 2 : prev));
    }, 260);
    return () => clearInterval(timer);
  }, [showPayment]);

  useEffect(() => {
    if (!vipLoading) return;
    setVipTipIndex(0);
    const tipTimer = setInterval(() => {
      setVipTipIndex(prev => (prev + 1) % 3);
    }, 1800);
    return () => clearInterval(tipTimer);
  }, [vipLoading]);

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

  const styleOptions = [
    { key: 'ZHOUGONG', label: '周公解梦', icon: BookOpen, active: 'bg-emerald-600', accent: 'text-emerald-500' },
    { key: 'FREUD', label: '弗洛伊德', icon: Brain, active: 'bg-rose-600', accent: 'text-rose-500' },
    { key: 'JUNG', label: '荣格', icon: Layers, active: 'bg-indigo-600', accent: 'text-indigo-500' },
    { key: 'COGNITIVE', label: '认知学派', icon: Cpu, active: 'bg-sky-600', accent: 'text-sky-500' },
    { key: 'ANTHROPOLOGY', label: '文化人类学', icon: Globe, active: 'bg-amber-600', accent: 'text-amber-500' }
  ] as const;

  const handleAnalyze = async (forceVip: boolean = false, overrideStyle?: InterpretationStyle) => {
    if (!content.trim()) return;
    if (forceVip && analysis) setVipLoading(true); else setLoading(true);
    try {
      const isVip = forceVip || vipEnabled;
      const finalStyle = overrideStyle || style;
      const result = await analyzeDream(content, finalStyle, (userProfile || undefined), isVip);
      setAnalysis(result);
      setAnalysesByStyle(prev => ({ ...prev, [finalStyle]: result }));
      if (overrideStyle) setStyle(overrideStyle);
      if (!compareStyle && analysis && analysis.style !== finalStyle) {
        setCompareStyle(analysis.style);
      }
      if (isVip) setVipEnabled(true);
    } catch (err) { console.error(err); } finally { setLoading(false); setVipLoading(false); }
  };

  const reset = () => { setContent(''); setAnalysis(null); setVipEnabled(false); setIsSaved(false); };

  const handleSave = () => {
    if (!onSave || !analysis) return;
    onSave({
      type: 'DREAM',
      analysis
    });
    setIsSaved(true);
  };

  // 显示加载界面
  if (loading) {
    return <DreamLoading />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto px-4">
      <style>{`
        .vip-active-glow { animation: vip-glow 2s infinite ease-in-out; }
        @keyframes vip-glow { 0%, 100% { box-shadow: 0 0 10px rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 20px rgba(245,158,11,0.4); border-color: rgba(245,158,11,0.8); } }
        @keyframes loading-shimmer { 0% { transform: translateX(-40%); } 100% { transform: translateX(220%); } }
        @keyframes dream-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent calligraphy-font">梦的深度解析</h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em] font-light italic">洞察潜意识预示，拨开梦境迷雾</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        {!analysis ? (
          <div className="space-y-6">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="请描述你的梦境细节..." className="w-full bg-white dark:bg-[#0a0a14] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 min-h-[220px] text-xl font-light text-center shadow-inner italic focus:outline-none" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {styleOptions.map((opt) => {
                 const Icon = opt.icon;
                 const isActive = style === opt.key;
                 return (
                   <button
                     key={opt.key}
                     onClick={() => setStyle(opt.key as InterpretationStyle)}
                     className={`py-3 px-4 rounded-2xl font-bold chinese-font transition-all text-sm flex items-center justify-center gap-2 ${
                       isActive
                         ? `${opt.active} text-white shadow-lg scale-105`
                         : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-slate-200'
                     }`}
                   >
                     <Icon size={16} className={isActive ? 'text-white' : opt.accent} />
                     {opt.label}
                   </button>
                 );
               })}
            </div>
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1"><Crown size={12} /> VIP 特权</span>
                  <button onClick={() => setShowRules(true)} className="text-slate-400 hover:text-amber-500 transition-colors"><HelpCircle size={12} /></button>
                </div>
                <button 
                  onClick={handleVipClick} 
                  className={`w-full py-4 px-6 rounded-2xl border flex items-center justify-between transition-all duration-500 ${
                    vipEnabled 
                    ? 'bg-amber-500/10 border-amber-500/60 text-amber-600 vip-active-glow' 
                    : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-amber-500/30 shadow-inner'
                  }`}
                >
                  <span className="text-[10px] font-bold chinese-font">{vipEnabled ? '开运已激活' : '解锁深度避坑指南'}</span>
                  {vipEnabled ? <ShieldCheck size={16} className="text-amber-500" /> : <Crown size={16} />}
                </button>
            </div>

            <button onClick={() => handleAnalyze()} disabled={loading || !content.trim()} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-6 rounded-[2rem] shadow-xl uppercase text-sm tracking-[0.3em] active:scale-95 transition-all">{loading ? <RefreshCw className="animate-spin mx-auto" /> : '开始解析'}</button>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-slate-900/40 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-[4rem] p-12 text-center shadow-sm"><p className="chinese-font text-3xl font-light italic text-slate-900 dark:text-slate-100 tracking-wide">“{content}”</p></div>
            <div className="p-10 border border-slate-100 dark:border-slate-800 rounded-[3rem] bg-white/5 dark:bg-slate-900/20 relative shadow-sm"><div className="flex items-center gap-3 mb-8 text-indigo-500"><Sparkles size={24} className="text-amber-500" /><h4 className="chinese-font text-2xl font-bold tracking-widest">{({
              ZHOUGONG: '周公解梦深度解析',
              FREUD: '弗洛伊德精神分析',
              JUNG: '荣格原型解析',
              COGNITIVE: '认知学派解析',
              ANTHROPOLOGY: '文化人类学解析'
            } as Record<InterpretationStyle, string>)[style]}</h4></div><p className="text-slate-800 dark:text-slate-200 leading-relaxed chinese-font text-xl font-light tracking-widest text-justify">{analysis.mainAnalysis}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem]"><h5 className="text-xs font-bold text-indigo-600 uppercase mb-4">潜意识预兆</h5><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">{analysis.hiddenMeaning}</p></div><div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-[2.5rem]"><h5 className="text-xs font-bold text-purple-600 uppercase mb-4">现实生活指引</h5><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">{analysis.lifeAdvice}</p></div></div>
            
            <div className="px-2 space-y-4 pt-6">
              <div className="flex items-center gap-2 text-slate-400">
                <Moon size={16} className="text-amber-500" />
                <h4 className="text-xs font-bold chinese-font tracking-widest uppercase">换一种派系再解读</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {styleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = style === opt.key;
                  return (
                    <button
                      key={`detail-${opt.key}`}
                      onClick={() => handleAnalyze(false, opt.key as InterpretationStyle)}
                      className={`py-3 px-4 rounded-2xl font-bold chinese-font transition-all text-sm flex items-center justify-center gap-2 ${
                        isActive
                          ? `${opt.active} text-white shadow-lg scale-105`
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-white' : opt.accent} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {Object.keys(analysesByStyle).length > 1 && (
              <div className="px-2 space-y-4 pt-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <Star size={16} className="text-amber-500" />
                  <h4 className="text-xs font-bold chinese-font tracking-widest uppercase">对比视图</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {styleOptions
                    .filter(opt => opt.key !== style && analysesByStyle[opt.key])
                    .map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = compareStyle === opt.key;
                      return (
                        <button
                          key={`compare-${opt.key}`}
                          onClick={() => setCompareStyle(opt.key as InterpretationStyle)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold chinese-font flex items-center gap-2 transition-all ${
                            isSelected ? `${opt.active} text-white` : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <Icon size={14} className={isSelected ? 'text-white' : opt.accent} />
                          {opt.label}
                        </button>
                      );
                    })}
                </div>

                {compareStyle && analysesByStyle[compareStyle] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/5 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-[2rem]">
                      <h5 className="text-xs font-bold text-indigo-500 uppercase mb-4">当前解读</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{analysis.mainAnalysis}</p>
                    </div>
                    <div className="p-6 bg-white/5 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-[2rem]">
                      <h5 className="text-xs font-bold text-amber-500 uppercase mb-4">对比解读</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{analysesByStyle[compareStyle].mainAnalysis}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="px-2 space-y-4 pt-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Crown size={18} />
                <h4 className="text-sm font-bold chinese-font uppercase">VIP 特权</h4>
                <button onClick={() => setShowRules(true)} className="ml-1 text-slate-400 hover:text-amber-500 transition-colors"><HelpCircle size={14} /></button>
              </div>
              <button 
                onClick={handleVipClick} 
                disabled={vipEnabled || vipLoading} 
                className={`w-full group relative overflow-hidden rounded-[2rem] border transition-all duration-500 flex items-center justify-between p-7 ${
                  vipEnabled 
                  ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20 vip-active-glow' 
                  : 'bg-white dark:bg-slate-900/60 shadow-sm'
                }`}
              >
                <div className="flex flex-col gap-1">
                   <span className={`text-xl font-bold chinese-font tracking-wide ${vipEnabled ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>{vipEnabled ? '尊贵 VIP 用户 · 开运建议已开启' : '查看今日开运穿搭、手串与避坑指南'}</span>
                   <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-light">GET PERSONAL LUCK & STYLE GUIDANCE</span>
                </div>
                {vipEnabled ? <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white animate-in zoom-in shadow-lg"><ShieldCheck size={24} /></div> : <Crown size={28} className={`text-slate-400 ${vipLoading ? 'animate-pulse' : ''}`} />}
              </button>
              {vipLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-5">
                  <div className="relative w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-[dream-orbit_8s_linear_infinite]"></div>
                    <Moon size={22} className="text-amber-400 animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-400/80 animate-pulse"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-amber-500 chinese-font tracking-[0.3em]">梦境回响中</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em]">Dream Symbols Aligning</p>
                  </div>
                  <div className="w-full max-w-xs h-1.5 bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full w-1/3 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-200 animate-[loading-shimmer_1.6s_ease-in-out_infinite]"></div>
                  </div>
                  <div className="text-[10px] text-amber-600/70 chinese-font text-center min-h-[1.5rem]">
                    {[
                      '潜意识低语浮现，线索即将成形',
                      '梦中意象正在归位，情绪脉络渐次清晰',
                      '请稍候片刻，答案将以象征之语显现'
                    ][vipTipIndex]}
                  </div>
                </div>
              ) : vipEnabled && analysis.vipData && (
                <div className="mt-8 animate-in slide-in-from-top-4 duration-1000">
                  <VIPRecommendationSection data={analysis.vipData} />
                </div>
              )}
            </div>
            <div className="flex gap-4 pt-8">
              <button onClick={handleSave} disabled={!analysis || isSaved} className="flex-1 py-5 rounded-[2rem] border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm tracking-widest text-indigo-700 disabled:text-slate-400">
                {isSaved ? '已存入档案' : '保存结果'}
              </button>
              <button onClick={reset} className="flex-1 py-5 rounded-[2rem] border border-slate-200 font-bold text-sm tracking-widest text-slate-500 hover:bg-slate-50">重新解析</button>
            </div>
          </div>
        )}
      </div>

      {showRules && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative border border-white/10">
            <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-all p-2"><X size={20} /></button>
            <h3 className="text-2xl font-bold chinese-font text-amber-500 mb-8 mt-2 px-2 text-center">VIP 特权使用规则</h3>
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-2">
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold">1</span>
                <p className="chinese-font font-light">解锁梦境解析定制化深度推演报告。</p>
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
            <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 py-8 px-6 flex flex-col items-center rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Moon size={26} className="text-amber-400 animate-spin" />
              </div>
              <h3 className="text-white text-lg font-bold chinese-font tracking-[0.4em] mb-3">梦境门扉</h3>
              <p className="text-slate-300 text-sm chinese-font leading-relaxed text-center">
                “雾起三息，梦中之门将自行开启。” 
              </p>
              <div className="mt-6 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 animate-pulse transition-all duration-300"
                  style={{ width: `${mysticProgress}%` }}
                ></div>
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.5em] text-slate-400">
                {paymentStatus === 'VERIFYING' ? '灵息汇聚中' : '门扉将启'}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DreamView;
