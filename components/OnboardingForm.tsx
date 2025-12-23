
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Calendar, Zap, Star, MapPin, User, ChevronRight, Compass, X, ShieldAlert, Edit3, Check, Brain } from 'lucide-react';

const CONSTELLATIONS = [
  { name: '白羊座', range: [321, 419], color: 'red-500' }, { name: '金牛座', range: [420, 520], color: 'emerald-500' }, 
  { name: '双子座', range: [521, 621], color: 'yellow-400' }, { name: '巨蟹座', range: [622, 722], color: 'slate-300' },
  { name: '狮子座', range: [723, 822], color: 'amber-500' }, { name: '处女座', range: [823, 922], color: 'teal-600' }, 
  { name: '天秤座', range: [923, 1023], color: 'pink-400' }, { name: '天蝎座', range: [1024, 1122], color: 'rose-800' },
  { name: '射手座', range: [1123, 1221], color: 'indigo-600' }, { name: '摩羯座', range: [1222, 119], color: 'slate-700' }, 
  { name: '水瓶座', range: [120, 218], color: 'blue-500' }, { name: '双鱼座', range: [219, 320], color: 'cyan-500' },
];

const MBTI_TYPES = [
  { name: 'INTJ', color: '#2b579a' }, { name: 'INTP', color: '#91a3b0' }, { name: 'ENTJ', color: '#800080' }, { name: 'ENTP', color: '#7cfc00' },
  { name: 'INFJ', color: '#355e3b' }, { name: 'INFP', color: '#ffc0cb' }, { name: 'ENFJ', color: '#00fa9a' }, { name: 'ENFP', color: '#ff1493' },
  { name: 'ISTJ', color: '#000000' }, { name: 'ISFJ', color: '#4169e1' }, { name: 'ESTJ', color: '#ff0000' }, { name: 'ESFJ', color: '#ffa500' },
  { name: 'ISTP', color: '#c0c0c0' }, { name: 'ISFP', color: '#da70d6' }, { name: 'ESTP', color: '#ffd700' }, { name: 'ESFP', color: '#ffff00' },
];

const calculateConstellation = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const m = date.getMonth() + 1, d = date.getDate(), val = m * 100 + d;
  const found = CONSTELLATIONS.find(c => {
    if (c.name === '摩羯座') return val >= 1222 || val <= 119;
    return val >= c.range[0] && val <= c.range[1];
  });
  return found ? found.name : '';
};

interface OnboardingFormProps {
  onComplete: (profile: UserProfile | null) => void;
  initialProfile?: UserProfile | null;
  mode?: 'onboarding' | 'view'; // 新增mode prop
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete, initialProfile, mode = 'onboarding' }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    constellation: '',
    birthDate: '',
    mbti: '',
    city: ''
  });
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  
  // 检查初始profile是否完整（至少要有生日和MBTI，这是最基本的画像信息）
  const isInitialProfileComplete = !!(initialProfile?.birthDate && initialProfile?.mbti);
  
  // 修改isEditing的初始状态：如果是view模式但初始profile不完整，则直接进入编辑模式
  const [isEditing, setIsEditing] = useState(mode === 'onboarding' || (mode === 'view' && !isInitialProfileComplete));

  useEffect(() => {
    if (profile.birthDate) {
      const cons = calculateConstellation(profile.birthDate);
      if (cons && cons !== profile.constellation) {
        setProfile(prev => ({ ...prev, constellation: cons }));
      }
    }
  }, [profile.birthDate]);

  const isLightColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
  };

  const handleSkip = () => {
    setShowSkipConfirm(true);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-50 dark:bg-[#020205] overflow-x-hidden overflow-y-auto z-[250] animate-in fade-in duration-500">
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 40px -10px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 60px 0px rgba(99, 102, 241, 0.4); }
        }
        .breath-shadow { animation: glow 6s infinite ease-in-out; }
      `}</style>
      
      {/* 动态呼吸背景装饰 - 固定在背景上 */}
      <div className="fixed top-[10%] left-[10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="relative w-full min-h-full flex flex-col items-center justify-start py-12 px-6">
        <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/40 dark:border-white/5 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none breath-shadow overflow-hidden relative z-10 transition-all duration-700">
          
          {/* 头部 */}
          <div className="pt-12 pb-8 px-10 text-center space-y-4 bg-gradient-to-b from-white/40 dark:from-slate-800/20 to-transparent">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto text-indigo-500 dark:text-indigo-400 shadow-inner">
              <Compass size={40} className="animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold chinese-font tracking-widest text-slate-900 dark:text-white">
                {mode === 'view' ? '画像信息查看' : '画像深度感应'}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-6 bg-slate-300 dark:bg-slate-700"></div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] font-medium">
                  {mode === 'view' ? 'Current Profile Data' : 'Cosmic Identity Mapping'}
                </p>
                <div className="h-[1px] w-6 bg-slate-300 dark:bg-slate-700"></div>
              </div>
            </div>
          </div>

          <div className="px-10 pb-12 space-y-10">
            {mode === 'view' && !isEditing ? (
              // 查看模式：显示只读的用户画像信息
              <div className="space-y-8">
                {/* 关闭按钮 */}
                <div className="flex justify-end">
                  <button 
                    onClick={() => onComplete(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                {/* 画像信息展示 */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold chinese-font text-slate-900 dark:text-white mb-2">当前画像信息</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">这是您最新保存的深度画像数据</p>
                  </div>

                  {/* 出生日期 */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar size={18} className="text-indigo-500" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">阳历出生日期</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white ml-7">
                      {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('zh-CN') : '未设置'}
                    </p>
                  </div>

                  {/* 星座 */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Star size={18} className="text-amber-500" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">星座</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white ml-7">
                      {profile.constellation || '未设置'}
                    </p>
                  </div>

                  {/* MBTI */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain size={18} className="text-purple-500" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">MBTI人格类型</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white ml-7">
                      {profile.mbti || '未设置'}
                    </p>
                  </div>

                  {/* 城市 */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin size={18} className="text-green-500" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">所在城市</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white ml-7">
                      {profile.city || '未设置'}
                    </p>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    更新画像
                  </button>
                  <button 
                    onClick={() => onComplete(null)}
                    className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-2xl active:scale-95 transition-all text-sm tracking-widest uppercase"
                  >
                    关闭
                  </button>
                </div>
              </div>
            ) : (
              // 编辑模式或引导模式：显示可编辑表单
              <div className="space-y-10">
                {/* 返回查看按钮（仅在view模式下显示） */}
                {mode === 'view' && (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <X size={20} className="text-slate-400" />
                    </button>
                  </div>
                )}

                {/* 日期选择 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 pl-1">
                    <Calendar size={16} /><span className="text-[11px] font-bold uppercase tracking-widest">阳历出生日期</span>
                  </div>
                  <input 
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                    className="w-full bg-slate-100/50 dark:bg-black/20 border-none rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold transition-all"
                  />
                </div>

                {/* 星座 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pl-1">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                      <Star size={16} /><span className="text-[11px] font-bold uppercase tracking-widest">星座</span>
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                      {profile.constellation || '自动计算'}
                    </span>
                  </div>
                </div>

                {/* MBTI选择 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 pl-1">
                    <Brain size={16} /><span className="text-[11px] font-bold uppercase tracking-widest">人格类型 (MBTI)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {MBTI_TYPES.map((type) => (
                      <button
                        key={type.name}
                        onClick={() => setProfile({ ...profile, mbti: type.name })}
                        className={`py-3 px-2 rounded-xl font-bold text-xs transition-all ${
                          profile.mbti === type.name 
                            ? 'bg-indigo-500 text-white shadow-lg scale-105' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        style={{ backgroundColor: profile.mbti === type.name ? undefined : type.color + '20', color: profile.mbti === type.name ? undefined : (isLightColor(type.color) ? '#000' : '#fff') }}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 城市输入 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 pl-1">
                    <MapPin size={16} /><span className="text-[11px] font-bold uppercase tracking-widest">常驻城市</span>
                  </div>
                  <input 
                    type="text"
                    placeholder="例如：上海"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full bg-slate-100/50 dark:bg-black/20 border-none rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 font-bold"
                  />
                </div>

                {/* 保存按钮 */}
                <button 
                  onClick={() => onComplete(profile)}
                  disabled={!profile.birthDate || !profile.mbti}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 rounded-[2rem] shadow-xl uppercase text-sm tracking-[0.3em] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === 'view' ? '保存更新' : '完成画像'}
                </button>

                {/* 跳过按钮（仅在引导模式显示） */}
                {mode === 'onboarding' && (
                  <button 
                    onClick={handleSkip}
                    className="w-full py-3 text-slate-400 hover:text-slate-600 transition-colors text-xs uppercase font-bold tracking-widest"
                  >
                    跳过 (使用通用分析)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showSkipConfirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300 border border-amber-500/20">
              <button onClick={() => setShowSkipConfirm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600">
                <X size={20} />
              </button>
              
              <div className="space-y-6 text-center">
                 <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
                   <ShieldAlert size={32} />
                 </div>
                 
                 <div className="space-y-3">
                   <h3 className="text-xl font-bold chinese-font text-slate-900 dark:text-white">天机不可偏离</h3>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed chinese-font">
                     画像校准是连接您本命磁场与 AI 推演的核心钥匙。若不填写，大师仅能提供泛化的通用解读，可能导致推演偏离您的真实命运轨迹。
                   </p>
                 </div>
                 
                 <div className="flex flex-col gap-3 pt-4">
                    <button 
                      onClick={() => setShowSkipConfirm(false)}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-xs tracking-widest uppercase"
                    >
                      返回完善画像
                    </button>
                    <button 
                      onClick={() => onComplete({ constellation: '', birthDate: '', mbti: '', city: '' })}
                      className="w-full py-2 text-[10px] text-slate-400 hover:text-rose-500 transition-colors uppercase font-bold tracking-widest"
                    >
                      坚持跳过 (采用通用指引)
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingForm;
