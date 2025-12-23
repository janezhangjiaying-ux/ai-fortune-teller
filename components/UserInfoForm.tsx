
import React, { useState, useEffect } from 'react';
import { UserInfo, Gender } from '../types';
import { MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

interface UserInfoFormProps {
  onSubmit: (info: UserInfo) => void;
  defaultBirthDate?: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, defaultBirthDate }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '', 
    birthDate: defaultBirthDate || '',
    birthTime: '12:00',
    gender: Gender.MALE,
    birthPlace: '',
  });

  useEffect(() => {
    if (defaultBirthDate && !formData.birthDate) {
      setFormData(prev => ({ ...prev, birthDate: defaultBirthDate }));
    }
  }, [defaultBirthDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.birthDate) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl dark:shadow-2xl space-y-6 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="text-center space-y-1 mb-6">
        <h1 className="text-5xl bg-gradient-to-r from-amber-500 to-indigo-600 dark:from-amber-200 dark:to-indigo-400 bg-clip-text text-transparent calligraphy-font">灵机万象</h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em] font-light">AI 命理大师 · 万象轨律解析</p>
      </div>

      <div className="space-y-5">
        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-2 px-1 uppercase tracking-wider">
              <Calendar size={12} /> 出生日期 (阳历)
            </label>
            <input 
              type="date"
              required
              value={formData.birthDate}
              onChange={e => setFormData({...formData, birthDate: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-light"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-2 px-1 uppercase tracking-wider">
              <Clock size={12} /> 出生时间
            </label>
            <input 
              type="time"
              required
              value={formData.birthTime}
              onChange={e => setFormData({...formData, birthTime: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-light"
            />
          </div>
        </div>

        {/* Birth Place */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-2 px-1 uppercase tracking-wider">
            <MapPin size={12} /> 出生地点
          </label>
          <input 
            type="text"
            value={formData.birthPlace}
            onChange={e => setFormData({...formData, birthPlace: e.target.value})}
            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-light placeholder:text-slate-300 dark:placeholder:text-slate-700"
            placeholder="例如：北京市朝阳区"
          />
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-2 px-1 uppercase tracking-wider">性别选择</label>
          <div className="flex bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setFormData({...formData, gender: Gender.MALE})}
              className={`flex-1 py-3 rounded-lg text-xs transition-all tracking-widest ${formData.gender === Gender.MALE ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-slate-400 dark:text-slate-600 hover:text-slate-500'}`}
            >乾造 (男)</button>
            <button
              type="button"
              onClick={() => setFormData({...formData, gender: Gender.FEMALE})}
              className={`flex-1 py-3 rounded-lg text-xs transition-all tracking-widest ${formData.gender === Gender.FEMALE ? 'bg-rose-600 text-white shadow-md font-bold' : 'text-slate-400 dark:text-slate-600 hover:text-slate-500'}`}
            >坤造 (女)</button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all tracking-[0.2em] uppercase text-sm mt-4"
      >
        <Sparkles className="group-hover:animate-spin" size={18} />
        开始排盘解析
      </button>
    </form>
  );
};

export default UserInfoForm;
