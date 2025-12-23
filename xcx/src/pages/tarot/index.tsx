import React, { useState } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TarotCard, TarotAnalysis } from '../../types';
import { analyzeTarot } from '../../services/geminiService';

// 塔罗牌数据
const MAJOR_ARCANA = [
  "愚者", "魔术师", "女教皇", "皇后", "皇帝", "教皇",
  "恋人", "战车", "力量", "隐士", "命运之轮", "正义",
  "倒吊人", "死神", "节制", "恶魔", "高塔", "星星",
  "月亮", "太阳", "审判", "世界"
];

const TarotPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [pickedCards, setPickedCards] = useState<TarotCard[]>([]);
  const [analysis, setAnalysis] = useState<TarotAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [pickingPhase, setPickingPhase] = useState<'IDLE' | 'PICKING' | 'DONE'>('IDLE');

  const startPicking = () => {
    if (!question.trim()) {
      Taro.showToast({
        title: '请输入问题',
        icon: 'none'
      });
      return;
    }
    setPickingPhase('PICKING');
    setAnalysis(null);
    setPickedCards([]);
  };

  const pickCard = () => {
    if (pickedCards.length >= 3) return;

    const availableCards = MAJOR_ARCANA.filter(card =>
      !pickedCards.some(picked => picked.name === card)
    );

    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    const isUpright = Math.random() > 0.3;

    const newCard: TarotCard = {
      name: randomCard,
      image: '', // 小程序中暂时不使用图片
      isUpright
    };

    setPickedCards(prev => [...prev, newCard]);

    if (pickedCards.length + 1 >= 3) {
      setPickingPhase('DONE');
    }
  };

  const handleAnalyze = async () => {
    if (pickedCards.length < 3) return;

    setLoading(true);
    try {
      const result = await analyzeTarot(question, pickedCards, 0); // 默认性别
      setAnalysis(result);
    } catch (error) {
      console.error('塔罗分析失败:', error);
      Taro.showToast({
        title: '分析失败，请重试',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuestion('');
    setPickedCards([]);
    setAnalysis(null);
    setPickingPhase('IDLE');
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
        background: 'radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
        opacity: 0.6,
        pointerEvents: 'none'
      }} />

      {/* 标题区域 */}
      <View style={{
        padding: '48rpx',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
        color: '#ffffff',
        position: 'relative',
        zIndex: 10
      }}>
        <Text style={{
          fontSize: '48rpx',
          fontWeight: 'bold',
          marginBottom: '16rpx'
        }}>
          神秘塔罗
        </Text>
        <Text style={{
          fontSize: '24rpx',
          opacity: 0.9
        }}>
          西洋神秘占卜，寻找内心的答案
        </Text>
      </View>

      {/* 问题输入 */}
      <View style={{
        padding: '32rpx',
        marginBottom: '32rpx'
      }}>
        <Text style={{
          fontSize: '28rpx',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '16rpx'
        }}>
          💭 请输入您的问题
        </Text>
        <Input
          value={question}
          onInput={(e) => setQuestion(e.detail.value)}
          placeholder="例如：我的感情运势如何？"
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1rpx solid #e2e8f0',
            borderRadius: '16rpx',
            padding: '24rpx',
            fontSize: '28rpx',
            color: '#374151'
          }}
        />
      </View>

      {/* 塔罗牌选择 */}
      {pickingPhase === 'IDLE' && (
        <View style={{
          padding: '32rpx',
          textAlign: 'center'
        }}>
          <Button
            onClick={startPicking}
            style={{
              background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
              color: '#ffffff',
              fontSize: '32rpx',
              fontWeight: 'bold',
              padding: '40rpx 80rpx',
              borderRadius: '32rpx',
              border: 'none',
              boxShadow: '0 10rpx 15rpx -3rpx rgba(147, 51, 234, 0.3)'
            }}
          >
            🔮 开始抽牌
          </Button>
        </View>
      )}

      {pickingPhase === 'PICKING' && (
        <View style={{
          padding: '32rpx',
          textAlign: 'center'
        }}>
          <Text style={{
            fontSize: '32rpx',
            color: '#6b7280',
            marginBottom: '32rpx'
          }}>
            已抽取 {pickedCards.length}/3 张牌
          </Text>

          <View style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32rpx',
            marginBottom: '48rpx'
          }}>
            {pickedCards.map((card, index) => (
              <View
                key={index}
                style={{
                  width: '120rpx',
                  height: '180rpx',
                  backgroundColor: '#7c3aed',
                  borderRadius: '16rpx',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8rpx 16rpx rgba(124, 58, 237, 0.3)'
                }}
              >
                <Text style={{
                  fontSize: '48rpx',
                  color: '#ffffff'
                }}>
                  🃏
                </Text>
              </View>
            ))}
          </View>

          {pickedCards.length < 3 && (
            <Button
              onClick={pickCard}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                fontSize: '32rpx',
                fontWeight: 'bold',
                padding: '40rpx 80rpx',
                borderRadius: '32rpx',
                border: 'none',
                boxShadow: '0 10rpx 15rpx -3rpx rgba(245, 158, 11, 0.3)'
              }}
            >
              🎯 抽取第{pickedCards.length + 1}张牌
            </Button>
          )}

          {pickedCards.length === 3 && (
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                fontSize: '32rpx',
                fontWeight: 'bold',
                padding: '40rpx 80rpx',
                borderRadius: '32rpx',
                border: 'none',
                boxShadow: '0 10rpx 15rpx -3rpx rgba(16, 185, 129, 0.3)'
              }}
            >
              {loading ? '🔄 分析中...' : '🤖 开始分析'}
            </Button>
          )}
        </View>
      )}

      {/* 分析结果 */}
      {analysis && pickingPhase === 'DONE' && (
        <View style={{
          padding: '32rpx'
        }}>
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '32rpx',
            padding: '48rpx',
            boxShadow: '0 10rpx 25rpx rgba(0, 0, 0, 0.1)'
          }}>
            <Text style={{
              fontSize: '36rpx',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '32rpx',
              textAlign: 'center'
            }}>
              🔮 塔罗解析结果
            </Text>

            {/* 显示抽取的牌 */}
            <View style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: '48rpx'
            }}>
              {pickedCards.map((card, index) => (
                <View key={index} style={{ textAlign: 'center' }}>
                  <View style={{
                    width: '100rpx',
                    height: '150rpx',
                    backgroundColor: '#7c3aed',
                    borderRadius: '12rpx',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16rpx',
                    boxShadow: '0 4rpx 8rpx rgba(124, 58, 237, 0.3)'
                  }}>
                    <Text style={{ fontSize: '40rpx', color: '#ffffff' }}>🃏</Text>
                  </View>
                  <Text style={{
                    fontSize: '24rpx',
                    fontWeight: 'bold',
                    color: '#374151',
                    marginBottom: '8rpx'
                  }}>
                    {card.name}
                  </Text>
                  <Text style={{
                    fontSize: '20rpx',
                    color: card.isUpright ? '#059669' : '#dc2626'
                  }}>
                    {card.isUpright ? '正位' : '逆位'}
                  </Text>
                </View>
              ))}
            </View>

            {/* 问题显示 */}
            <View style={{
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              borderRadius: '24rpx',
              padding: '32rpx',
              marginBottom: '32rpx'
            }}>
              <Text style={{
                fontSize: '28rpx',
                color: '#6b7280',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                "{question}"
              </Text>
            </View>

            {/* 解析内容 */}
            <View style={{ marginBottom: '32rpx' }}>
              <Text style={{
                fontSize: '28rpx',
                fontWeight: 'bold',
                color: '#9333ea',
                marginBottom: '16rpx'
              }}>
                📖 综合解读
              </Text>
              <Text style={{
                fontSize: '26rpx',
                color: '#374151',
                lineHeight: '1.6'
              }}>
                {analysis.interpretation}
              </Text>
            </View>

            {/* 过去现在未来 */}
            {analysis.pastPresentFuture && (
              <View>
                <Text style={{
                  fontSize: '28rpx',
                  fontWeight: 'bold',
                  color: '#9333ea',
                  marginBottom: '24rpx'
                }}>
                  🔍 时间维度分析
                </Text>
                <View style={{ display: 'flex', flexDirection: 'column', gap: '24rpx' }}>
                  {[
                    { key: 'past', label: '过去', color: '#8b5cf6' },
                    { key: 'present', label: '现在', color: '#3b82f6' },
                    { key: 'future', label: '未来', color: '#06b6d4' }
                  ].map(({ key, label, color }) => (
                    <View key={key} style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '16rpx',
                      padding: '24rpx',
                      border: `2rpx solid ${color}20`
                    }}>
                      <Text style={{
                        fontSize: '24rpx',
                        fontWeight: 'bold',
                        color,
                        marginBottom: '12rpx'
                      }}>
                        {label}
                      </Text>
                      <Text style={{
                        fontSize: '24rpx',
                        color: '#374151',
                        lineHeight: '1.5'
                      }}>
                        {(analysis.pastPresentFuture as any)[key]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* 操作按钮 */}
          <View style={{
            display: 'flex',
            gap: '16rpx',
            marginTop: '32rpx'
          }}>
            <Button
              onClick={reset}
              style={{
                flex: 1,
                backgroundColor: '#6b7280',
                color: '#ffffff',
                fontSize: '28rpx',
                fontWeight: 'bold',
                padding: '32rpx',
                borderRadius: '24rpx',
                border: 'none'
              }}
            >
              🔄 重新占卜
            </Button>
            <Button
              style={{
                flex: 1,
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                fontSize: '28rpx',
                fontWeight: 'bold',
                padding: '32rpx',
                borderRadius: '24rpx',
                border: 'none'
              }}
            >
              💾 保存结果
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default TarotPage;