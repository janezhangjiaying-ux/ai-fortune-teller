
import React, { useState, useEffect } from 'react';
import { HuangliData, UserProfile } from '../types';
import { analyzeHuangli } from '../services/geminiService';
import VIPRecommendationSection from './VIPRecommendationSection';
import OnboardingForm from './OnboardingForm';
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
      `}</style>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-red-500/5 rounded-full blur-3xl animate-[ink-pulse_4s_infinite]"></div>
        <div className="absolute inset-0 border border-slate-200/50 dark:border-slate-800 rounded-full animate-[branches-rotate_20s_linear_infinite]">
          {['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'].map((branch, i) => (
            <div key={branch} className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold chinese-font text-slate-400 dark:text-slate-600" style={{ transformOrigin: 'center 92px', transform: `rotate(${i * 30}deg)` }}>{branch}</div>
          ))}
        </div>
        <div className="absolute inset-10 border border-amber-500/20 rounded-full animate-[bagua-rotate_15s_linear_infinite]">
          {['☰','☱','☲','☳','☴','☵','☶','☷'].map((gua, i) => (
            <div key={gua} className="absolute top-0 left-1/2 -translate-x-1/2 text-lg text-amber-600/60" style={{ transformOrigin: 'center 56px', transform: `rotate(${i * 45}deg)` }}>{gua}</div>
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
      <div className="w-full max-w-[240px] space-y-5">
        <div className="min-h-[1.5em] flex flex-col items-center">
          <p className="text-slate-600 dark:text-slate-300 chinese-font tracking-[0.4em] text-sm text-center animate-pulse">{tips[tipIndex]}</p>
        </div>
        <div className="relative pt-2">
          <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 text-amber-500/30"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg></div>
          <div className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }}><div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shine_2s_infinite]"></div></div>
          </div>
          <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 text-amber-500/30"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg></div>
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 uppercase tracking-widest opacity-60">
          <span className="flex items-center gap-1"><Compass size={10} /> Almanac Deduction</span>
          <span className="font-bold text-amber-600">{Math.floor(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

interface HuangliViewProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
}

const HuangliView: React.FC<HuangliViewProps> = ({ userProfile, onUpdateProfile }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<HuangliData | null>(null);
  const [loading, setLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [vipEnabled, setVipEnabled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPaymentVerification, setShowPaymentVerification] = useState(false);

  const fetchHuangli = async (date: string, isVip: boolean = false) => {
    if (isVip && data) setVipLoading(true); else setLoading(true);
    try {
      const result = await analyzeHuangli(date, userProfile || undefined, isVip);
      setData(result);
      if (isVip) setVipEnabled(true);
    } catch (err) { console.error(err); } finally {
      if (isVip && data) setVipLoading(false); else setTimeout(() => setLoading(false), 1200);
    }
  };

  useEffect(() => {
    fetchHuangli(selectedDate, false);
    setVipEnabled(false);
  }, [selectedDate]);

  const handleVipClick = () => {
    if (vipEnabled || vipLoading) return;
    setShowPayment(true);
    setPaymentStatus('IDLE');
  };

  const handleConfirmPayment = () => {
    if (process.env.IS_PRODUCTION) {
      // 生产环境：显示支付验证界面
      setShowPayment(false);
      setShowPaymentVerification(true);
    } else {
      // 开发环境：直接模拟支付成功
      setPaymentStatus('VERIFYING');
      setTimeout(() => {
        setPaymentStatus('SUCCESS');
        setVipEnabled(true);
        
        setTimeout(() => {
          setShowPayment(false);
          // 检查用户是否已填写基本画像信息（生日和MBTI）
          const hasBasicProfile = !!(userProfile?.birthDate && userProfile?.mbti);
          if (!hasBasicProfile) {
            setShowProfileForm(true);
          } else {
            fetchHuangli(selectedDate, true);
          }
        }, 800);
      }, 1200);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto px-4">
      <style>{`
        .vip-active-glow { animation: vip-glow 2s infinite ease-in-out; }
        @keyframes vip-glow { 0%, 100% { box-shadow: 0 0 10px rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 20px rgba(245,158,11,0.4); border-color: rgba(245,158,11,0.8); } }
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
          {vipLoading ? <div className="py-12 flex flex-col items-center justify-center gap-4"><RefreshCw className="animate-spin text-amber-500" size={32} /><p className="text-xs text-amber-600/60 chinese-font">推演中...</p></div> : vipEnabled && data.vipData && <div className="mt-6 animate-in slide-in-from-top-4 duration-700"><VIPRecommendationSection data={data.vipData} /></div>}
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
          <div className="w-full max-sm overflow-hidden flex flex-col items-center">
            <div className="w-full bg-[#07C160] py-7 px-4 flex flex-col items-center rounded-t-[2.5rem]"><h3 className="text-white text-xl font-bold tracking-widest">推荐使用微信支付</h3></div>
            <div className="w-full bg-[#0b0e1a] p-10 flex flex-col items-center space-y-8 shadow-2xl"><img src={process.env.IS_PRODUCTION ? "/payment-qr.jpg" : "qr_code.png"} alt="QR Code" onError={(e) => { if (!process.env.IS_PRODUCTION) { (e.target as any).src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Huangli_VIP_0.66"; } }} className="w-60 h-60 rounded-xl bg-white p-2" /><div className="text-center"><span className="text-5xl font-bold text-white tracking-tight">¥ 0.66</span></div></div>
            <div className="w-full bg-[#0b0e1a] p-6 flex flex-col items-center gap-4 rounded-b-[2.5rem] border-t border-white/5 pb-12"><button onClick={paymentStatus === 'IDLE' ? handleConfirmPayment : undefined} className="w-full bg-[#07C160] text-white font-bold py-5 rounded-2xl active:scale-95 transition-all">{paymentStatus === 'IDLE' ? '我已支付' : '核实中...'}</button><button onClick={() => setShowPayment(false)} className="text-slate-500 text-xs mt-2 hover:text-slate-300 transition-all">取消支付</button></div>
          </div>
        </div>
      )}

      {showPaymentVerification && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm overflow-hidden flex flex-col items-center">
            <div className="w-full bg-[#07C160] py-7 px-4 flex flex-col items-center rounded-t-[2.5rem]">
              <h3 className="text-white text-xl font-bold tracking-widest">支付验证</h3>
            </div>
            <div className="w-full bg-[#0b0e1a] p-6 flex flex-col items-center space-y-6 shadow-2xl">
              <div className="text-center text-white space-y-2">
                <p className="text-sm">请完成支付后，上传支付截图或输入交易号</p>
                <p className="text-xs text-slate-400">我们将在24小时内审核并激活VIP功能</p>
              </div>
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-2">交易号（选填）</label>
                  <input
                    type="text"
                    placeholder="请输入微信支付交易号"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#07C160]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-2">支付截图（选填）</label>
                  <div className="w-full h-20 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                    点击上传截图
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-slate-400 space-y-1">
                <p>支付金额：¥0.66</p>
                <p>激活后可获得VIP专属功能</p>
              </div>
            </div>
            <div className="w-full bg-[#0b0e1a] p-6 flex flex-col items-center gap-4 rounded-b-[2.5rem] border-t border-white/5 pb-12">
              <button className="w-full bg-[#07C160] text-white font-bold py-5 rounded-2xl active:scale-95 transition-all">
                提交验证
              </button>
              <button onClick={() => setShowPaymentVerification(false)} className="text-slate-500 text-xs mt-2 hover:text-slate-300 transition-all">
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileForm && (
          <OnboardingForm 
            initialProfile={userProfile} 
            onComplete={(p) => { 
              if (p) onUpdateProfile(p); 
              setShowProfileForm(false); 
              if (vipEnabled) fetchHuangli(selectedDate, true); 
            }} 
          />
      )}
    </div>
  );
};

export default HuangliView;
