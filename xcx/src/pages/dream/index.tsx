import React, { useState } from 'react';
import { View, Text, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { DreamAnalysis, InterpretationStyle } from '../../types';
import { analyzeDream } from '../../services/geminiService';

const DreamPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [style, setStyle] = useState<InterpretationStyle>('ZHOUGONG');
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      Taro.showToast({
        title: '请输入梦境内容',
        icon: 'none'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeDream(content, style);
      setAnalysis(result);
    } catch (error) {
      console.error('梦境分析失败:', error);
      Taro.showToast({
        title: '分析失败，请重试',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setContent('');
    setAnalysis(null);
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
        background: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
        opacity: 0.6,
        pointerEvents: 'none'
      }} />

      {/* 标题区域 */}
      <View style={{
        padding: '48rpx',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: '#ffffff',
        position: 'relative',
        zIndex: 10
      }}>
        <Text style={{
          fontSize: '48rpx',
          fontWeight: 'bold',
          marginBottom: '16rpx'
        }}>
          梦的解析
        </Text>
        <Text style={{
          fontSize: '24rpx',
          opacity: 0.9
        }}>
          洞察潜意识预示，拨开梦境迷雾
        </Text>
      </View>

      {/* 梦境输入 */}
      {!analysis && (
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
              fontSize: '28rpx',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '24rpx'
            }}>
              💭 描述您的梦境
            </Text>

            <Textarea
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              placeholder="请详细描述您的梦境内容，包括场景、人物、情节等..."
              style={{
                width: '100%',
                height: '300rpx',
                backgroundColor: '#f8fafc',
                border: '1rpx solid #e2e8f0',
                borderRadius: '24rpx',
                padding: '24rpx',
                fontSize: '26rpx',
                color: '#374151',
                lineHeight: '1.5'
              }}
            />

            {/* 解析风格选择 */}
            <View style={{
              marginTop: '48rpx',
              marginBottom: '48rpx'
            }}>
              <Text style={{
                fontSize: '28rpx',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '24rpx'
              }}>
                🎭 选择解析风格
              </Text>

              <View style={{
                display: 'flex',
                gap: '16rpx'
              }}>
                <Button
                  onClick={() => setStyle('ZHOUGONG')}
                  style={{
                    flex: 1,
                    padding: '32rpx',
                    borderRadius: '24rpx',
                    fontSize: '26rpx',
                    fontWeight: 'bold',
                    backgroundColor: style === 'ZHOUGONG' ? '#6366f1' : '#f8fafc',
                    color: style === 'ZHOUGONG' ? '#ffffff' : '#6366f1',
                    border: `2rpx solid ${style === 'ZHOUGONG' ? '#6366f1' : '#e2e8f0'}`,
                    boxShadow: style === 'ZHOUGONG' ? '0 4rpx 8rpx rgba(99, 102, 241, 0.3)' : 'none'
                  }}
                >
                  📚 周公解梦
                </Button>
                <Button
                  onClick={() => setStyle('FREUD')}
                  style={{
                    flex: 1,
                    padding: '32rpx',
                    borderRadius: '24rpx',
                    fontSize: '26rpx',
                    fontWeight: 'bold',
                    backgroundColor: style === 'FREUD' ? '#6366f1' : '#f8fafc',
                    color: style === 'FREUD' ? '#ffffff' : '#6366f1',
                    border: `2rpx solid ${style === 'FREUD' ? '#6366f1' : '#e2e8f0'}`,
                    boxShadow: style === 'FREUD' ? '0 4rpx 8rpx rgba(99, 102, 241, 0.3)' : 'none'
                  }}
                >
                  🧠 心理学派
                </Button>
              </View>
            </View>

            {/* 分析按钮 */}
            <Button
              onClick={handleAnalyze}
              disabled={loading || !content.trim()}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#ffffff',
                fontSize: '32rpx',
                fontWeight: 'bold',
                padding: '40rpx',
                borderRadius: '32rpx',
                border: 'none',
                boxShadow: '0 10rpx 15rpx -3rpx rgba(99, 102, 241, 0.3)',
                letterSpacing: '4rpx',
                textTransform: 'uppercase'
              }}
            >
              {loading ? '🔄 解析中...' : '✨ 开始解析'}
            </Button>
          </View>
        </View>
      )}

      {/* 分析结果 */}
      {analysis && (
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
              🌙 梦境解析结果
            </Text>

            {/* 梦境内容显示 */}
            <View style={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
                "{content}"
              </Text>
            </View>

            {/* 解析风格标识 */}
            <View style={{
              textAlign: 'center',
              marginBottom: '32rpx'
            }}>
              <Text style={{
                fontSize: '24rpx',
                color: '#6366f1',
                fontWeight: 'bold',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                padding: '12rpx 24rpx',
                borderRadius: '16rpx'
              }}>
                {style === 'ZHOUGONG' ? '📚 周公解梦' : '🧠 西方心理学派'}
              </Text>
            </View>

            {/* 主要分析 */}
            <View style={{ marginBottom: '32rpx' }}>
              <Text style={{
                fontSize: '28rpx',
                fontWeight: 'bold',
                color: '#6366f1',
                marginBottom: '16rpx'
              }}>
                🔍 深度解析
              </Text>
              <Text style={{
                fontSize: '26rpx',
                color: '#374151',
                lineHeight: '1.6'
              }}>
                {analysis.mainAnalysis}
              </Text>
            </View>

            {/* 潜意识预兆和生活指引 */}
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24rpx'
            }}>
              <View style={{
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                borderRadius: '24rpx',
                padding: '32rpx',
                border: '1rpx solid rgba(99, 102, 241, 0.1)'
              }}>
                <Text style={{
                  fontSize: '24rpx',
                  fontWeight: 'bold',
                  color: '#6366f1',
                  marginBottom: '12rpx'
                }}>
                  🌌 潜意识预兆
                </Text>
                <Text style={{
                  fontSize: '24rpx',
                  color: '#374151',
                  lineHeight: '1.5'
                }}>
                  {analysis.hiddenMeaning}
                </Text>
              </View>

              <View style={{
                backgroundColor: 'rgba(168, 85, 247, 0.05)',
                borderRadius: '24rpx',
                padding: '32rpx',
                border: '1rpx solid rgba(168, 85, 247, 0.1)'
              }}>
                <Text style={{
                  fontSize: '24rpx',
                  fontWeight: 'bold',
                  color: '#a855f7',
                  marginBottom: '12rpx'
                }}>
                  💡 现实生活指引
                </Text>
                <Text style={{
                  fontSize: '24rpx',
                  color: '#374151',
                  lineHeight: '1.5'
                }}>
                  {analysis.lifeAdvice}
                </Text>
              </View>
            </View>
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
              🔄 重新解析
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

export default DreamPage;