import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import PalaceBox from '../../components/PalaceBox';
import { Palace, UserInfo, AIAnalysis } from '../../types';
import { calculateChart } from '../../utils/ziweiEngine';
import { analyzeDestiny } from '../../services/geminiService';

const AstrologyPage: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [chart, setChart] = useState<Palace[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);

  useEffect(() => {
    // 获取传递的用户信息
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const userInfo = currentPage.options;

    if (userInfo && userInfo.birthDate) {
      const userData: UserInfo = {
        name: userInfo.name || '',
        birthDate: userInfo.birthDate,
        birthTime: userInfo.birthTime || '12:00',
        gender: userInfo.gender === 'FEMALE' ? 1 : 0,
        birthPlace: userInfo.birthPlace || ''
      };
      setUser(userData);
      generateChart(userData);
    }
  }, []);

  const generateChart = async (userInfo: UserInfo) => {
    try {
      setIsAnalyzing(true);
      const palaces = calculateChart(userInfo);
      setChart(palaces);

      // AI分析
      const aiAnalysis = await analyzeDestiny(userInfo, palaces);
      setAnalysis(aiAnalysis);
    } catch (error) {
      console.error('生成命盘失败:', error);
      Taro.showToast({
        title: '生成命盘失败',
        icon: 'none'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePalaceClick = (index: number) => {
    setSelectedPalace(selectedPalace === index ? null : index);
  };

  if (isAnalyzing) {
    return (
      <>
        <View style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '48rpx', marginBottom: '32rpx' }}>🔮</Text>
            <Text style={{ fontSize: '32rpx', color: '#64748b' }}>正在排盘解析...</Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
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
        background: 'linear-gradient(135deg, #d97706, #7c3aed)',
        color: '#ffffff',
        position: 'relative',
        zIndex: 10
      }}>
        <Text style={{
          fontSize: '48rpx',
          fontWeight: 'bold',
          marginBottom: '16rpx'
        }}>
          紫微命理
        </Text>
        <Text style={{
          fontSize: '24rpx',
          opacity: 0.9
        }}>
          千年星命智慧，解析人生格局
        </Text>
      </View>

      {/* 命盘展示区 */}
      <View style={{
        position: 'relative',
        zIndex: 10,
        padding: '48rpx',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <View style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '16rpx',
          aspectRatio: 1,
          maxWidth: '600rpx',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '32rpx',
          borderRadius: '80rpx',
          border: '2rpx solid rgba(226, 232, 240, 0.5)',
          boxShadow: '0 25rpx 50rpx -12rpx rgba(0, 0, 0, 0.25)'
        }}>
          {/* 中央玄盘 */}
          <View style={{
            gridColumnStart: 2,
            gridColumnEnd: 4,
            gridRowStart: 2,
            gridRowEnd: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(241, 245, 249, 0.5)',
            borderRadius: '64rpx',
            boxShadow: 'inset 0 4rpx 8rpx rgba(0, 0, 0, 0.1)',
            padding: '32rpx',
            textAlign: 'center'
          }}>
            <Text style={{
              fontSize: '96rpx',
              marginBottom: '24rpx',
              opacity: 0.4
            }}>
              ⭐
            </Text>
            <Text style={{
              fontSize: '48rpx',
              fontWeight: 'bold',
              color: '#d97706',
              marginBottom: '8rpx'
            }}>
              玄盘
            </Text>
            <Text style={{
              fontSize: '20rpx',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '2rpx'
            }}>
              Celestial Mapping
            </Text>
          </View>

          {/* 宫位布局 */}
          {chart.map((palace, i) => {
            const position = gridPositions[i];
            return (
              <View
                key={palace.id}
                style={{
                  gridRow: position.r,
                  gridColumn: position.c,
                  position: 'relative'
                }}
              >
                <PalaceBox
                  palace={palace}
                  active={selectedPalace === i}
                  onClick={() => handlePalaceClick(i)}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* 解析结果 */}
      {analysis && (
        <View style={{
          padding: '0 48rpx 96rpx',
          position: 'relative',
          zIndex: 10
        }}>
          {/* 命格综述 */}
          <View style={{
            padding: '64rpx',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(255, 255, 255, 1), rgba(99, 102, 241, 0.1))',
            borderRadius: '96rpx',
            border: '2rpx solid rgba(245, 158, 11, 0.2)',
            boxShadow: '0 25rpx 50rpx -12rpx rgba(0, 0, 0, 0.25)',
            marginBottom: '48rpx',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 装饰性光效 */}
            <View style={{
              position: 'absolute',
              top: '-80rpx',
              right: '-80rpx',
              width: '200rpx',
              height: '200rpx',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)'
            }} />

            <View style={{
              position: 'relative',
              zIndex: 2
            }}>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24rpx',
                marginBottom: '32rpx'
              }}>
                <Text style={{ fontSize: '48rpx' }}>⭐</Text>
                <Text style={{
                  fontSize: '36rpx',
                  fontWeight: 'bold',
                  color: '#d97706',
                  letterSpacing: '2rpx'
                }}>
                  命格格局综述
                </Text>
              </View>
              <Text style={{
                fontSize: '28rpx',
                color: '#1e293b',
                lineHeight: '48rpx',
                fontStyle: 'italic'
              }}>
                "{analysis.summary}"
              </Text>
            </View>
          </View>

          {/* 深度推演模块 */}
          <View style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32rpx'
          }}>
            {/* 心性特质 */}
            <View style={{
              padding: '48rpx',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '64rpx',
              border: '2rpx solid rgba(226, 232, 240, 1)',
              boxShadow: '0 20rpx 25rpx -5rpx rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(20rpx)'
            }}>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24rpx',
                marginBottom: '32rpx'
              }}>
                <Text style={{ fontSize: '40rpx' }}>🧠</Text>
                <Text style={{
                  fontSize: '32rpx',
                  fontWeight: 'bold',
                  color: '#4338ca'
                }}>
                  心性特质推演
                </Text>
              </View>
              <Text style={{
                fontSize: '26rpx',
                color: '#64748b',
                lineHeight: '44rpx',
                textAlign: 'justify'
              }}>
                {analysis.personality}
              </Text>
            </View>

            {/* 事业成就 */}
            <View style={{
              padding: '48rpx',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '64rpx',
              border: '2rpx solid rgba(226, 232, 240, 1)',
              boxShadow: '0 20rpx 25rpx -5rpx rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(20rpx)'
            }}>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24rpx',
                marginBottom: '32rpx'
              }}>
                <Text style={{ fontSize: '40rpx' }}>💼</Text>
                <Text style={{
                  fontSize: '32rpx',
                  fontWeight: 'bold',
                  color: '#2563eb'
                }}>
                  事业成就高度
                </Text>
              </View>
              <Text style={{
                fontSize: '26rpx',
                color: '#64748b',
                lineHeight: '44rpx',
                textAlign: 'justify'
              }}>
                {analysis.career}
              </Text>
            </View>

            {/* 财帛资财 */}
            <View style={{
              padding: '48rpx',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '64rpx',
              border: '2rpx solid rgba(226, 232, 240, 1)',
              boxShadow: '0 20rpx 25rpx -5rpx rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(20rpx)'
            }}>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24rpx',
                marginBottom: '32rpx'
              }}>
                <Text style={{ fontSize: '40rpx' }}>💰</Text>
                <Text style={{
                  fontSize: '32rpx',
                  fontWeight: 'bold',
                  color: '#d97706'
                }}>
                  财帛资财格局
                </Text>
              </View>
              <Text style={{
                fontSize: '26rpx',
                color: '#64748b',
                lineHeight: '44rpx',
                textAlign: 'justify'
              }}>
                {analysis.wealth}
              </Text>
            </View>

            {/* 情感缘分 */}
            <View style={{
              padding: '48rpx',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '64rpx',
              border: '2rpx solid rgba(226, 232, 240, 1)',
              boxShadow: '0 20rpx 25rpx -5rpx rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(20rpx)'
            }}>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24rpx',
                marginBottom: '32rpx'
              }}>
                <Text style={{ fontSize: '40rpx' }}>💕</Text>
                <Text style={{
                  fontSize: '32rpx',
                  fontWeight: 'bold',
                  color: '#dc2626'
                }}>
                  情感缘分契机
                </Text>
              </View>
              <Text style={{
                fontSize: '26rpx',
                color: '#64748b',
                lineHeight: '44rpx',
                textAlign: 'justify'
              }}>
                {analysis.relationship}
              </Text>
            </View>
          </View>
        </View>
      )}
      <View style={{
        padding: '32rpx',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16rpx'
      }}>
        {chart.map((palace, index) => (
          <PalaceBox
            key={index}
            palace={palace}
            active={selectedPalace === index}
            onClick={() => handlePalaceClick(index)}
          />
        ))}
      </View>

      {/* AI分析结果 */}
      {analysis && (
        <View style={{
          margin: '32rpx',
          padding: '48rpx',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '32rpx',
          boxShadow: '0 10rpx 25rpx rgba(0, 0, 0, 0.1)'
        }}>
          <Text style={{
            fontSize: '36rpx',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '32rpx',
            textAlign: 'center'
          }}>
            🤖 AI 命理解析
          </Text>

          <View style={{ marginBottom: '32rpx' }}>
            <Text style={{
              fontSize: '28rpx',
              fontWeight: 'bold',
              color: '#d97706',
              marginBottom: '16rpx'
            }}>
              性格特征
            </Text>
            <Text style={{
              fontSize: '26rpx',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {analysis.personality}
            </Text>
          </View>

          <View style={{ marginBottom: '32rpx' }}>
            <Text style={{
              fontSize: '28rpx',
              fontWeight: 'bold',
              color: '#d97706',
              marginBottom: '16rpx'
            }}>
              事业运势
            </Text>
            <Text style={{
              fontSize: '26rpx',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {analysis.career}
            </Text>
          </View>

          <View style={{ marginBottom: '32rpx' }}>
            <Text style={{
              fontSize: '28rpx',
              fontWeight: 'bold',
              color: '#d97706',
              marginBottom: '16rpx'
            }}>
              感情姻缘
            </Text>
            <Text style={{
              fontSize: '26rpx',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {analysis.relationships}
            </Text>
          </View>

          <View>
            <Text style={{
              fontSize: '28rpx',
              fontWeight: 'bold',
              color: '#d97706',
              marginBottom: '16rpx'
            }}>
              健康建议
            </Text>
            <Text style={{
              fontSize: '26rpx',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {analysis.health}
            </Text>
          </View>
        </View>
      )}

      {/* 底部导航 */}
      <View style={{
        padding: '32rpx',
        display: 'flex',
        gap: '16rpx'
      }}>
        <View style={{
          flex: 1,
          padding: '24rpx',
          backgroundColor: '#4f46e5',
          borderRadius: '24rpx',
          textAlign: 'center'
        }}>
          <Text style={{
            color: '#ffffff',
            fontSize: '28rpx',
            fontWeight: 'bold'
          }}>
            💾 保存结果
          </Text>
        </View>
        <View style={{
          flex: 1,
          padding: '24rpx',
          backgroundColor: '#059669',
          borderRadius: '24rpx',
          textAlign: 'center'
        }}>
          <Text style={{
            color: '#ffffff',
            fontSize: '28rpx',
            fontWeight: 'bold'
          }}>
            🔄 重新分析
          </Text>
        </View>
      </View>
    </ScrollView>
    </>
  );
};

export default AstrologyPage;