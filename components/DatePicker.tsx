import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const formatDate = (value: string) => {
  if (!value) return '';
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return value;
  const mm = `${m}`.padStart(2, '0');
  const dd = `${d}`.padStart(2, '0');
  return `${y}/${mm}/${dd}`;
};

const parseDate = (value: string) => {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className, placeholder = '请选择日期' }) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');

  useEffect(() => {
    if (!open) return;
    const current = parseDate(value);
    const now = new Date();
    setViewYear(current?.y || now.getFullYear());
    setViewMonth(current?.m || now.getMonth() + 1);
    setViewMode('day');
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
    const offset = (firstDay + 6) % 7;
    const totalDays = new Date(viewYear, viewMonth, 0).getDate();
    return { offset, totalDays };
  }, [viewYear, viewMonth]);

  const handlePick = (day: number) => {
    const mm = `${viewMonth}`.padStart(2, '0');
    const dd = `${day}`.padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const handlePrev = () => {
    if (viewMode === 'day') {
      if (viewMonth === 1) {
        setViewYear(prev => prev - 1);
        setViewMonth(12);
      } else {
        setViewMonth(prev => prev - 1);
      }
      return;
    }
    if (viewMode === 'month') {
      setViewYear(prev => prev - 1);
      return;
    }
    setViewYear(prev => prev - 12);
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      if (viewMonth === 12) {
        setViewYear(prev => prev + 1);
        setViewMonth(1);
      } else {
        setViewMonth(prev => prev + 1);
      }
      return;
    }
    if (viewMode === 'month') {
      setViewYear(prev => prev + 1);
      return;
    }
    setViewYear(prev => prev + 12);
  };

  const handleHeaderClick = () => {
    setViewMode(prev => (prev === 'day' ? 'month' : 'year'));
  };

  const handlePickMonth = (month: number) => {
    setViewMonth(month);
    setViewMode('day');
  };

  const handlePickYear = (year: number) => {
    setViewYear(year);
    setViewMode('month');
  };

  const selected = parseDate(value);
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const yearStart = Math.floor(viewYear / 12) * 12;
  const yearRange = Array.from({ length: 12 }).map((_, idx) => yearStart + idx);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full flex items-center justify-between gap-3 ${className || 'bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200'}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={`text-left ${value ? 'opacity-100' : 'opacity-50'}`}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar size={18} className="opacity-70" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[2rem] border border-slate-200/40 dark:border-slate-800 bg-white/90 dark:bg-[#0b0f1f]/95 shadow-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900/70 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
                  aria-label="上一个月"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleHeaderClick}
                  className="text-sm font-bold chinese-font tracking-widest text-slate-800 dark:text-slate-100 hover:text-amber-500 transition-colors"
                >
                  {viewMode === 'day' && `${viewYear} 年 ${viewMonth} 月`}
                  {viewMode === 'month' && `${viewYear} 年`}
                  {viewMode === 'year' && `${yearStart} - ${yearStart + 11}`}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900/70 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
                  aria-label="下一个月"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900/70 flex items-center justify-center text-slate-500 hover:text-rose-400 transition-colors"
                aria-label="关闭"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              {viewMode === 'day' && (
                <>
                  <div className="grid grid-cols-7 text-center text-[10px] text-slate-400 tracking-widest">
                    {['一', '二', '三', '四', '五', '六', '日'].map(label => (
                      <div key={label} className="py-1">{label}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {Array.from({ length: days.offset }).map((_, idx) => (
                      <div key={`empty-${idx}`} />
                    ))}
                    {Array.from({ length: days.totalDays }).map((_, idx) => {
                      const day = idx + 1;
                      const isActive = selected?.y === viewYear && selected?.m === viewMonth && selected?.d === day;
                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          onClick={() => handlePick(day)}
                          className={`h-10 rounded-xl text-sm font-semibold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                              : 'bg-slate-100/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {viewMode === 'month' && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  {months.map((label, idx) => {
                    const month = idx + 1;
                    const isActive = selected?.y === viewYear && selected?.m === month;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handlePickMonth(month)}
                        className={`h-12 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                            : 'bg-slate-100/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
              {viewMode === 'year' && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  {yearRange.map(year => {
                    const isActive = selected?.y === year;
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handlePickYear(year)}
                        className={`h-12 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                            : 'bg-slate-100/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                        }`}
                      >
                        {year}年
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const mm = `${now.getMonth() + 1}`.padStart(2, '0');
                    const dd = `${now.getDate()}`.padStart(2, '0');
                    onChange(`${now.getFullYear()}-${mm}-${dd}`);
                    setViewYear(now.getFullYear());
                    setViewMonth(now.getMonth() + 1);
                    setViewMode('day');
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-slate-100/70 dark:bg-slate-900/60 hover:text-amber-500 transition-colors"
                >
                  今天
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-full bg-slate-100/70 dark:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
