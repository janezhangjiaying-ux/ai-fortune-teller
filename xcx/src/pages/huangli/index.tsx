import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { HuangliData } from '../../types';
import { analyzeHuangli } from '../../services/geminiService';

const HuangliPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<HuangliData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHuangli = async (date: string) => {
    setLoading(true);
    try {
      const result = await analyzeHuangli(date);
      setData(result);
    } catch (error) {
      console.error('黄历分析失败:', error);
      Taro.showToast({
        title: '获取黄历失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHuangli(selectedDate);
  }, [selectedDate]);

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
        background: 'radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
        opacity: 0.6,
        pointerEvents: 'none'
      }} />

      {/* 标题区域 */}
      <View style={{
        padding: '48rpx',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #dc2626, #d97706)',
        color: '#ffffff',
        position: 'relative',
        zIndex: 10
      }}>
        <Text style={{
          fontSize: '48rpx',
          fontWeight: 'bold',
          marginBottom: '16rpx'
        }}>
          老黄历
        </Text>
        <Text style={{
          fontSize: '24rpx',
          opacity: 0.9
        }}>
          查吉凶、观节律，掌每日岁月之宜忌
        </Text>
      </View>

      {/* 日期选择 */}
      <View style={{
        padding: '32rpx',
        marginBottom: '32rpx'
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
            marginBottom: '24rpx',
            textAlign: 'center'
          }}>
            📅 选择日期
          </Text>

          <Input
            type="date"
            value={selectedDate}
            onInput={(e) => setSelectedDate(e.detail.value)}
            style={{
              width: '100%',
              backgroundColor: '#f8fafc',
              border: '1rpx solid #e2e8f0',
              borderRadius: '24rpx',
              padding: '24rpx',
              fontSize: '28rpx',
              color: '#374151',
              textAlign: 'center'
            }}
          />
        </View>
      </View>

      {/* 加载状态 */}
      {loading && (
        <View style={{
          padding: '96rpx',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: '48rpx', marginBottom: '32rpx' }}>🔮</Text>
          <Text style={{ fontSize: '32rpx', color: '#6b7280' }}>正在查询黄历...</Text>
        </View>
      )}

      {/* 黄历数据显示 */}
      {data && !loading && (
        <View style={{
          padding: '32rpx'
        }}>
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '32rpx',
            padding: '48rpx',
            boxShadow: '0 10rpx 25rpx rgba(0, 0, 0, 0.1)'
          }}>
            {/* 日期信息 */}
            <View style={{
              textAlign: 'center',
              marginBottom: '48rpx'
            }}>
              <View style={{
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '24rpx',
                padding: '16rpx 32rpx',
                display: 'inline-block',
                marginBottom: '24rpx'
              }}>
                <Text style={{
                  fontSize: '24rpx',
                  fontWeight: 'bold',
                  color: '#dc2626'
                }}>
                  {data.ganzhi}
                </Text>
              </View>

              <Text style={{
                fontSize: '48rpx',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '16rpx'
              }}>
                {data.lunarDate}
              </Text>

              <Text style={{
                fontSize: '24rpx',
                color: '#6b7280'
              }}>
                {data.wuxing} · {data.chong}
              </Text>
            </View>

            {/* 宜忌事项 */}
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '48rpx'
            }}>
              {/* 宜 */}
              <View>
                <View style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24rpx'
                }}>
                  <Text style={{
                    fontSize: '32rpx',
                    marginRight: '16rpx'
                  }}>
                    💚
                  </Text>
                  <Text style={{
                    fontSize: '32rpx',
                    fontWeight: 'bold',
                    color: '#059669'
                  }}>
                    今日宜做
                  </Text>
                </View>

                <View style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16rpx'
                }}>
                  {data.yi.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        borderRadius: '16rpx',
                        padding: '16rpx 24rpx',
                        border: '1rpx solid rgba(5, 150, 105, 0.2)'
                      }}
                    >
                      <Text style={{
                        fontSize: '24rpx',
                        fontWeight: 'bold',
                        color: '#059669'
                      }}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 忌 */}
              <View>
                <View style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24rpx'
                }}>
                  <Text style={{
                    fontSize: '32rpx',
                    marginRight: '16rpx'
                  }}>
                    ❤️
                  </Text>
                  <Text style={{
                    fontSize: '32rpx',
                    fontWeight: 'bold',
                    color: '#dc2626'
                  }}>
                    今日忌做
                  </Text>
                </View>

                <View style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16rpx'
                }}>
                  {data.ji.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        borderRadius: '16rpx',
                        padding: '16rpx 24rpx',
                        border: '1rpx solid rgba(220, 38, 38, 0.2)'
                      }}
                    >
                      <Text style={{
                        fontSize: '24rpx',
                        fontWeight: 'bold',
                        color: '#dc2626'
                      }}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={{
            display: 'flex',
            gap: '16rpx',
            marginTop: '32rpx'
          }}>
            <View style={{
              flex: 1,
              padding: '24rpx',
              backgroundColor: '#6b7280',
              borderRadius: '24rpx',
              textAlign: 'center'
            }}>
              <Text style={{
                color: '#ffffff',
                fontSize: '28rpx',
                fontWeight: 'bold'
              }}>
                💾 保存黄历
              </Text>
            </View>
            <View style={{
              flex: 1,
              padding: '24rpx',
              backgroundColor: '#f59e0b',
              borderRadius: '24rpx',
              textAlign: 'center'
            }}>
              <Text style={{
                color: '#ffffff',
                fontSize: '28rpx',
                fontWeight: 'bold'
              }}>
                🔄 刷新
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default HuangliPage;