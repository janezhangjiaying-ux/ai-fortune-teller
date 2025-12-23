
import React, { useState } from 'react';
import { TarotCard, TarotAnalysis, Gender, HistoryRecord } from '../types';
import { analyzeTarot } from '../services/geminiService';
import { Sparkles, RefreshCw, LayoutTemplate, BrainCircuit, User, Bookmark, Check } from 'lucide-react';

const TAROT_IMAGES: Record<string, string> = {
  "愚者": "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  "魔术师": "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  "女教皇": "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  "皇后": "https://upload.wikimedia.org/wikipedia/commons/a/af/RWS_Tarot_03_Empress.jpg",
  "皇帝": "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  "教皇": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  "恋人": "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg",
  "战车": "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
  "力量": "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
  "隐士": "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
  "命运之轮": "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
  "正义": "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
  "倒吊人": "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
  "死神": "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
  "节制": "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
  "恶魔": "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
  "高塔": "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
  "星星": "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
  "月亮": "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
  "太阳": "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
  "审判": "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
  "世界": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg"
};

const MAJOR_ARCANA = Object.keys(TAROT_IMAGES);

const TarotView: React.FC<{ onSave?: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void }> = ({ onSave }) => {
  const [question, setQuestion] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.UNKNOWN);
  const [pickedCards, setPickedCards] = useState<TarotCard[]>([]);
  const [analysis, setAnalysis] = useState<TarotAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const pickCards = () => {
    const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3).map(name => ({
      name,
      image: TAROT_IMAGES[name],
      isUpright: Math.random() > 0.3
    }));
    setPickedCards(selected);
    setAnalysis(null);
    setIsSaved(false);
  };

  const handleAnalyze = async () => {
    if (!question || pickedCards.length < 3) return;
    setLoading(true);
    try {
      const result = await analyzeTarot(question, pickedCards, gender);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!analysis || !onSave) return;
    onSave({
      type: 'TAROT',
      analysis,
      pickedCards
    });
    setIsSaved(true);
  };

  const reset = () => {
    setQuestion('');
    setPickedCards([]);
    setAnalysis(null);
    setIsSaved(false);
    setGender(Gender.UNKNOWN);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-1">
        <h2 className="text-5xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent calligraphy-font">
          神秘塔罗占卜
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em] font-light">心中默念你的问题，让灵性卡片指引迷津</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {!analysis && (
          <div className="space-y-4">
            <div className="relative group">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="你想问什么？（例如：我近期的事业发展如何？）"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all min-h-[100px] shadow-inner font-light placeholder:text-slate-300 dark:placeholder:text-slate-700"
              />
              <div className="absolute top-2 right-2 text-slate-300 dark:text-slate-700">
                <Sparkles size={16} />
              </div>
            </div>

            {/* Gender Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                <User size={12} /> 问卜者性别
              </span>
              <div className="flex bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setGender(Gender.MALE)}
                  className={`flex-1 py-2 rounded-lg text-[10px] transition-all font-bold tracking-widest ${gender === Gender.MALE ? 'bg-indigo-600/10 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30 shadow-sm dark:shadow-lg ring-1 ring-indigo-500/10 dark:ring-indigo-500/20' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
                >
                  乾 (男)
                </button>
                <button
                  onClick={() => setGender(Gender.FEMALE)}
                  className={`flex-1 py-2 rounded-lg text-[10px] transition-all font-bold tracking-widest ${gender === Gender.FEMALE ? 'bg-rose-600/10 dark:bg-rose-600/30 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30 shadow-sm dark:shadow-lg ring-1 ring-rose-500/10 dark:ring-rose-500/20' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
                >
                  坤 (女)
                </button>
                <button
                  onClick={() => setGender(Gender.UNKNOWN)}
                  className={`flex-1 py-2 rounded-lg text-[10px] transition-all font-bold tracking-widest ${gender === Gender.UNKNOWN ? 'bg-slate-200 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 border border-slate-300/30 dark:border-slate-600/30 shadow-sm dark:shadow-lg' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
                >
                  潜 (隐)
                </button>
              </div>
            </div>
          </div>
        )}
        
        {pickedCards.length === 0 ? (
          <div className="relative group cursor-pointer" onClick={pickCards}>
            <div className="w-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 border border-purple-500/10 dark:border-purple-500/20 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-purple-500/30 dark:hover:border-purple-500/40 transition-all duration-500 group-hover:shadow-2xl dark:group-hover:shadow-purple-500/10">
              <div className="w-16 h-24 bg-white dark:bg-slate-800 rounded-lg border border-purple-500/10 dark:border-purple-500/30 flex items-center justify-center rotate-[-10deg] translate-x-4 opacity-40 shadow-sm"></div>
              <div className="absolute w-16 h-24 bg-white dark:bg-slate-800 rounded-lg border border-purple-500/10 dark:border-purple-500/30 flex items-center justify-center shadow-lg">
                 <Sparkles className="text-purple-600 dark:text-purple-500/50" />
              </div>
              <div className="w-16 h-24 bg-white dark:bg-slate-800 rounded-lg border border-purple-500/10 dark:border-purple-500/30 flex items-center justify-center rotate-[10deg] -translate-x-4 opacity-40 shadow-sm"></div>
              <span className="text-purple-600 dark:text-purple-400 font-bold chinese-font mt-4 text-sm tracking-widest uppercase">点击抽取命运之牌</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {pickedCards.map((card, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 animate-in zoom-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className={`
                    relative aspect-[2/3.2] w-full rounded-xl overflow-hidden border border-purple-500/10 dark:border-purple-500/20 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl shadow-purple-500/5
                    ${!card.isUpright ? 'rotate-180' : ''} transition-all duration-700 hover:scale-105 hover:border-purple-400/30
                  `}>
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-1 left-0 right-0 text-center">
                       <span className={`text-[10px] font-bold text-white tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm ${!card.isUpright ? 'rotate-180 inline-block' : ''} chinese-font`}>
                         {card.name}
                       </span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                      {idx === 0 ? '过去' : idx === 1 ? '现在' : '未来'}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${card.isUpright ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10' : 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-400/10'}`}>
                      {card.isUpright ? 'Upright' : 'Reversed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {!analysis && (
              <button
                onClick={handleAnalyze}
                disabled={loading || !question}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-900/10 dark:shadow-purple-900/20 active:scale-95 tracking-[0.2em] uppercase text-sm"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                {loading ? '正在感应时空能量...' : '解析牌阵'}
              </button>
            )}
            
            {!loading && !analysis && (
              <button onClick={reset} className="w-full text-slate-400 dark:text-slate-600 text-[10px] hover:text-slate-600 dark:hover:text-slate-400 transition-colors py-2 uppercase tracking-widest">
                清空并重新占卜
              </button>
            )}
          </div>
        )}
      </div>

      {analysis && (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg transition-colors">
              <h5 className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-3 border-b border-purple-100 dark:border-purple-500/10 pb-2">过去 / 根源</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify font-light">{analysis.pastPresentFuture?.past}</p>
            </div>
            <div className="bg-white dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg transition-colors">
              <h5 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 border-b border-indigo-100 dark:border-indigo-500/10 pb-2">现在 / 现状</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify font-light">{analysis.pastPresentFuture?.present}</p>
            </div>
            <div className="bg-white dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg transition-colors">
              <h5 className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest mb-3 border-b border-pink-100 dark:border-pink-500/10 pb-2">未来 / 趋向</h5>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify font-light">{analysis.pastPresentFuture?.future}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 border border-slate-200 dark:border-indigo-500/10 p-8 rounded-3xl relative overflow-hidden shadow-xl transition-colors">
            <div className="absolute -top-10 -right-10 opacity-[0.03] dark:opacity-5 pointer-events-none transform rotate-12">
              <Sparkles size={200} />
            </div>
            <h4 className="text-indigo-700 dark:text-indigo-400 font-bold mb-4 flex items-center gap-2 chinese-font text-xl tracking-wide">
              <Sparkles size={18} className="text-amber-500 dark:text-amber-400" /> 命运综合解读
            </h4>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed chinese-font text-lg font-light">
              {analysis.interpretation}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-start gap-4 shadow-xl transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-500/5 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 border border-purple-100 dark:border-purple-500/10">
               <LayoutTemplate size={24} />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-slate-200 font-bold mb-1 chinese-font tracking-wide">神谕建议</h4>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 leading-relaxed font-medium italic opacity-80 font-light">{analysis.advice}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold text-sm tracking-widest uppercase border ${isSaved ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100'}`}
            >
              {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
              {isSaved ? '已存入档案' : '保存结果'}
            </button>
            <button onClick={reset} className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors text-sm font-bold tracking-widest uppercase shadow-sm">
              重新占卜
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotView;
