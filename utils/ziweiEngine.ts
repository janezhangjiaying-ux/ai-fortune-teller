
import { Palace, Star, UserInfo, Gender } from '../types';

const ZODIAC_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const PALACE_NAMES = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '交友', '官禄', '田宅', '福德', '父母'];
const MAJOR_STARS = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];

/**
 * Deterministic mock calculation based on birth inputs for visual display.
 * In a real app, this would use a library like 'lunar-typescript'.
 */
export const calculateChart = (user: UserInfo): Palace[] => {
  const seed = new Date(`${user.birthDate}T${user.birthTime}`).getTime();
  const getRandom = (max: number, offset: number) => Math.floor(((seed + offset) * 9301 + 49297) % 233280) % max;

  // Simple rotation based on birth hour
  const hour = parseInt(user.birthTime.split(':')[0]);
  const startOffset = (hour + 2) % 12;

  return ZODIAC_BRANCHES.map((branch, index) => {
    const palaceIndex = (index - startOffset + 12) % 12;
    const palaceName = PALACE_NAMES[palaceIndex];
    
    // Assign stars
    const stars: Star[] = [];
    
    // 1-2 major stars per palace
    const majorCount = (getRandom(3, index) > 0) ? 1 : 0;
    for(let i=0; i<majorCount; i++) {
      stars.push({
        name: MAJOR_STARS[getRandom(MAJOR_STARS.length, index * 10 + i)],
        type: 'MAJOR',
        level: 5
      });
    }

    // Some random lucky/unlucky stars
    if (getRandom(10, index * 2) > 7) {
      stars.push({ name: '文昌', type: 'LUCKY', level: 4 });
    }
    if (getRandom(10, index * 3) > 8) {
      stars.push({ name: '擎羊', type: 'UNLUCKY', level: 3 });
    }

    return {
      id: index,
      zodiac: branch,
      name: palaceName,
      stars,
      isMainPalace: palaceName === '命宫'
    };
  });
};
