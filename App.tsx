
import React, { useState, useEffect } from 'react';
import UserInfoForm from './components/UserInfoForm';
import PalaceBox from './components/PalaceBox';
import TarotView from './components/TarotView';
import DreamView from './components/DreamView';
import HuangliView from './components/HuangliView';
import ModeSelection from './components/ModeSelection';
import HistoryView from './components/HistoryView';
import OnboardingForm from './components/OnboardingForm';
import CelestialLoading from './components/CelestialLoading';
import { MysticTarotIcon, ZiweiWheelIcon, DreamInterpretationIcon } from './components/Icons';
import { UserInfo, Palace, AIAnalysis, HistoryRecord, DreamAnalysis, TarotAnalysis, UserProfile, Gender, InterpretationStyle, TarotCard, SaveRecordPayload } from './types';
import { calculateChart } from './utils/ziweiEngine';
import { analyzeDestiny, analyzeTarot, analyzeDream, analyzeZiweiQuestion } from './services/geminiService';
import { 
  Sparkles, 
  ArrowLeft, 
  CalendarDays,
  History,
  Sun,
  Moon,
  Settings,
  Brain,
  Briefcase,
  Coins,
  Heart as HeartIcon,
  Activity,
  Lightbulb,
  MessageCircle,
  RefreshCw
} from 'lucide-react';

type ViewMode = 'ASTROLOGY' | 'TAROT' | 'DREAM' | 'HUANGLI' | 'HISTORY' | 'PROFILE';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null | undefined>(undefined);
  const [selectedMode, setSelectedMode] = useState<ViewMode | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [chart, setChart] = useState<Palace[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [ziweiQuestion, setZiweiQuestion] = useState('');
  const [ziweiAnswer, setZiweiAnswer] = useState('');
  const [ziweiAskError, setZiweiAskError] = useState<string | null>(null);
  const [ziweiAsking, setZiweiAsking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [lastAstrologyRecordId, setLastAstrologyRecordId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  const [historicalTarot, setHistoricalTarot] = useState<{ cards: TarotCard[], analysis: TarotAnalysis, followupQuestion?: string, followupAnswer?: string, followupCards?: TarotCard[], followups?: { question: string; answer: string; cards: TarotCard[]; timestamp: number }[] } | null>(null);
  const [historicalDream, setHistoricalDream] = useState<DreamAnalysis | null>(null);
  const [historicalHuangli, setHistoricalHuangli] = useState<HuangliData | null>(null);
  const [historicalHuangliPlanInput, setHistoricalHuangliPlanInput] = useState<string | null>(null);
  const [historicalHuangliPlanAnswer, setHistoricalHuangliPlanAnswer] = useState<string | null>(null);
  const [previousMode, setPreviousMode] = useState<ViewMode | null>(null);
  const [showGlobalOnboarding, setShowGlobalOnboarding] = useState(false);
  const [profilePreviousMode, setProfilePreviousMode] = useState<ViewMode | null>(null);
  const [vipOnboardingCallback, setVipOnboardingCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error(e);
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }
    const savedRecords = localStorage.getItem('destiny_records');
    if (savedRecords) {
      try { setRecords(JSON.parse(savedRecords)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('destiny_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    setZiweiQuestion('');
    setZiweiAnswer('');
    setZiweiAskError(null);
    setZiweiAsking(false);
  }, [analysis, selectedMode]);

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('user_profile', JSON.stringify(profile));
  };

  const handleCompleteOnboarding = (profile: UserProfile | null) => {
    // 即使跳过，也存入一个空对象表示已引导过，防止每次刷新都弹出
    const finalProfile = profile || { constellation: '', birthDate: '', mbti: '', city: '' };
    handleUpdateProfile(finalProfile);
    
    // 清除临时的VIP状态
    localStorage.removeItem('vip_onboarding_pending');
    
    // 如果有VIP回调，执行它（用于VIP onboarding）
    if (vipOnboardingCallback) {
      vipOnboardingCallback();
      setVipOnboardingCallback(null);
      setShowGlobalOnboarding(false);
      return;
    }
    
    // 恢复到之前的页面
    if (previousMode) {
      setSelectedMode(previousMode);
      setPreviousMode(null);
    }
    setShowGlobalOnboarding(false);
  };

  const triggerOnboarding = (callback?: () => void) => {
    setPreviousMode(selectedMode);
    setVipOnboardingCallback(() => callback);
    // 保存临时的VIP状态，避免刷新丢失
    localStorage.setItem('vip_onboarding_pending', 'true');
    setShowGlobalOnboarding(true);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleModeSelect = (mode: ViewMode) => {
    setSelectedMode(mode);
    setIsSaved(false);
    setHistoricalTarot(null);
    setHistoricalDream(null);
    setHistoricalHuangli(null);
  };

  const handleStartAstrology = (info: UserInfo) => {
    setUser(info);
    const generatedChart = calculateChart(info);
    setChart(generatedChart);
    const mainIdx = generatedChart.findIndex(p => p.name === '命宫');
    setSelectedPalace(mainIdx);
    performAIAnalysis(info, generatedChart);
  };

  const performAIAnalysis = async (info: UserInfo, currentChart: Palace[]) => {
    setIsAnalyzing(true);
    setIsSaved(false);
    setLastAstrologyRecordId(null);
    setAnalysisError(null);
    try {
      const result = await analyzeDestiny(info, currentChart, (userProfile?.constellation ? userProfile : undefined));
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setAnalysisError((err as Error).message || 'AI解析失败，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleZiweiAsk = async () => {
    setZiweiAskError(null);
    if (!ziweiQuestion.trim()) {
      setZiweiAskError('请先写下你想问的问题');
      return;
    }
    if (!user || !analysis) {
      setZiweiAskError('请先完成命盘推演');
      return;
    }
    setZiweiAsking(true);
    try {
      const answer = await analyzeZiweiQuestion(
        user,
        chart,
        analysis,
        ziweiQuestion.trim(),
        userProfile?.constellation ? userProfile : undefined
      );
      setZiweiAnswer(answer);
      setIsSaved(false);
    } catch (err: any) {
      console.error(err);
      setZiweiAskError(err?.message || 'AI分析服务暂时不可用，请稍后重试。');
    } finally {
      setZiweiAsking(false);
    }
  };

  const ziweiSections = ziweiAnswer
    ? ziweiAnswer
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
        })
    : [];

  const handleSaveRecord = (recordData: SaveRecordPayload) => {
    const { replaceId, ...payload } = recordData;
    const timestamp = Date.now();
    if (replaceId) {
      let replaced = false;
      setRecords(prev => {
        const next = prev.map(record => {
          if (record.id !== replaceId) return record;
          replaced = true;
          return { ...record, ...payload, timestamp };
        });
        if (!replaced) {
          const fallback: HistoryRecord = {
            ...(payload as Omit<HistoryRecord, 'id' | 'timestamp'>),
            id: replaceId,
            timestamp
          };
          return [...next, fallback];
        }
        return next;
      });
      setIsSaved(true);
      return replaceId;
    }
    const newRecord: HistoryRecord = {
      ...(payload as Omit<HistoryRecord, 'id' | 'timestamp'>),
      id: Math.random().toString(36).substr(2, 9),
      timestamp
    };
    setRecords(prev => [...prev, newRecord]);
    setIsSaved(true);
    return newRecord.id;
  };

  const handleSelectHistoricalRecord = (record: HistoryRecord) => {
    setIsSaved(true);
    if (record.type === 'ASTROLOGY') {
      setUser(record.userInfo || null);
      setChart(record.chart || []);
      setAnalysis(record.analysis as AIAnalysis);
      setZiweiQuestion(record.followupQuestion || '');
      setZiweiAnswer(record.followupAnswer || '');
      setZiweiAskError(null);
      setZiweiAsking(false);
      setSelectedMode('ASTROLOGY');
      const mainIdx = (record.chart || []).findIndex(p => p.name === '命宫');
      setSelectedPalace(mainIdx !== -1 ? mainIdx : 0);
    } else if (record.type === 'TAROT') {
      setHistoricalTarot({
        cards: record.pickedCards || [],
        analysis: record.analysis as TarotAnalysis,
        followupQuestion: record.tarotFollowupQuestion || '',
        followupAnswer: record.tarotFollowupAnswer || '',
        followupCards: record.tarotFollowupCards || [],
        followups: record.tarotFollowups || []
      });
      setSelectedMode('TAROT');
    } else if (record.type === 'DREAM') {
      setHistoricalDream(record.analysis as DreamAnalysis);
      setSelectedMode('DREAM');
    } else if (record.type === 'HUANGLI') {
      setHistoricalHuangli(record.analysis as HuangliData);
      setHistoricalHuangliPlanInput(record.huangliPlanInput || '');
      setHistoricalHuangliPlanAnswer(record.huangliPlanAnswer || '');
      setSelectedMode('HUANGLI');
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleBack = () => {
    if (selectedMode === 'ASTROLOGY' && user) {
      setUser(null);
      setAnalysis(null);
      setIsSaved(false);
    } else {
      setSelectedMode(null);
      setHistoricalTarot(null);
      setHistoricalDream(null);
      setHistoricalHuangli(null);
      setHistoricalHuangliPlanInput(null);
      setHistoricalHuangliPlanAnswer(null);
    }
  };

  if (userProfile === undefined) return null;

  if (userProfile === null) {
    return <OnboardingForm onComplete={handleCompleteOnboarding} />;
  }

  const gridPositions = [
    { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, 
    { r: 3, c: 4 }, { r: 2, c: 4 }, { r: 1, c: 4 }, 
    { r: 1, c: 3 }, { r: 1, c: 2 }, { r: 1, c: 1 }, 
    { r: 2, c: 1 }, { r: 3, c: 1 }                  
  ];

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#060608] transition-colors duration-500">
        <ModeSelection
          onSelect={handleModeSelect}
          onToggleTheme={toggleTheme}
          theme={theme}
          onOpenProfile={() => setShowGlobalOnboarding(true)}
          onOpenHistory={() => setSelectedMode('HISTORY')}
        />
        {showGlobalOnboarding && (
          <OnboardingForm
            onComplete={handleCompleteOnboarding}
            initialProfile={userProfile}
            onClose={() => {
              setShowGlobalOnboarding(false);
              setVipOnboardingCallback(null);
              localStorage.removeItem('vip_onboarding_pending');
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060608] text-slate-900 dark:text-slate-200 transition-colors duration-500 pb-32">
      {isAnalyzing && <CelestialLoading />}

      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 px-4 py-3 flex items-center justify-between shadow-sm dark:shadow-2xl">
        <button onClick={handleBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold chinese-font tracking-widest text-slate-900 dark:text-slate-100">
            {selectedMode === 'ASTROLOGY' ? '紫微命理' : selectedMode === 'TAROT' ? '神秘塔罗' : selectedMode === 'DREAM' ? '梦的解析' : selectedMode === 'HUANGLI' ? '老黄历' : selectedMode === 'PROFILE' ? '画像修改' : '万象档案'}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => {
              setProfilePreviousMode(selectedMode);
              setSelectedMode('PROFILE');
            }}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <Settings size={20} />
          </button>
          <button onClick={toggleTheme} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-8 flex flex-col min-h-[calc(100vh-140px)]">
        {selectedMode === 'HISTORY' ? (
          <HistoryView records={records} onDelete={handleDeleteRecord} onSelect={handleSelectHistoricalRecord} onBack={handleBack} />
        ) : selectedMode === 'PROFILE' ? (
          <div className="animate-in slide-in-from-top-4 duration-700">
            <OnboardingForm
              initialProfile={userProfile}
              onComplete={(p) => { 
                handleCompleteOnboarding(p); 
                setSelectedMode(profilePreviousMode || null); 
                setProfilePreviousMode(null);
              }}
              onClose={() => {
                setSelectedMode(profilePreviousMode || null);
                setProfilePreviousMode(null);
              }}
            />
          </div>
        ) : selectedMode === 'ASTROLOGY' ? (
          !user ? (
            <div className="flex-grow flex items-center justify-center py-10">
              <UserInfoForm onSubmit={handleStartAstrology} defaultBirthDate={userProfile?.birthDate} />
            </div>
          ) : (
            <div className={`space-y-12 animate-in fade-in duration-700 ${isAnalyzing ? 'opacity-0' : 'opacity-100'}`}>
               {/* 命盘展示区 */}
               <div className="relative grid grid-cols-4 grid-rows-4 gap-2 aspect-square max-w-lg mx-auto bg-white/10 dark:bg-slate-900/10 p-2 rounded-[2.5rem] border border-slate-200 dark:border-slate-800/50">
                  <div className="col-start-2 col-end-4 row-start-2 row-end-4 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-950/90 rounded-[2rem] shadow-inner p-4 text-center">
                     <ZiweiWheelIcon size={56} className="text-amber-500/40 mb-3 animate-[spin_20s_linear_infinite]" />
                     <div className="text-3xl font-bold text-amber-500 calligraphy-font mb-1">玄盘</div>
                     <div className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">Celestial Mapping</div>
                  </div>
                  {chart.map((p, i) => (
                    <div key={p.id} style={{ gridRow: gridPositions[i].r, gridColumn: gridPositions[i].c }}>
                      <PalaceBox palace={p} active={selectedPalace === i} onClick={() => setSelectedPalace(i)} />
                    </div>
                  ))}
               </div>

               {/* 解析结果多卡片布局 */}
               {analysisError && !analysis && (
                 <div className="max-w-3xl mx-auto p-6 rounded-[2rem] border border-rose-500/20 bg-rose-500/5 text-rose-500 chinese-font text-center">
                   {analysisError}
                 </div>
               )}
               {analysis && (
                 <div className="space-y-8 max-w-4xl mx-auto">
                    {/* 1. 命格综述 */}
                    <div className="p-10 bg-gradient-to-br from-amber-500/10 via-white dark:via-slate-900 to-indigo-500/10 rounded-[3rem] border border-amber-500/20 shadow-2xl relative overflow-hidden group">
                      <Sparkles className="absolute -top-10 -right-10 text-amber-500/10 group-hover:text-amber-500/20 transition-all duration-1000" size={300} />
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold chinese-font text-2xl tracking-widest">
                           <ZiweiWheelIcon size={28} /> 命格格局综述
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed chinese-font text-xl font-light tracking-wide italic">
                          “{analysis.summary}”
                        </p>
                      </div>
                    </div>

                    {/* 2. 深度推演模块 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
                          <div className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400">
                             <Brain size={24} /> <h4 className="font-bold chinese-font text-xl">心性特质推演</h4>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify chinese-font text-base font-light">
                             {analysis.personality}
                          </p>
                       </div>

                       <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
                          <div className="flex items-center gap-3 mb-6 text-blue-600 dark:text-blue-400">
                             <Briefcase size={24} /> <h4 className="font-bold chinese-font text-xl">事业成就高度</h4>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify chinese-font text-base font-light">
                             {analysis.career}
                          </p>
                       </div>

                       <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
                          <div className="flex items-center gap-3 mb-6 text-amber-600 dark:text-amber-500">
                             <Coins size={24} /> <h4 className="font-bold chinese-font text-xl">财帛资财格局</h4>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify chinese-font text-base font-light">
                             {analysis.wealth}
                          </p>
                       </div>

                       <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
                          <div className="flex items-center gap-3 mb-6 text-rose-600 dark:text-rose-400">
                             <HeartIcon size={24} /> <h4 className="font-bold chinese-font text-xl">情感缘分契机</h4>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify chinese-font text-base font-light">
                             {analysis.relationship}
                          </p>
                       </div>
                    </div>

                    <div className="p-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                       <div className="md:col-span-1 space-y-4 border-b md:border-b-0 md:border-r border-white/10 dark:border-slate-200 pb-8 md:pb-0 md:pr-8">
                          <div className="flex items-center gap-2 text-rose-400 dark:text-rose-600 font-bold mb-2">
                             <Activity size={20} /> 气场建议
                          </div>
                          <p className="text-sm opacity-80 leading-relaxed chinese-font font-light">
                             {analysis.health}
                          </p>
                       </div>
                       <div className="md:col-span-2 space-y-6">
                          <div className="flex items-center gap-2 text-amber-400 dark:text-amber-600 font-bold text-lg chinese-font tracking-widest">
                             <Lightbulb size={24} /> 转运天机指导
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {analysis.suggestions.map((s, i) => (
                               <div key={i} className="flex gap-3 items-start p-3 bg-white/5 dark:bg-slate-50 rounded-2xl border border-white/10 dark:border-slate-200">
                                  <span className="text-amber-500 font-bold text-lg">0{i+1}</span>
                                  <p className="text-xs leading-relaxed opacity-90 chinese-font font-light">{s}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="p-10 bg-gradient-to-br from-indigo-500/10 via-white/60 dark:via-slate-900/60 to-slate-900/10 rounded-[3rem] border border-indigo-500/20 shadow-2xl space-y-6">
                      <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-bold chinese-font text-2xl tracking-widest">
                        <MessageCircle size={24} /> 命盘提问
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        写下你近期的困惑，我会结合你的命盘与已推演的格局，为你给出更具体的指引。
                      </p>
                      <textarea
                        value={ziweiQuestion}
                        onChange={(e) => setZiweiQuestion(e.target.value)}
                        placeholder="例如：最近是否适合换工作？感情该如何推进？"
                        className="w-full min-h-[160px] bg-white/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 text-slate-800 dark:text-slate-200 focus:outline-none shadow-inner font-light text-base"
                      />
                      {ziweiAskError && <p className="text-rose-500 text-sm">{ziweiAskError}</p>}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleZiweiAsk}
                          disabled={ziweiAsking}
                          className="flex-1 py-5 rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white font-bold tracking-widest uppercase text-xs shadow-xl shadow-indigo-500/30 hover:brightness-110 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {ziweiAsking ? <RefreshCw size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                          {ziweiAsking ? '推演中' : '提交提问'}
                        </button>
                        <button
                          onClick={() => {
                            setZiweiQuestion('');
                            setZiweiAnswer('');
                            setZiweiAskError(null);
                          }}
                          className="px-6 py-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          清空
                        </button>
                      </div>
                      {ziweiAnswer && (
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between bg-white/80 dark:bg-slate-950/70 border border-indigo-500/20 rounded-[2.5rem] px-6 py-4 shadow-inner">
                            <div className="flex items-center gap-3 text-indigo-500">
                              <ZiweiWheelIcon size={22} />
                              <div className="text-sm font-bold chinese-font tracking-widest">紫微答复</div>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400">Ziwei Guidance</span>
                          </div>
                          {ziweiSections.length ? (
                            <div className="space-y-4">
                              {ziweiSections.map((section, idx) => (
                                <div key={`${section.title}-${idx}`} className="bg-white/80 dark:bg-slate-950/70 border border-white/10 dark:border-slate-800 rounded-[2rem] p-6 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]">
                                  <div className="flex items-center gap-2 text-indigo-500/90 mb-3">
                                    <h5 className="text-sm font-bold chinese-font tracking-wide">{section.title}</h5>
                                  </div>
                                  <div className="space-y-2 text-slate-700 dark:text-slate-200 chinese-font text-sm leading-relaxed">
                                    {section.body
                                      .split(/\n+/)
                                      .map((line, lineIndex) => (
                                        <p key={`${idx}-${lineIndex}`} className="text-left">
                                          {line}
                                        </p>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-white/80 dark:bg-slate-950/70 border border-indigo-500/20 rounded-[2.5rem] p-6 shadow-inner">
                              <p className="text-slate-700 dark:text-slate-200 leading-relaxed chinese-font text-base font-light">
                                {ziweiAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         onClick={() => {
                           const savedId = handleSaveRecord({ 
                             type: 'ASTROLOGY', 
                             userInfo: user!, 
                             chart, 
                             analysis,
                             followupQuestion: ziweiAnswer ? ziweiQuestion.trim() : '',
                             followupAnswer: ziweiAnswer || '',
                             replaceId: lastAstrologyRecordId || undefined
                           });
                           if (savedId) setLastAstrologyRecordId(savedId);
                         }}
                         disabled={isSaved}
                         className={`flex-1 py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all font-bold text-sm tracking-widest uppercase border ${isSaved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20'}`}
                       >
                         <History size={20} /> {isSaved ? '已存入万象' : '存入万象档案'}
                       </button>
                       <button onClick={handleBack} className="flex-1 py-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors text-sm font-bold tracking-widest uppercase shadow-sm">
                         返回主页
                       </button>
                    </div>
                 </div>
               )}
            </div>
          )
        ) : selectedMode === 'TAROT' ? (
          <TarotView 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onSave={handleSaveRecord}
            onTriggerOnboarding={triggerOnboarding}
            customAnalyze={(q, c, g, vip) => analyzeTarot(q, c, g, (userProfile?.constellation ? userProfile : undefined), vip)}
            initialCards={historicalTarot?.cards}
            initialAnalysis={historicalTarot?.analysis}
            initialFollowupQuestion={historicalTarot?.followupQuestion}
            initialFollowupAnswer={historicalTarot?.followupAnswer}
            initialFollowupCards={historicalTarot?.followupCards}
            initialFollowups={historicalTarot?.followups}
          />
        ) : selectedMode === 'DREAM' ? (
          <DreamView 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onSave={handleSaveRecord}
            onTriggerOnboarding={triggerOnboarding}
            customAnalyze={(c, s, vip) => analyzeDream(c, s, (userProfile?.constellation ? userProfile : undefined), vip)}
            initialAnalysis={historicalDream}
          />
        ) : (
          <HuangliView 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onSave={handleSaveRecord}
            onTriggerOnboarding={triggerOnboarding}
            initialData={historicalHuangli}
            initialPlanInput={historicalHuangliPlanInput || ''}
            initialPlanAnswer={historicalHuangliPlanAnswer || ''}
          />
        )}
      </main>

      {/* 底部导航栏 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl border border-slate-200 dark:border-slate-800/50 p-2 rounded-[2.5rem] shadow-2xl flex items-center justify-between z-50">
        {[
          { mode: 'ASTROLOGY', icon: <ZiweiWheelIcon size={18} />, label: '命理' },
          { mode: 'TAROT', icon: <MysticTarotIcon size={18} />, label: '占卜' },
          { mode: 'DREAM', icon: <DreamInterpretationIcon size={18} />, label: '解梦' },
          { mode: 'HUANGLI', icon: <CalendarDays size={18} />, label: '黄历' },
          { mode: 'HISTORY', icon: <History size={18} />, label: '万象' },
        ].map((item) => (
          <button 
            key={item.mode}
            onClick={() => setSelectedMode(item.mode as ViewMode)}
            className={`flex-1 flex flex-col items-center gap-1 p-3 transition-all rounded-[2rem] ${selectedMode === item.mode ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 shadow-inner' : 'text-slate-400 dark:text-slate-600'}`}
          >
            {item.icon}
            <span className="text-[9px] uppercase tracking-widest chinese-font">{item.label}</span>
          </button>
        ))}
      </div>

      {showGlobalOnboarding && (
        <OnboardingForm
          onComplete={handleCompleteOnboarding}
          initialProfile={userProfile}
          onClose={() => {
            setShowGlobalOnboarding(false);
            setVipOnboardingCallback(null);
            setPreviousMode(null);
            localStorage.removeItem('vip_onboarding_pending');
          }}
        />
      )}
    </div>
  );
};

export default App;
