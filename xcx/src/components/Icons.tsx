import React from 'react';

// 借鉴罗盘图片设计的紫微斗数专属图标
export const ZiweiWheelIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10.5" />
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30) * (Math.PI / 180);
      const x = 12 + 8.5 * Math.cos(angle);
      const y = 12 + 8.5 * Math.sin(angle);
      return <circle key={i} cx={x} cy={y} r="1" fill="currentColor" fillOpacity="0.5" stroke="none" />;
    })}
    {[...Array(24)].map((_, i) => {
      const angle = (i * 15) * (Math.PI / 180);
      const x1 = 12 + 6.5 * Math.cos(angle);
      const y1 = 12 + 6.5 * Math.sin(angle);
      const x2 = 12 + 5.5 * Math.cos(angle);
      const y2 = 12 + 5.5 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.4" />;
    })}
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <path d="M12 9.5l0.8 2.5-0.8 0.5-0.8-0.5z" fill="currentColor" opacity="0.8" />
    <path d="M12 14.5l-0.5-2.5 0.5-0.3 0.5 0.3z" opacity="0.5" />
  </svg>
);

export const MysticTarotIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="11" strokeDasharray="1 3" opacity="0.3" />
    <path d="M12 2a10 10 0 1 0 10 10 7.5 7.5 0 0 1-10-10Z" fill="currentColor" fillOpacity="0.05" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 7.5v-2" />
    <path d="M12 18.5v-2" />
    <path d="M7.5 12h-2" />
    <path d="M18.5 12h-2" />
    <path d="M8.8 8.8l-1.4-1.4" />
    <path d="M16.6 16.6l-1.4-1.4" />
    <path d="M8.8 15.2l-1.4 1.4" />
    <path d="M16.6 7.4l-1.4 1.4" />
    <path d="M12 2v1" opacity="0.5" />
    <path d="M22 12h-1" opacity="0.5" />
  </svg>
);

// 借鉴用户提供的梦境图标设计的专属图标
export const DreamInterpretationIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* 新月部分 */}
    <path d="M11 5.5a7 7 0 0 1 8 11 8.5 8.5 0 0 0-5-10.5 8.5 8.5 0 0 0-3-0.5z" />

    {/* 睡眠符号 ZZZ */}
    <path d="M14 3h2l-2 2h2" strokeWidth="0.8" />
    <path d="M17.5 1.5h1.5l-1.5 1.5h1.5" strokeWidth="0.6" />
    <path d="M11 2.5h1.5l-1.5 1.5h1.5" strokeWidth="0.6" opacity="0.5" />

    {/* 云朵部分 - 位于左下方覆盖月亮 */}
    <path d="M3 15.5c0-2 1.5-3.5 3.5-3.5 0.5 0 1 0.1 1.4 0.3C9 10.5 11 9.5 13 9.5c2.5 0 4.5 1.8 4.9 4.2 1.2 0.3 2.1 1.4 2.1 2.8 0 1.7-1.3 3-3 3H6c-1.7 0-3-1.3-3-3z" fill="currentColor" fillOpacity="0.05" />
  </svg>
);