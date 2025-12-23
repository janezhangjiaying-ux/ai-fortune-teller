import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ModeSelection from '../../components/ModeSelection';
import './index.scss';

type ViewMode = 'ASTROLOGY' | 'TAROT' | 'DREAM' | 'HUANGLI' | 'HISTORY' | 'PROFILE';
type Theme = 'light' | 'dark';

const Index: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<ViewMode | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');

  const handleModeSelect = (mode: ViewMode) => {
    if (mode === 'ASTROLOGY') {
      // 紫微命理需要先填写用户信息
      Taro.navigateTo({
        url: '/pages/user-info/index'
      });
    } else if (mode === 'TAROT') {
      // 塔罗牌直接跳转
      Taro.navigateTo({
        url: '/pages/tarot/index'
      });
    } else if (mode === 'DREAM') {
      // 梦境解析直接跳转
      Taro.navigateTo({
        url: '/pages/dream/index'
      });
    } else if (mode === 'HUANGLI') {
      // 黄历直接跳转
      Taro.navigateTo({
        url: '/pages/huangli/index'
      });
    } else if (mode === 'HISTORY') {
      // 历史记录直接跳转
      Taro.navigateTo({
        url: '/pages/history/index'
      });
    } else {
      // 其他功能暂时显示开发中
      Taro.showToast({
        title: `${mode}功能开发中`,
        icon: 'none'
      });
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <View className={`index ${theme}`}>
      <ModeSelection onSelect={handleModeSelect} onToggleTheme={handleToggleTheme} theme={theme} />
    </View>
  );
};

export default Index;