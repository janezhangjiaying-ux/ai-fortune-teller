
import React from 'react';
import { VIPRecommendations } from '../types';
import { Gem, Home, Sparkles, Shirt, ShieldAlert } from 'lucide-react';

interface VIPSectionProps {
  data: VIPRecommendations;
}

const VIPRecommendationSection: React.FC<VIPSectionProps> = ({ data }) => {
  return (
    <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center gap-3 px-2">
        <div className="h-[1px] flex-grow bg-amber-500/20"></div>
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold chinese-font tracking-[0.2em] text-sm">
          <Sparkles size={16} /> VIP 专属开运建议
        </div>
        <div className="h-[1px] flex-grow bg-amber-500/20"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Crystal & Outfit - 个性化开运穿搭 */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-950/20 border border-amber-500/30 rounded-3xl p-6 shadow-xl transition-all">
          <div className="absolute -right-4 -top-4 text-amber-500/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
            <Gem size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Gem size={20} />
            </div>
            <h4 className="font-bold chinese-font text-slate-800 dark:text-slate-100">个性化开运穿搭</h4>
          </div>
          <div className="space-y-3 relative z-10">
            <div>
              <span className="text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest block mb-1">今日推荐水晶</span>
              <p className="text-lg chinese-font font-bold text-slate-900 dark:text-white">{data.crystal.variety}</p>
            </div>
            <div className="flex gap-2">
              <Shirt size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">{data.crystal.outfitTips}</p>
            </div>
          </div>
        </div>

        {/* 2. Home Treasure - 家居风水布局 */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-500/30 rounded-3xl p-6 shadow-xl transition-all">
          <div className="absolute -right-4 -top-4 text-indigo-500/10 rotate-12 group-hover:-rotate-12 transition-transform duration-1000">
            <Home size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <Home size={20} />
            </div>
            <h4 className="font-bold chinese-font text-slate-800 dark:text-slate-100">家居风水布局</h4>
          </div>
          <div className="space-y-3 relative z-10">
            <div>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-500 font-bold uppercase tracking-widest block mb-1">推荐镇宅灵物</span>
              <p className="text-lg chinese-font font-bold text-slate-900 dark:text-white">{data.homeTreasure.item}</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              <span className="font-bold text-indigo-400">布局效用：</span>{data.homeTreasure.benefit}
            </p>
            <p className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded inline-block">
              摆放方位：{data.homeTreasure.placement}
            </p>
          </div>
        </div>

        {/* 3. Pitfall Guide - 当日避坑指南 */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-white to-rose-50/30 dark:from-slate-900 dark:to-rose-950/20 border border-rose-500/30 rounded-3xl p-6 shadow-xl transition-all md:col-span-2 lg:col-span-1">
          <div className="absolute -right-4 -top-4 text-rose-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <ShieldAlert size={80} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <ShieldAlert size={20} />
            </div>
            <h4 className="font-bold chinese-font text-slate-800 dark:text-slate-100">当日避坑指南</h4>
          </div>
          <div className="space-y-3 relative z-10">
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed chinese-font italic font-light">
               “{data.pitfallGuide}”
             </p>
             <div className="flex items-center gap-2 mt-4 text-[10px] text-rose-500 font-bold uppercase tracking-widest">
               <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
               重要提醒 · 趋吉避凶
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPRecommendationSection;
