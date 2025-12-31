
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HuangliData, UserProfile, HistoryRecord } from '@/types';
import { analyzeHuangli } from '@/services/geminiService';
import VIPRecommendationSection from './VIPRecommendationSection';
import { Calendar as CalendarIcon, Sparkles, Compass, ShieldAlert, Heart, Info, Crown, ShieldCheck, X, Star, Zap, User, Check, HelpCircle, RefreshCw } from 'lucide-react';

const AlmanacLoading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const tips = [
    "正在翻阅岁时简牍...",
    "校准二十四节气磁场...",
    "推算天干地支五行流转...",
    "寻访山川地利吉位...",
    "合参命理画像，定制宜忌..."
  ];

  useEffect(() => {
    const pTimer = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + Math.random() * 6 : prev));
    }, 200);
    const tTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 1500);
    return () => {
      clearInterval(pTimer);
      clearInterval(tTimer);
    };
  }, []);

  return (
    <div className="py-24 flex flex-col items-center justify-center gap-12 animate-in fade-in duration-1000">
      <style>{`
        @keyframes bagua-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes branches-rotate { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes ink-pulse { 0%, 100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 0.6; transform: scale(1.1); } }
        @keyframes scroll-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { transform: translateX(-40%); } 100% { transform: translateX(220%); } }
        @keyframes scroll-roll { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
      `}</style>
      <div className="relative w-full max-w-4xl px-6">
          <div className="relative w-full h-[400px] bg-gradient-to-br from-[#10101a] via-[#0b1222] to-[#0a0f1d] border border-amber-500/30 rounded-[2.5rem] shadow-[0_40px_80px_-40px_rgba(15,23,42,0.8)] overflow-hidden">
          {/* 书页/卷轴装饰 */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-40 bg-gradient-to-b from-amber-400/40 to-amber-700/40 rounded-full blur-[1px] border border-amber-500/30 animate-[scroll-roll_6s_ease-in-out_infinite]"></div>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-40 bg-gradient-to-b from-amber-400/40 to-amber-700/40 rounded-full blur-[1px] border border-amber-500/30 animate-[scroll-roll_6s_ease-in-out_infinite]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,183,77,0.08),transparent_45%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] opacity-40"></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-10 gap-8 pt-6 pb-12">
            {/* 上：罗盘动画 */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-red-500/5 rounded-full blur-3xl animate-[ink-pulse_4s_infinite]"></div>
              <div className="absolute inset-0 border border-slate-200/50 dark:border-slate-800 rounded-full animate-[branches-rotate_20s_linear_infinite]">
                {['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'].map((branch, i) => (
                  <div key={branch} className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold chinese-font text-slate-400 dark:text-slate-600" style={{ transformOrigin: 'center 76px', transform: `rotate(${i * 30}deg)` }}>{branch}</div>
                ))}
              </div>
              <div className="absolute inset-7 border border-amber-500/20 rounded-full animate-[bagua-rotate_15s_linear_infinite]">
                {['☰','☱','☲','☳','☴','☵','☶','☷'].map((gua, i) => (
                  <div key={gua} className="absolute top-0 left-1/2 -translate-x-1/2 text-base text-amber-600/60" style={{ transformOrigin: 'center 50px', transform: `rotate(${i * 45}deg)` }}>{gua}</div>
                ))}
              </div>
              <div className="relative w-14 h-14 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-amber-500/30 flex items-center justify-center shadow-2xl overflow-hidden">
                 <div className="absolute inset-0 animate-spin transition-all duration-[3000ms] opacity-80">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-800 dark:fill-amber-500/40">
                      <path d="M50 0 A50 50 0 0 1 50 100 A25 25 0 0 1 50 50 A25 25 0 0 0 50 0" />
                      <circle cx="50" cy="25" r="8" fill="white" />
                      <circle cx="50" cy="75" r="8" className="fill-slate-800 dark:fill-amber-900" />
                    </svg>
                 </div>
                 <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-red-500 to-transparent -translate-x-1/2 origin-bottom rotate-[45deg] opacity-60"></div>
              </div>
            </div>

            {/* 下：文案与进度 */}
            <div className="w-full space-y-6 pb-10">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="px-3 py-1 rounded-full border border-amber-500/30 text-[10px] tracking-[0.4em] text-amber-400">黄历推演中</span>
                <span className="text-[10px] text-slate-500 tracking-[0.3em]">合参命理画像 · 定制宜忌</span>
              </div>
              <div className="min-h-[1.5em] text-center">
                <p className="text-slate-400 chinese-font tracking-[0.3em] text-sm animate-pulse">{tips[tipIndex]}</p>
              </div>
              <div className="text-[11px] text-slate-500 tracking-[0.35em] text-center">翻阅岁时简牍 · 勘定吉凶方位</div>
              <div className="relative pt-1 flex justify-center">
                <div className="relative h-1.5 w-full max-w-[260px] bg-slate-900/80 rounded-full overflow-hidden border border-slate-800">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }}>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shine_2s_infinite]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-[shimmer_1.6s_infinite] opacity-50"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-6 text-[9px] font-mono text-slate-400 uppercase tracking-widest opacity-60">
                <span className="flex items-center gap-1"><Compass size={10} /> Almanac Deduction</span>
                <span className="font-bold text-amber-600">{Math.floor(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HuangliViewProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onSave?: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
  onTriggerOnboarding?: (callback?: () => void) => void;
}

const HuangliView: React.FC<HuangliViewProps> = ({ userProfile, onUpdateProfile, onSave, onTriggerOnboarding }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<HuangliData | null>(null);
  const [loading, setLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [vipEnabled, setVipEnabled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [mysticProgress, setMysticProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const requestIdRef = useRef(0);

  const fetchHuangli = useCallback(async (date: string, isVip: boolean = false) => {
    const requestId = ++requestIdRef.current;
    if (isVip) {
      setVipLoading(true);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const result = await analyzeHuangli(date, userProfile || undefined, isVip);
      if (requestId !== requestIdRef.current) return;
      setData(result);
      if (isVip) setVipEnabled(true);
    } catch (err) { console.error(err); } finally {
      if (requestId !== requestIdRef.current) return;
      if (isVip) setVipLoading(false); else setTimeout(() => setLoading(false), 1200);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchHuangli(selectedDate, false);
    setVipEnabled(false);
    setIsSaved(false);
  }, [selectedDate, fetchHuangli]);

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
      const isProfileComplete = !!(userProfile?.constellation && userProfile?.birthDate && userProfile?.mbti && userProfile?.city);
      if (!isProfileComplete) {
        if (onTriggerOnboarding) {
          onTriggerOnboarding(() => {
            // VIP onboarding完成后，继续VIP分析
            fetchHuangli(selectedDate, true);
          });
        }
      } else {
        fetchHuangli(selectedDate, true);
      }
    }, 3000);
  };

  const handleSave = () => {
    if (!onSave || !data) return;
    onSave({
      type: 'HUANGLI',
      analysis: data
    });
    setIsSaved(true);
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto px-4">
      <style>{`
        .vip-active-glow { animation: vip-glow 2s infinite ease-in-out; }
        @keyframes vip-glow { 0%, 100% { box-shadow: 0 0 10px rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 20px rgba(245,158,11,0.4); border-color: rgba(245,158,11,0.8); } }
        @keyframes loading-shimmer { 0% { transform: translateX(-40%); } 100% { transform: translateX(220%); } }
      `}</style>

      <div className="text-center space-y-1">
        <h2 className="text-5xl bg-gradient-to-r from-red-600 to-amber-600 dark:from-red-400 dark:to-amber-500 bg-clip-text text-transparent calligraphy-font">万年老黄历</h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em] font-light italic">趋吉避凶 · 岁时节律之秘</p>
      </div>

      <div className="bg-white dark:bg-[#0a0a14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col items-center gap-3">
          <label className="text-[10px] font-bold text-slate-500 chinese-font tracking-[0.3em] uppercase">阳历日期选择</label>
          <div className="relative group">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 text-lg font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer shadow-sm chinese-font" />
            <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>

        {loading ? <AlmanacLoading /> : data && (
          <div className="p-8 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-block px-4 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[10px] font-bold tracking-widest border border-red-500/10 mb-2 chinese-font">{data.ganzhi}</div>
              <h3 className="text-4xl font-bold chinese-font text-slate-900 dark:text-slate-100 tracking-[0.1em]">{data.lunarDate}</h3>
              <p className="text-slate-400 dark:text-slate-600 text-xs tracking-widest italic chinese-font">{data.wuxing} · {data.chong}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-100 dark:bg-slate-800 -translate-x-1/2"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><Heart size={16} fill="currentColor" className="opacity-20" /><span className="text-sm font-bold chinese-font tracking-widest underline underline-offset-8 decoration-emerald-500/30">宜</span></div>
                <div className="flex flex-wrap gap-2">{data.yi.map((item, i) => (<span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs chinese-font font-bold">{item}</span>))}</div>
              </div>
              <div className="space-y-4 pl-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400"><ShieldAlert size={16} fill="currentColor" className="opacity-20" /><span className="text-sm font-bold chinese-font tracking-widest underline underline-offset-8 decoration-rose-500/30">忌</span></div>
                <div className="flex flex-wrap gap-2">{data.ji.map((item, i) => (<span key={i} className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-lg text-xs chinese-font font-bold">{item}</span>))}</div>
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-center gap-2 text-amber-500/80">
                <div className="h-[1px] w-8 bg-amber-500/30"></div>
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold">今日解读</span>
                <div className="h-[1px] w-8 bg-amber-500/30"></div>
              </div>
              <p className="text-sm chinese-font text-slate-600 dark:text-slate-300 leading-relaxed text-center px-4">
                {data.summary}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center tracking-widest">
                开运方位：<span className="text-amber-500 font-bold">{data.luckyDirection}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {!loading && data && (
        <div className="px-2 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 mb-1"><Crown size={18} /><h4 className="text-sm font-bold chinese-font tracking-widest uppercase">VIP 特权</h4><button onClick={() => setShowRules(true)} className="ml-1 text-slate-400"><HelpCircle size={14} /></button></div>
          <button 
            onClick={handleVipClick}
            disabled={vipEnabled || vipLoading}
            className={`w-full group relative overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800 transition-all duration-300 text-left flex items-center justify-between p-6 ${vipEnabled ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20 vip-active-glow' : 'bg-white dark:bg-slate-900/60 shadow-sm'}`}
          >
            <div className="flex flex-col gap-1">
               <span className={`text-lg font-bold chinese-font tracking-wide ${vipEnabled ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>{vipEnabled ? '已激活当日深度指引' : '解锁今日穿搭建议'}</span>
               <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-light">EXCLUSIVE CELESTIAL GUIDANCE</span>
            </div>
            {vipEnabled ? <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg animate-in zoom-in"><ShieldCheck size={20} /></div> : <Crown size={24} className={`text-slate-400 ${vipLoading ? 'animate-pulse' : ''}`} />}
          </button>
          {vipLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-5 relative">
              {/* 卷轴装饰 */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-32 bg-gradient-to-b from-amber-400/30 to-amber-700/30 rounded-full border border-amber-500/20 opacity-70"></div>
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-32 bg-gradient-to-b from-amber-400/30 to-amber-700/30 rounded-full border border-amber-500/20 opacity-70"></div>
              {/* 铜钱 */}
              <div className="absolute left-10 top-2 w-8 h-8 rounded-full border border-amber-500/40 text-amber-500/70 flex items-center justify-center text-[10px]">孔</div>
              <div className="absolute right-10 bottom-2 w-7 h-7 rounded-full border border-amber-500/40 text-amber-500/70 flex items-center justify-center text-[10px]">钱</div>
              {/* 朱砂印章 */}
              <div className="absolute right-6 top-6 w-10 h-10 bg-rose-600/20 border border-rose-500/40 rounded-lg rotate-[-8deg] shadow-[0_0_20px_rgba(244,63,94,0.2)]"></div>

              <div className="relative w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-[spin_8s_linear_infinite]"></div>
                <RefreshCw className="text-amber-500 animate-spin" size={24} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-amber-500 chinese-font tracking-[0.3em]">黄历推演中</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em]">Almanac Deduction</p>
              </div>
              <div className="w-full max-w-xs h-1.5 bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
                <div className="h-full w-1/3 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200 animate-[loading-shimmer_1.6s_ease-in-out_infinite]"></div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-amber-600/70 chinese-font">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                岁时简牍翻页中，宜忌即将显现
              </div>
            </div>
          ) : vipEnabled && data.vipData && (
            <div className="mt-6 animate-in slide-in-from-top-4 duration-700">
              <VIPRecommendationSection data={data.vipData} />
            </div>
          )}
        </div>
      )}

      {data && (
        <div className="flex gap-4 pt-6 max-w-sm mx-auto">
          <button onClick={handleSave} disabled={isSaved} className="flex-1 py-5 rounded-2xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all text-indigo-700 disabled:text-slate-400">
            {isSaved ? '已存入档案' : '保存结果'}
          </button>
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
                <p className="chinese-font font-light">解锁老黄历定制化深度推演报告。</p>
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
            <div className="w-full bg-gradient-to-r from-amber-700 via-red-700 to-slate-900 py-8 px-6 flex flex-col items-center rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Star size={26} className="text-amber-300 animate-spin" />
              </div>
              <h3 className="text-white text-lg font-bold chinese-font tracking-[0.4em] mb-3">岁时密诏</h3>
              <p className="text-slate-300 text-sm chinese-font leading-relaxed text-center">
                “三息既满，吉门自开。请静候天机回响。” 
              </p>
              <div className="mt-6 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 animate-pulse transition-all duration-300"
                  style={{ width: `${mysticProgress}%` }}
                ></div>
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.5em] text-slate-400">
                {paymentStatus === 'VERIFYING' ? '天机回响中' : '门扉将启'}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HuangliView;
