import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Palace } from '../../types';

interface PalaceBoxProps {
  palace: Palace;
  onClick: () => void;
  active: boolean;
}

const PalaceBox: React.FC<PalaceBoxProps> = ({ palace, onClick, active }) => {
  const isMain = palace.name === '命宫';

  // 根据宫位名称返回对应的emoji
  const getPalaceEmoji = (name: string) => {
    const emojiMap: { [key: string]: string } = {
      '命宫': '⭐',
      '兄弟': '👥',
      '夫妻': '💕',
      '子女': '👶',
      '财帛': '💰',
      '疾厄': '🏥',
      '迁移': '✈️',
      '交友': '🤝',
      '官禄': '👑',
      '田宅': '🏠',
      '福德': '🙏',
      '父母': '👴👵'
    };
    return emojiMap[name] || '🔮';
  };

  return (
    <View
      onClick={onClick}
      style={{
        position: 'relative',
        height: '200rpx',
        width: '100%',
        padding: '16rpx',
        borderRadius: '24rpx',
        border: active ? '2rpx solid #d97706' : '1rpx solid #e2e8f0',
        backgroundColor: active ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.8)',
        boxShadow: active ? '0 8rpx 16rpx rgba(245, 158, 11, 0.2)' : '0 4rpx 8rpx rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      {/* 顶部布局：宫位标签与地支 */}
      <View style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%'
      }}>
        <View style={{
          padding: '4rpx 12rpx',
          borderRadius: '12rpx',
          fontSize: '20rpx',
          fontWeight: 'bold',
          backgroundColor: isMain ? '#d97706' : active ? 'rgba(245, 158, 11, 0.1)' : 'rgba(241, 245, 249, 0.8)',
          color: isMain ? '#ffffff' : active ? '#d97706' : '#64748b',
          border: active && !isMain ? '1rpx solid rgba(245, 158, 11, 0.3)' : 'none'
        }}>
          {palace.name}
        </View>
        <Text style={{
          fontSize: '20rpx',
          fontWeight: 'bold',
          color: active ? '#d97706' : '#94a3b8'
        }}>
          {palace.zodiac}
        </Text>
      </View>

      {/* 中间内容：emoji和星曜 */}
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      }}>
        <Text style={{
          fontSize: '48rpx',
          marginBottom: '16rpx',
          opacity: active ? 0.8 : 0.4
        }}>
          {getPalaceEmoji(palace.name)}
        </Text>

        <View style={{ display: 'flex', flexDirection: 'column', gap: '4rpx' }}>
          {palace.stars.map((star, i) => (
            <View key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8rpx'
            }}>
              <Text style={{
                fontSize: '22rpx',
                fontWeight: 'bold',
                color: star.type === 'MAJOR' ? '#d97706' :
                       star.type === 'UNLUCKY' ? '#dc2626' : '#059669'
              }}>
                {star.name}
              </Text>
              {star.type === 'MAJOR' && (
                <Text style={{
                  fontSize: '16rpx',
                  backgroundColor: 'rgba(241, 245, 249, 0.6)',
                  padding: '2rpx 6rpx',
                  borderRadius: '6rpx',
                  color: '#64748b'
                }}>
                  庙
                </Text>
              )}
            </View>
          ))}
          {palace.stars.length === 0 && (
            <Text style={{
              fontSize: '18rpx',
              color: '#94a3b8',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              空宫
            </Text>
          )}
        </View>
      </View>

      {/* 底部宫位背景字 */}
      <View style={{
        position: 'absolute',
        bottom: '8rpx',
        right: '8rpx',
        fontSize: '32rpx',
        fontWeight: 'bold',
        color: active ? 'rgba(217, 119, 6, 0.2)' : 'rgba(148, 163, 184, 0.1)',
        pointerEvents: 'none'
      }}>
        {palace.zodiac}
      </View>
    </View>
  );
};

export default PalaceBox;