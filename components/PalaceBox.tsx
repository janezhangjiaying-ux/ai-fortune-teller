
import React from 'react';
import { Palace } from '../types';

interface PalaceBoxProps {
  palace: Palace;
  onClick: () => void;
  active: boolean;
}

// 宫位插画组件：根据宫位名称渲染对应的艺术场景
const PalaceIllustration: React.FC<{ name: string; active: boolean }> = ({ name, active }) => {
  const colorClass = active ? "opacity-30 dark:opacity-40" : "opacity-10 dark:opacity-20";
  
  switch (name) {
    case '命宫': // 打坐与星辰
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M50 20 L55 30 L65 30 L57 37 L60 47 L50 40 L40 47 L43 37 L35 30 L45 30 Z" fill="#fbbf24" />
          <path d="M35 80 Q50 65 65 80" stroke="currentColor" fill="none" strokeWidth="2" />
          <circle cx="50" cy="70" r="5" fill="currentColor" />
        </svg>
      );
    case '兄弟': // 荷花与水鸟
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M30 70 Q40 50 50 70" fill="#f472b6" opacity="0.6" />
          <path d="M50 75 Q60 55 70 75" fill="#f472b6" opacity="0.6" />
          <path d="M20 85 H80" stroke="#60a5fa" strokeWidth="1" />
          <path d="M40 80 Q45 75 50 80" fill="currentColor" />
        </svg>
      );
    case '夫妻': // 并蒂莲/天鹅
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M40 70 Q45 50 50 70 Q55 50 60 70" fill="none" stroke="#fb7185" strokeWidth="2" />
          <path d="M45 60 Q50 55 55 60" stroke="#fb7185" fill="none" />
          <path d="M30 85 Q50 75 70 85" stroke="#38bdf8" fill="none" />
        </svg>
      );
    case '子女': // 麒麟送子/顽童
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="55" cy="40" r="8" fill="#fde68a" />
          <path d="M30 75 Q50 50 75 75" stroke="#fb923c" strokeWidth="3" fill="none" />
          <path d="M75 75 L85 65" stroke="#fb923c" strokeWidth="2" />
        </svg>
      );
    case '财帛': // 摇钱树/金碗
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M40 80 L60 80 L65 65 L35 65 Z" fill="#eab308" />
          <path d="M50 65 V40" stroke="#78350f" strokeWidth="2" />
          <circle cx="40" cy="45" r="4" fill="#fbbf24" />
          <circle cx="60" cy="45" r="4" fill="#fbbf24" />
          <circle cx="50" cy="35" r="4" fill="#fbbf24" />
        </svg>
      );
    case '疾厄': // 炼丹炉/灵草
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M35 75 Q50 85 65 75 V55 Q50 45 35 55 Z" fill="#f87171" opacity="0.5" />
          <path d="M45 50 Q50 30 55 50" stroke="#cbd5e1" strokeWidth="1" fill="none" />
          <path d="M40 45 Q50 25 60 45" stroke="#cbd5e1" strokeWidth="1" fill="none" />
        </svg>
      );
    case '迁移': // 一帆风顺
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M30 70 L70 70 L65 75 H35 Z" fill="#a855f7" />
          <path d="M50 70 V35" stroke="currentColor" strokeWidth="1.5" />
          <path d="M50 40 L75 60 H50 Z" fill="#e2e8f0" opacity="0.8" />
          <path d="M20 85 Q50 75 80 85" stroke="#38bdf8" fill="none" />
        </svg>
      );
    case '交友': // 幼苗/众生
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M50 80 V60" stroke="#16a34a" strokeWidth="2" />
          <path d="M50 65 Q40 55 35 65" fill="#4ade80" />
          <path d="M50 65 Q60 55 65 65" fill="#4ade80" />
        </svg>
      );
    case '官禄': // 官帽/博弈
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <rect x="35" y="65" width="30" height="15" rx="2" fill="#475569" />
          <path d="M30 65 L70 65 L60 50 L40 50 Z" fill="#1e293b" />
          <path d="M40 50 V45 H60 V50" stroke="#1e293b" strokeWidth="2" fill="none" />
        </svg>
      );
    case '田宅': // 深宅大院
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M30 80 H70 V55 L50 40 L30 55 Z" fill="#b91c1c" opacity="0.4" />
          <path d="M45 80 V65 H55 V80" fill="#451a03" />
          <path d="M30 55 L50 40 L70 55" stroke="#475569" strokeWidth="2" fill="none" />
        </svg>
      );
    case '福德': // 仙鹤/祥云
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M70 40 Q50 30 30 50 L40 55 Q55 45 70 60" fill="none" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M30 50 L25 45" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="75" cy="25" r="5" fill="#ef4444" opacity="0.3" />
        </svg>
      );
    case '父母': // 大树/守护
      return (
        <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full p-2 transition-opacity duration-700 ${colorClass}`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M45 85 Q50 70 55 85" fill="#713f12" />
          <path d="M50 70 V50" stroke="#713f12" strokeWidth="3" />
          <circle cx="50" cy="45" r="20" fill="#15803d" opacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
};

const PalaceBox: React.FC<PalaceBoxProps> = ({ palace, onClick, active }) => {
  const isMain = palace.name === '命宫';
  
  return (
    <div 
      onClick={onClick}
      className={`
        relative h-full w-full p-2 cursor-pointer transition-all duration-500 overflow-hidden border
        ${active 
          ? 'bg-white dark:bg-slate-900/90 border-amber-500/50 shadow-lg dark:shadow-[inset_0_0_30px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30' 
          : 'bg-white/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800/30 hover:bg-white dark:hover:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'}
        rounded-xl group flex flex-col justify-between
      `}
    >
      {/* 艺术插画背景 */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <PalaceIllustration name={palace.name} active={active} />
      </div>

      {/* 祥云/卷轴纹理 */}
      <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/oriental-tiles.png')]"></div>

      {/* 顶部布局：宫位标签与地支 */}
      <div className="flex justify-between items-start relative z-10 w-full">
        <div className={`
          px-2 py-0.5 rounded-md text-[10px] font-bold chinese-font tracking-widest transition-all
          ${isMain 
            ? 'bg-amber-600 text-white shadow-md' 
            : active ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500'}
        `}>
          {palace.name}
        </div>
        <div className={`
          text-[10px] font-bold calligraphy-font transition-colors
          ${active ? 'text-amber-600 dark:text-amber-500/60' : 'text-slate-300 dark:text-slate-800'}
        `}>
          {palace.zodiac}
        </div>
      </div>

      {/* 星曜列表 */}
      <div className="my-1.5 space-y-0.5 relative z-10 flex-grow flex flex-col justify-center">
        {palace.stars.map((star, i) => (
          <div 
            key={i} 
            className={`
              flex items-center gap-1 text-[11px] md:text-xs font-bold leading-tight drop-shadow-sm
              ${star.type === 'MAJOR' ? 'text-amber-600 dark:text-amber-400' : 
                star.type === 'UNLUCKY' ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}
            `}
          >
            <span className="chinese-font whitespace-nowrap">{star.name}</span>
            {star.type === 'MAJOR' && (
              <span className="text-[7px] opacity-70 font-normal calligraphy-font bg-slate-100 dark:bg-slate-800/60 px-0.5 rounded-sm">庙</span>
            )}
          </div>
        ))}
        {palace.stars.length === 0 && (
          <div className="text-[9px] text-slate-400 dark:text-slate-700 italic mt-2 chinese-font opacity-40 text-center">空宫</div>
        )}
      </div>
      
      {/* 底部宫位背景字 */}
      <div className={`
        absolute bottom-0 right-1 text-2xl font-bold calligraphy-font pointer-events-none select-none z-0 transition-opacity
        ${active ? 'opacity-10 dark:opacity-20 text-amber-500' : 'opacity-5 dark:opacity-10 text-slate-900'}
      `}>
        {palace.zodiac}
      </div>

      {/* 激活指示线 */}
      {active && (
        <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] rounded-r-full"></div>
      )}
    </div>
  );
};

export default PalaceBox;
