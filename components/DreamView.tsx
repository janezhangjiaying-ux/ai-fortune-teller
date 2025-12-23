
import React, { useState, useEffect } from 'react';
import { DreamAnalysis, InterpretationStyle, UserProfile, HistoryRecord } from '../types';
import { analyzeDream } from '../services/geminiService';
import VIPRecommendationSection from './VIPRecommendationSection';
import OnboardingForm from './OnboardingForm';
import { Sparkles, RefreshCw, Crown, ShieldCheck, X, HelpCircle, Moon, Star } from 'lucide-react';

interface DreamViewProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onSave?: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
  customAnalyze?: (content: string, style: InterpretationStyle, vip: boolean) => Promise<DreamAnalysis>;
  initialAnalysis?: DreamAnalysis | null;
}

const DreamView: React.FC<DreamViewProps> = ({ userProfile, onUpdateProfile, onSave, customAnalyze, initialAnalysis }) => {
  const [content, setContent] = useState(initialAnalysis?.dreamContent || '');
  const [style, setStyle] = useState<InterpretationStyle>('ZHOUGONG');
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(initialAnalysis || null);
  const [loading, setLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [vipEnabled, setVipEnabled] = useState(!!initialAnalysis?.vipData);
  const [showPayment, setShowPayment] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [showPaymentVerification, setShowPaymentVerification] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // 新增：加载进度和文案状态
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleVipClick = () => { if (vipEnabled || vipLoading) return; setShowPayment(true); setPaymentStatus('IDLE'); };

  const handleSave = () => {
    if (!analysis || !onSave) return;
    onSave({
      type: 'DREAM',
      analysis: analysis
    });
    setIsSaved(true);
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
          } else if (analysis) {
            handleAnalyze(true);
          }
        }, 800);
      }, 1200);
    }
  };

  // 新增：模拟加载进度和动态文案
  const simulateLoadingProgress = () => {
    const messages = [
      "正在连接梦境数据库...",
      "分析梦境符号与意象...",
      "解读潜意识信息...",
      "计算梦境能量场...",
      "生成个性化解读...",
      "整理解析结果..."
    ];
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // 随机增加5-20的进度
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setLoadingProgress(Math.min(progress, 100));
      setLoadingMessage(messages[Math.floor(progress / 100 * messages.length)] || messages[messages.length - 1]);
    }, 800);
    
    return interval;
  };

  const handleAnalyze = async (forceVip: boolean = false) => {
    if (!content.trim()) return;
    if (forceVip && analysis) setVipLoading(true); else setLoading(true);
    
    // 开始模拟进度
    const progressInterval = simulateLoadingProgress();
    
    try {
      const isVip = forceVip || vipEnabled;
      const result = await analyzeDream(content, style, (userProfile || undefined), isVip);
      setAnalysis(result);
      if (isVip) setVipEnabled(true);
    } catch (err) { 
      console.error(err); 
    } finally { 
      clearInterval(progressInterval);
      setLoading(false); 
      setVipLoading(false);
      setLoadingProgress(0);
      setLoadingMessage('');
    }
  };

  const reset = () => { setContent(''); setAnalysis(null); setVipEnabled(false); };

  // 新增：梦境解析加载组件
  const DreamAnalysisLoading = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-500 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 space-y-8 text-center">
          {/* 图标和标题 */}
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Moon size={32} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold chinese-font text-slate-900 dark:text-white tracking-widest">
                梦境解析中
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">
                AI 正在深度解读你的梦境
              </p>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-4">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">{Math.round(loadingProgress)}%</span>
              <span className="font-medium">完成</span>
            </div>
          </div>

          {/* 动态文案 */}
          <div className="space-y-3 min-h-[3rem] flex items-center justify-center">
            <p className="text-lg font-light chinese-font text-slate-700 dark:text-slate-300 italic animate-in fade-in duration-500">
              {loadingMessage || "正在准备解析你的梦境..."}
            </p>
          </div>

          {/* 提示信息 */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
              <Star size={16} className="animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">深度解析进行中</span>
              <Star size={16} className="animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI正在运用{style === 'ZHOUGONG' ? '周公解梦' : '西方心理学'}理论，结合你的画像信息，为你提供独一无二的梦境解读
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-4xl mx-auto px-4">
      <style>{`
        .vip-active-glow { animation: vip-glow 2s infinite ease-in-out; }
        @keyframes vip-glow { 0%, 100% { box-shadow: 0 0 10px rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 20px rgba(245,158,11,0.4); border-color: rgba(245,158,11,0.8); } }
      `}</style>
      
      {/* 显示加载状态 */}
      {loading && <DreamAnalysisLoading />}
      
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent calligraphy-font">梦的深度解析</h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em] font-light italic">洞察潜意识预示，拨开梦境迷雾</p>
      </div>

      <div className="max-w-xl mx-auto space-y-10">
        {!analysis ? (
          <div className="space-y-6">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="请描述你的梦境细节..." className="w-full bg-white dark:bg-[#0a0a14] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 min-h-[220px] text-xl font-light text-center shadow-inner italic focus:outline-none" />
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setStyle('ZHOUGONG')} className={`py-4 rounded-2xl font-bold chinese-font transition-all ${style === 'ZHOUGONG' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-slate-200'}`}>周公解梦</button>
               <button onClick={() => setStyle('FREUD')} className={`py-4 rounded-2xl font-bold chinese-font transition-all ${style === 'FREUD' ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 hover:bg-slate-200'}`}>西方心理学派</button>
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
            <div className="p-10 border border-slate-100 dark:border-slate-800 rounded-[3rem] bg-white/5 dark:bg-slate-900/20 relative shadow-sm"><div className="flex items-center gap-3 mb-8 text-indigo-500"><Sparkles size={24} className="text-amber-500" /><h4 className="chinese-font text-2xl font-bold tracking-widest">{style === 'FREUD' ? '心理学深度分析' : '民俗深度解析'}</h4></div><p className="text-slate-800 dark:text-slate-200 leading-relaxed chinese-font text-xl font-light tracking-widest text-justify">{analysis.mainAnalysis}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem]"><h5 className="text-xs font-bold text-indigo-600 uppercase mb-4">潜意识预兆</h5><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">{analysis.hiddenMeaning}</p></div><div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-[2.5rem]"><h5 className="text-xs font-bold text-purple-600 uppercase mb-4">现实生活指引</h5><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">{analysis.lifeAdvice}</p></div></div>
            
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
              {vipLoading ? <div className="py-12 flex flex-col items-center justify-center gap-4"><RefreshCw className="animate-spin text-amber-500" size={32} /><p className="text-xs text-amber-600/60 chinese-font">推演中...</p></div> : vipEnabled && analysis.vipData && <div className="mt-8 animate-in slide-in-from-top-4 duration-1000"><VIPRecommendationSection data={analysis.vipData} /></div>}
              
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={handleSave}
                  disabled={isSaved}
                  className={`flex-1 py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all font-bold text-sm tracking-widest uppercase border ${isSaved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20'}`}
                >
                  <History size={20} /> {isSaved ? '已存入万象' : '存入万象档案'}
                </button>
              </div>
            </div>
            <div className="flex gap-4 pt-8"><button onClick={reset} className="flex-1 py-5 rounded-[2rem] border border-slate-200 font-bold text-sm tracking-widest text-slate-500 hover:bg-slate-50">重新解析</button></div>
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in"><div className="w-full max-sm overflow-hidden flex flex-col items-center"><div className="w-full bg-[#07C160] py-7 px-4 flex flex-col items-center rounded-t-[2.5rem]"><h3 className="text-white text-xl font-bold chinese-font">推荐使用微信支付</h3></div><div className="w-full bg-[#0b0e1a] p-10 flex flex-col items-center space-y-8 shadow-2xl"><img src={process.env.IS_PRODUCTION ? "/payment-qr.jpg" : "qr_code.png"} alt="QR" onError={(e) => { if (!process.env.IS_PRODUCTION) { (e.target as any).src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Dream_VIP_0.66"; } }} className="w-60 h-60 rounded-xl bg-white p-2" /><div className="text-center"><span className="text-5xl font-bold text-white tracking-tight">¥ 0.66</span></div></div><div className="w-full bg-[#0b0e1a] p-6 flex flex-col items-center gap-4 rounded-b-[2.5rem] border-t border-white/5 pb-12"><button onClick={paymentStatus === 'IDLE' ? handleConfirmPayment : undefined} className="w-full bg-[#07C160] text-white font-bold py-5 rounded-2xl active:scale-95">{paymentStatus === 'IDLE' ? '我已扫码支付' : '核实中...'}</button><button onClick={() => setShowPayment(false)} className="text-slate-500 text-xs mt-2">取消支付</button></div></div></div>
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
              if (vipEnabled) handleAnalyze(true); 
            }} 
          />
      )}
    </div>
  );
};

export default DreamView;
