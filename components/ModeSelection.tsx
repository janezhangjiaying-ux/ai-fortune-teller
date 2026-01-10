
import React from 'react';
import { Sparkles, Sun, Moon, CalendarDays, Settings, History } from 'lucide-react';
import { MysticTarotIcon, ZiweiWheelIcon, DreamInterpretationIcon } from './Icons';

interface ModeSelectionProps {
  onSelect: (mode: 'ASTROLOGY' | 'TAROT' | 'DREAM' | 'HUANGLI') => void;
  onToggleTheme?: () => void;
  theme?: 'light' | 'dark';
  onOpenProfile?: () => void;
  onOpenHistory?: () => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelect, onToggleTheme, theme, onOpenProfile, onOpenHistory }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#060608] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] overflow-hidden transition-colors duration-500">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button
          onClick={onOpenHistory}
          className="p-3 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
          aria-label="查看档案"
        >
          <History size={18} />
        </button>
        <button
          onClick={onOpenProfile}
          className="p-3 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
          aria-label="编辑画像"
        >
          <Settings size={18} />
        </button>
        <button 
          onClick={onToggleTheme}
          className="p-3 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
          aria-label="切换主题"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="text-center space-y-2 mb-12 animate-in fade-in zoom-in duration-700">
        <div className="relative inline-block">
          <h1 className="text-6xl md:text-7xl bg-gradient-to-r from-amber-600 via-indigo-700 to-purple-800 dark:from-amber-200 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent calligraphy-font leading-tight">
            灵机万象
          </h1>
          <Sparkles className="absolute -top-4 -right-8 text-amber-500 dark:text-amber-400 animate-pulse opacity-70" size={28} />
        </div>
        <p className="text-slate-400 dark:text-slate-500 text-xs tracking-[0.5em] uppercase font-light">AI 命理大师</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4 items-stretch">
        <button 
          onClick={() => onSelect('ASTROLOGY')}
          className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col items-center text-center h-full"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-500 mb-6 flex-shrink-0 border border-amber-500/10">
            <ZiweiWheelIcon size={32} className="opacity-80" />
          </div>
          <h3 className="text-xl font-bold chinese-font text-slate-900 dark:text-slate-100 mb-3 tracking-wide">紫微命理</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] font-light flex-grow">千年星命智慧，解析人生格局。</p>
          <div className="mt-6 px-5 py-1.5 rounded-full border border-amber-500/30 text-[9px] text-amber-600 dark:text-amber-500 font-bold tracking-widest uppercase">开启天机</div>
        </button>

        <button 
          onClick={() => onSelect('TAROT')}
          className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex flex-col items-center text-center h-full"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-500 mb-6 flex-shrink-0 border border-purple-500/10">
            <MysticTarotIcon size={32} className="opacity-80" />
          </div>
          <h3 className="text-xl font-bold chinese-font text-slate-900 dark:text-slate-100 mb-3 tracking-wide">神秘塔罗</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] font-light flex-grow">西洋神秘占卜，寻找内心的答案。</p>
          <div className="mt-6 px-5 py-1.5 rounded-full border border-purple-500/30 text-[9px] text-purple-600 dark:text-purple-500 font-bold tracking-widest uppercase">内心探索</div>
        </button>

        <button 
          onClick={() => onSelect('DREAM')}
          className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col items-center text-center h-full"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500 mb-6 flex-shrink-0 border border-indigo-500/10">
            <DreamInterpretationIcon size={32} className="opacity-80" />
          </div>
          <h3 className="text-xl font-bold chinese-font text-slate-900 dark:text-slate-100 mb-3 tracking-wide">梦的解析</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] font-light flex-grow">洞察潜意识预示，拨开梦境迷雾。</p>
          <div className="mt-6 px-5 py-1.5 rounded-full border border-indigo-500/30 text-[9px] text-indigo-600 dark:text-indigo-500 font-bold tracking-widest uppercase">入梦解析</div>
        </button>

        <button 
          onClick={() => onSelect('HUANGLI')}
          className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 flex flex-col items-center text-center h-full"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-500 mb-6 flex-shrink-0 border border-red-500/10">
            <CalendarDays size={28} className="opacity-80" />
          </div>
          <h3 className="text-xl font-bold chinese-font text-slate-900 dark:text-slate-100 mb-3 tracking-wide">老黄历</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] font-light flex-grow">查吉凶、观节律，掌每日岁月之宜忌。</p>
          <div className="mt-6 px-5 py-1.5 rounded-full border border-red-500/30 text-[9px] text-red-600 dark:text-red-500 font-bold tracking-widest uppercase">观时择吉</div>
        </button>
      </div>

      <div className="mt-16 text-slate-400 dark:text-slate-700 text-[10px] tracking-[0.5em] uppercase font-light">
        Powered by AI 命理大师
      </div>
    </div>
  );
};

export default ModeSelection;
