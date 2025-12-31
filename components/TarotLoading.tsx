
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const TarotLoading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  
  const tips = [
    "洗牌回响，牌意正在浮现...",
    "牌阵成形，命题脉络渐明...",
    "指尖余温，唤醒沉睡象征...",
    "光影交错，解读即将开启...",
    "启示已至，即将揭晓答案..."
  ];

  useEffect(() => {
    const pTimer = setInterval(() => {
      setProgress(prev => {
        // 模拟更真实的进度步进
        const step = Math.random() * 5;
        return prev + step < 100 ? prev + step : 99.9;
      });
    }, 250);
    const tTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 2500);
    return () => { clearInterval(pTimer); clearInterval(tTimer); };
  }, []);

  return (
    <div className="fixed inset-0 z-[300] bg-[#020205] flex flex-col items-center justify-center p-8 overflow-hidden">
      <style>{`
        @keyframes orbit-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 0.5; transform: scale(1.1); } }
        @keyframes card-float { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        .mandala-path { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw 10s infinite linear; }
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>

      {/* 远古曼陀罗背景 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        <svg width="600" height="600" viewBox="0 0 100 100" className="animate-[orbit-rotate_60s_linear_infinite]">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-purple-500 mandala-path" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-indigo-500 mandala-path" />
          {[...Array(12)].map((_, i) => (
            <line key={i} x1="50" y1="2" x2="50" y2="98" stroke="currentColor" strokeWidth="0.05" className="text-slate-800" style={{ transform: `rotate(${i * 15}deg)`, transformOrigin: '50% 50%' }} />
          ))}
        </svg>
      </div>

      {/* 核心卡牌动效 */}
      <div className="relative w-48 h-72 flex items-center justify-center">
        <div className="absolute inset-0 bg-purple-600/10 blur-[60px] rounded-full animate-[pulse-ring_4s_infinite]"></div>
        <div className="w-32 h-52 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a1a] border-2 border-[#c0a060] rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-[card-float_5s_infinite_ease-in-out] flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-2 border border-[#c0a060]/30 rounded-lg"></div>
           <Star size={40} className="text-[#c0a060] animate-pulse" />
           <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
        </div>
      </div>

      {/* 进度与文案 */}
      <div className="mt-16 w-full max-w-xs space-y-10 text-center">
        <div className="space-y-3">
          <p className="chinese-font text-2xl text-purple-100 tracking-[0.4em] font-light animate-pulse transition-opacity">
            {tips[tipIndex]}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.5em] font-bold">Aligning Tarot Insight</p>
        </div>

        <div className="space-y-4">
          {/* 进度条容器 - 增加高度和背景对比度 */}
          <div className="relative h-1.5 w-full bg-slate-900/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
            {/* 进度填充层 - 修复：使用 absolute 确保高度撑满，缩短 transition 时长 */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-amber-300 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              style={{ width: `${progress}%` }}
            >
              {/* 进度条头部的强光亮点 */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 tracking-[0.2em]">
            <span className="opacity-50 uppercase">Tarot Scan</span>
            <span className="text-purple-400 font-bold">{Math.floor(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotLoading;
