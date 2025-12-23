import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { HistoryRecord, RecordType, DreamAnalysis } from '../../types';

const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    // 从本地存储加载历史记录
    const savedRecords = Taro.getStorageSync('historyRecords') || [];
    setRecords(savedRecords);
  }, []);

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
      case 'ASTROLOGY': return '⭐';
      case 'TAROT': return '🔮';
      case 'DREAM': return '💭';
      default: return '📝';
    }
  };

  const getRecordColor = (type: RecordType) => {
    switch (type) {
      case 'ASTROLOGY': return '#d97706';
      case 'TAROT': return '#9333ea';
      case 'DREAM': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getRecordTitle = (record: HistoryRecord) => {
    if (record.type === 'ASTROLOGY') {
      return record.userInfo?.name ? `${record.userInfo.name}的命盘` : '个人命盘推演';
    }
    if (record.type === 'TAROT') return '神秘塔罗占卜';
    if (record.type === 'DREAM') {
      const content = (record.analysis as DreamAnalysis).dreamContent;
      return content.length > 10 ? content.substring(0, 10) + '...' : content;
    }
    return '历史记录';
  };

  const getRecordTypeText = (type: RecordType) => {
    switch (type) {
      case 'ASTROLOGY': return '命理';
      case 'TAROT': return '占卜';
      case 'DREAM': return '解梦';
      default: return '记录';
    }
  };

  const handleDelete = (id: string) => {
    const newRecords = records.filter(record => record.id !== id);
    setRecords(newRecords);
    Taro.setStorageSync('historyRecords', newRecords);
    Taro.showToast({
      title: '删除成功',
      icon: 'success'
    });
  };

  const handleSelect = (record: HistoryRecord) => {
    // 根据记录类型跳转到对应页面
    let url = '';
    switch (record.type) {
      case 'ASTROLOGY':
        url = `/pages/astrology/index?birthDate=${record.userInfo?.birthDate}&birthTime=${record.userInfo?.birthTime}&gender=${record.userInfo?.gender}&birthPlace=${encodeURIComponent(record.userInfo?.birthPlace || '')}&name=${encodeURIComponent(record.userInfo?.name || '')}`;
        break;
      case 'TAROT':
        url = `/pages/tarot/index?question=${encodeURIComponent((record.analysis as any).question || '')}`;
        break;
      case 'DREAM':
        url = `/pages/dream/index?content=${encodeURIComponent((record.analysis as DreamAnalysis).dreamContent)}`;
        break;
    }

    if (url) {
      Taro.navigateTo({ url });
    }
  };

  const clearAllHistory = () => {
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          setRecords([]);
          Taro.setStorageSync('historyRecords', []);
          Taro.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  };

  return (
    <ScrollView
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        position: 'relative'
      }}
      scrollY
    >
      {/* 星尘背景纹理 */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
        opacity: 0.6,
        pointerEvents: 'none'
      }} />

      {/* 标题区域 */}
      <View style={{
        padding: '48rpx',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #d97706, #6366f1)',
        color: '#ffffff',
        position: 'relative',
        zIndex: 10
      }}>
        <Text style={{
          fontSize: '48rpx',
          fontWeight: 'bold',
          marginBottom: '16rpx'
        }}>
          万象档案室
        </Text>
        <Text style={{
          fontSize: '24rpx',
          opacity: 0.9
        }}>
          回顾您的万象轨迹
        </Text>
      </View>

      {/* 操作区域 */}
      {records.length > 0 && (
        <View style={{
          padding: '32rpx',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Button
            onClick={clearAllHistory}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '24rpx',
              padding: '16rpx 32rpx',
              borderRadius: '16rpx',
              border: 'none'
            }}
          >
            🗑️ 清空记录
          </Button>
        </View>
      )}

      {/* 历史记录列表 */}
      <View style={{
        padding: '32rpx'
      }}>
        {records.length === 0 ? (
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '32rpx',
            padding: '96rpx',
            textAlign: 'center',
            boxShadow: '0 10rpx 25rpx rgba(0, 0, 0, 0.1)'
          }}>
            <Text style={{
              fontSize: '64rpx',
              marginBottom: '32rpx',
              opacity: 0.5
            }}>
              📝
            </Text>
            <Text style={{
              fontSize: '28rpx',
              color: '#6b7280'
            }}>
              尚无保存的万象记录
            </Text>
            <Text style={{
              fontSize: '24rpx',
              color: '#9ca3af',
              marginTop: '16rpx'
            }}>
              开始您的第一次探索吧！
            </Text>
          </View>
        ) : (
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24rpx'
          }}>
            {records
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((record) => (
                <View
                  key={record.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '24rpx',
                    padding: '32rpx',
                    boxShadow: '0 4rpx 8rpx rgba(0, 0, 0, 0.1)',
                    border: `2rpx solid ${getRecordColor(record.type)}20`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24rpx'
                  }}
                  onClick={() => handleSelect(record)}
                >
                  {/* 图标 */}
                  <View style={{
                    width: '80rpx',
                    height: '80rpx',
                    borderRadius: '16rpx',
                    backgroundColor: `${getRecordColor(record.type)}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      fontSize: '40rpx'
                    }}>
                      {getRecordIcon(record.type)}
                    </Text>
                  </View>

                  {/* 内容 */}
                  <View style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8rpx'
                  }}>
                    <View style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16rpx'
                    }}>
                      <Text style={{
                        fontSize: '28rpx',
                        fontWeight: 'bold',
                        color: '#1e293b',
                        flex: 1
                      }}>
                        {getRecordTitle(record)}
                      </Text>
                      <View style={{
                        backgroundColor: `${getRecordColor(record.type)}20`,
                        borderRadius: '12rpx',
                        padding: '4rpx 12rpx'
                      }}>
                        <Text style={{
                          fontSize: '20rpx',
                          color: getRecordColor(record.type),
                          fontWeight: 'bold'
                        }}>
                          {getRecordTypeText(record.type)}
                        </Text>
                      </View>
                    </View>

                    <Text style={{
                      fontSize: '22rpx',
                      color: '#6b7280'
                    }}>
                      📅 {formatDate(record.timestamp)}
                    </Text>
                  </View>

                  {/* 删除按钮 */}
                  <Button
                    onClick={() => handleDelete(record.id)}
                    style={{
                      width: '60rpx',
                      height: '60rpx',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{
                      fontSize: '24rpx',
                      color: '#dc2626'
                    }}>
                      🗑️
                    </Text>
                  </Button>
                </View>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HistoryPage;