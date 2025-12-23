
import React from 'react';
import { HistoryRecord, RecordType, DreamAnalysis } from '../types';
import { Trash2, Calendar, ChevronRight, Clock } from 'lucide-react';
import { MysticTarotIcon, ZiweiWheelIcon, DreamInterpretationIcon } from './Icons';

interface HistoryViewProps {
  records: HistoryRecord[];
  onDelete: (id: string) => void;
  onSelect: (record: HistoryRecord) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records, onDelete, onSelect, onBack }) => {
  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordIcon = (type: RecordType) => {
    switch (type) {
      case 'ASTROLOGY': return <ZiweiWheelIcon size={24} />;
      case 'TAROT': return <MysticTarotIcon size={24} />;
      case 'DREAM': return <DreamInterpretationIcon size={24} />;
      default: return <Clock size={24} />;
    }
  };

  const getRecordColor = (type: RecordType) => {
    switch (type) {
      case 'ASTROLOGY': return 'bg-amber-500/10 text-amber-600 dark:text-amber-500';
      case 'TAROT': return 'bg-purple-500/10 text-purple-600 dark:text-purple-500';
      case 'DREAM': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-500';
      default: return 'bg-slate-500/10 text-slate-600';
    }
  };

  const getRecordTitle = (record: HistoryRecord) => {
    if (record.type === 'ASTROLOGY') {
      return record.userInfo?.name || '个人命盘推演';
    }
    if (record.type === 'TAROT') return '神秘塔罗占卜';
    if (record.type === 'DREAM') {
      const content = (record.analysis as DreamAnalysis).dreamContent;
      return content.length > 10 ? content.substring(0, 10) + '...' : content;
    }
    return '历史记录';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto px-4">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl bg-gradient-to-r from-amber-600 to-indigo-700 dark:from-amber-200 dark:to-indigo-400 bg-clip-text text-transparent calligraphy-font">
          万象档案室
        </h2>
        <p className="text-slate-500 text-xs tracking-[0.3em] uppercase font-light">回顾您的万象轨迹</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-4">
          <div className="text-slate-300 dark:text-slate-700 flex justify-center">
            <Clock size={48} strokeWidth={1} />
          </div>
          <p className="text-slate-400 dark:text-slate-500 chinese-font text-sm tracking-widest">尚无保存的万象记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.sort((a, b) => b.timestamp - a.timestamp).map((record) => (
            <div 
              key={record.id}
              className="group bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-500/30 transition-all cursor-pointer relative overflow-hidden shadow-sm dark:shadow-none"
              onClick={() => onSelect(record)}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getRecordColor(record.type)}`}>
                {getRecordIcon(record.type)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-100 chinese-font truncate">
                    {getRecordTitle(record)}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                    {record.type === 'ASTROLOGY' ? '命理' : record.type === 'DREAM' ? '解梦' : '占卜'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(record.timestamp)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(record.id);
                  }}
                  className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={20} className="text-slate-300 dark:text-slate-700" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
