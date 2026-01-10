
import React, { useState, useEffect } from 'react';

const CelestialLoading: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const tips = [
    "天机轮转，正在校准星轨...",
    "紫微归位，推演十二宫位...",
    "感悟灵气，凝聚命主磁场...",
    "宿命交织，洞察玄机伏线...",
    "万象归一，开启宿命玄盘..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) return prev + Math.random() * 4;
        if (prev < 70) return prev + Math.random() * 1.5;
        if (prev < 90) return prev + Math.random() * 0.4;
        if (prev < 99) return prev + 0.05;
        return prev;
      });
    }, 250);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
      {/* 1. 远景星云背景 */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(120)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 1.2 + 'px',
              height: Math.random() * 1.2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 4 + 2 + 's'
            }}
          />
        ))}
      </div>

      {/* 2. 流星划过 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-[1px] w-[120px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent -rotate-[35deg] animate-meteor"
            style={{
              top: Math.random() * 60 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: (i * 3) + Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      {/* 3. 核心黄道星仪 */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center scale-90 md:scale-110">
        
        {/* 外层：黄道十二辰轮 */}
        <div className="absolute inset-0 border border-amber-500/10 rounded-full animate-[spin_50s_linear_infinite]">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-amber-500/30 chinese-font tracking-widest font-bold"
              style={{ transformOrigin: 'center 248px', transform: `rotate(${i * 30}deg)` }}
            >
              {['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][i]}
            </div>
          ))}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2">
            <div className="w-full h-full bg-amber-400 rounded-full blur-[2px] animate-pulse"></div>
            <div className="absolute inset-0 bg-white rounded-full scale-50"></div>
          </div>
        </div>

        {/* 黄道夹角：地月系统运行 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[260px] h-[260px] rotate-[23deg]">
            <div className="absolute inset-0 rounded-full border border-amber-500/10"></div>
            <div className="absolute inset-0 animate-[orbit_18s_linear_infinite]">
              <div
                className="absolute top-1/2 left-1/2"
                style={{ transform: 'translate(-50%, -50%) translateX(130px)' }}
              >
                <div className="relative w-6 h-6">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full border border-slate-200/20 shadow-[0_0_10px_rgba(226,232,240,0.08)]"></div>
                    <div
                      className="absolute inset-0"
                      style={{ transformOrigin: '50% 50%', animation: 'moon_orbit 5s linear infinite' }}
                    >
                      <div
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-slate-200 shadow-[0_0_8px_rgba(226,232,240,0.7)]"
                        style={{ transform: 'translate(-50%, -50%) translateX(26px)' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 核心紫微帝星 */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-36 h-36 bg-amber-500/10 blur-[45px] rounded-full animate-pulse"></div>
          <div className="w-6 h-6 bg-amber-400 rounded-full shadow-[0_0_30px_#f59e0b] relative z-10 flex items-center justify-center animate-[breath_4s_ease-in-out_infinite]">
             <div className="w-2.5 h-2.5 bg-white rounded-full opacity-90 blur-[0.2px]"></div>
          </div>
        </div>
      </div>

      {/* 4. 底部文案与进度条 */}
      <div className="mt-8 w-full max-w-sm px-8 text-center space-y-10 relative z-10">
        <div className="relative min-h-[4rem] flex flex-col items-center justify-center">
          <p className="chinese-font text-3xl text-amber-100/90 tracking-[0.5em] font-light animate-[text-fade_3s_ease-in-out_infinite]">
            {tips[tipIndex]}
          </p>
          <div className="mt-4 flex items-center gap-2 opacity-40">
             <div className="w-12 h-[0.5px] bg-gradient-to-r from-transparent to-amber-500"></div>
             <span className="text-[9px] uppercase tracking-[0.6em] text-amber-500/80 font-bold">Destiny Mapping</span>
             <div className="w-12 h-[0.5px] bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>
        </div>

        <div className="space-y-4">
          {/* 修复：进度条高度改为 h-1.5，并使用 absolute 填充以确保可见性 */}
          <div className="relative w-full h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-white transition-all duration-300 ease-out shadow-[0_0_15px_rgba(251,191,36,0.6)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white blur-[2px] opacity-60"></div>
            </div>
          </div>
          <div className="flex justify-between items-center px-1 font-mono text-[9px] tracking-widest uppercase">
            <span className="text-slate-600">Syncing celestial</span>
            <span className="text-amber-500 font-bold">{Math.floor(progress)}%</span>
            <span className="text-slate-600">Coordinates</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes meteor {
          0% { transform: translate(-300px, -300px) rotate(-35deg); opacity: 0; }
          15% { opacity: 0.6; }
          30% { transform: translate(500px, 500px) rotate(-35deg); opacity: 0; }
          100% { transform: translate(500px, 500px) rotate(-35deg); opacity: 0; }
        }
        @keyframes breath {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes text-fade {
          0%, 100% { opacity: 0.4; transform: translateY(2px); }
          50% { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes moon_orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-meteor { animation: meteor 8s linear infinite; }
        .chinese-font { font-family: 'Noto Serif SC', serif; text-shadow: 0 0 15px rgba(251, 191, 36, 0.3); }
      `}</style>
    </div>
  );
};

export default CelestialLoading;
