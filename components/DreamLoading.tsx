import React, { useState, useEffect } from 'react';
import { Moon, Star, Cloud, Sparkles } from 'lucide-react';

const DreamLoading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "潜入梦境深处，解读潜意识密码...",
    "月光穿透迷雾，照亮心灵深渊...",
    "星辰指引方向，探寻命运轨迹...",
    "云朵诉说预言，汇聚灵感之光...",
    "梦境大门开启，智慧之光乍现..."
  ];

  useEffect(() => {
    const pTimer = setInterval(() => {
      setProgress(prev => {
        const step = Math.random() * 4;
        return prev + step < 100 ? prev + step : 99.9;
      });
    }, 200);
    const tTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 2800);
    return () => { clearInterval(pTimer); clearInterval(tTimer); };
  }, []);

  return (
    <div className="fixed inset-0 z-[300] bg-[#0a0a14] flex flex-col items-center justify-center p-8 overflow-hidden">
      <style>{`
        @keyframes float-cloud { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-10px) translateX(5px); } 50% { transform: translateY(-5px) translateX(-5px); } 75% { transform: translateY(-15px) translateX(3px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes moon-glow { 0%, 100% { box-shadow: 0 0 20px rgba(147, 197, 253, 0.3); } 50% { box-shadow: 0 0 40px rgba(147, 197, 253, 0.6); } }
        @keyframes dream-wave { 0%, 100% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(5deg) scale(1.05); } 50% { transform: rotate(-5deg) scale(0.95); } 75% { transform: rotate(3deg) scale(1.02); } }
        @keyframes sparkle-float { 0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; } 50% { transform: translateY(-20px) rotate(180deg); opacity: 1; } }
      `}</style>

      {/* 梦境背景 - 渐变天空 */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 opacity-90"></div>

      {/* 漂浮的云朵 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-[float-cloud_8s_ease-in-out_infinite]"
            style={{
              top: `${Math.random() * 60 + 10}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          >
            <Cloud size={Math.random() * 40 + 20} className="text-slate-300" />
          </div>
        ))}
      </div>

      {/* 闪烁的星星 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-[twinkle_3s_ease-in-out_infinite]"
            style={{
              top: `${Math.random() * 70 + 10}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <Star size={Math.random() * 3 + 1} className="text-amber-200" />
          </div>
        ))}
      </div>

      {/* 核心月亮动效 */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-indigo-400/20 blur-[80px] rounded-full animate-[moon-glow_4s_infinite]"></div>
        <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-indigo-300 rounded-full shadow-[0_0_60px_rgba(147,197,253,0.5)] animate-[dream-wave_6s_infinite_ease-in-out] flex items-center justify-center relative overflow-hidden border border-indigo-200/30">
          <div className="absolute inset-4 bg-gradient-to-t from-indigo-500/20 to-transparent rounded-full"></div>
          <Moon size={48} className="text-indigo-100 relative z-10" />
          {/* 月亮上的光斑 */}
          <div className="absolute top-6 left-8 w-2 h-2 bg-white/60 rounded-full blur-[0.5px]"></div>
          <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-white/40 rounded-full blur-[0.3px]"></div>
        </div>
      </div>

      {/* 飞舞的火花 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-[sparkle-float_4s_ease-in-out_infinite]"
            style={{
              top: `${Math.random() * 50 + 30}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          >
            <Sparkles size={Math.random() * 8 + 4} className="text-purple-300" />
          </div>
        ))}
      </div>

      {/* 进度与文案 */}
      <div className="mt-8 w-full max-w-xs space-y-10 text-center relative z-10">
        <div className="space-y-3">
          <p className="chinese-font text-2xl text-indigo-100 tracking-[0.3em] font-light animate-pulse transition-opacity">
            {tips[tipIndex]}
          </p>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.5em] font-bold">Dream Realm Analysis</p>
        </div>

        <div className="space-y-4">
          {/* 进度条容器 */}
          <div className="relative h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-indigo-500/20 shadow-inner">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-400 to-amber-300 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(147,197,253,0.4)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 tracking-[0.2em]">
            <span className="opacity-50 uppercase">Subconscious</span>
            <span className="text-indigo-400 font-bold">{Math.floor(progress)}%</span>
            <span className="opacity-50 uppercase">Mapping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamLoading;