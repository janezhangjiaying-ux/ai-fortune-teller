import React, { useState, useEffect } from 'react';
import { View, Text, Input, Picker, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { UserInfo, Gender } from '../../types';

const UserInfoPage: React.FC = () => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    gender: Gender.MALE,
    birthPlace: '',
  });

  const handleSubmit = () => {
    if (!formData.birthDate) {
      Taro.showToast({
        title: '请选择出生日期',
        icon: 'none'
      });
      return;
    }

    // 导航到紫微命理页面，传递用户信息
    Taro.navigateTo({
      url: `/pages/astrology/index?birthDate=${formData.birthDate}&birthTime=${formData.birthTime}&gender=${formData.gender}&birthPlace=${encodeURIComponent(formData.birthPlace)}&name=${encodeURIComponent(formData.name)}`
    });
  };

  return (
    <View style={{
      minHeight: '100vh',
      padding: '48rpx',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
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
        textAlign: 'center',
        marginBottom: '96rpx',
        position: 'relative',
        zIndex: 10
      }}>
        <Text style={{
          fontSize: '72rpx',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #d97706, #7c3aed)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24rpx'
        }}>
          灵机万象
        </Text>
        <Text style={{
          fontSize: '24rpx',
          color: '#64748b',
          letterSpacing: '2rpx',
          fontWeight: '300',
          textTransform: 'uppercase'
        }}>
          AI 命理大师 · 万象轨律解析
        </Text>
      </View>

      {/* 表单区域 */}
      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1rpx solid #e2e8f0',
        borderRadius: '48rpx',
        padding: '64rpx',
        backdropFilter: 'blur(20rpx)',
        boxShadow: '0 20rpx 25rpx -5rpx rgba(0, 0, 0, 0.1)'
      }}>
        {/* 日期和时间 */}
        <View style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32rpx',
          marginBottom: '48rpx'
        }}>
          <View>
            <Text style={{
              fontSize: '20rpx',
              fontWeight: 'bold',
              color: '#64748b',
              marginBottom: '16rpx',
              letterSpacing: '2rpx',
              textTransform: 'uppercase'
            }}>
              📅 出生日期 (阳历)
            </Text>
            <Input
              type="date"
              value={formData.birthDate}
              onInput={(e) => setFormData({...formData, birthDate: e.detail.value})}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1rpx solid #e2e8f0',
                borderRadius: '24rpx',
                padding: '24rpx',
                fontSize: '28rpx',
                color: '#1e293b'
              }}
            />
          </View>
          <View>
            <Text style={{
              fontSize: '20rpx',
              fontWeight: 'bold',
              color: '#64748b',
              marginBottom: '16rpx',
              letterSpacing: '2rpx',
              textTransform: 'uppercase'
            }}>
              🕐 出生时间
            </Text>
            <Input
              type="time"
              value={formData.birthTime}
              onInput={(e) => setFormData({...formData, birthTime: e.detail.value})}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1rpx solid #e2e8f0',
                borderRadius: '24rpx',
                padding: '24rpx',
                fontSize: '28rpx',
                color: '#1e293b'
              }}
            />
          </View>
        </View>

        {/* 出生地点 */}
        <View style={{ marginBottom: '48rpx' }}>
          <Text style={{
            fontSize: '20rpx',
            fontWeight: 'bold',
            color: '#64748b',
            marginBottom: '16rpx',
            letterSpacing: '2rpx',
            textTransform: 'uppercase'
          }}>
            📍 出生地点
          </Text>
          <Input
            type="text"
            value={formData.birthPlace}
            onInput={(e) => setFormData({...formData, birthPlace: e.detail.value})}
            placeholder="例如：北京市朝阳区"
            style={{
              width: '100%',
              backgroundColor: '#f8fafc',
              border: '1rpx solid #e2e8f0',
              borderRadius: '24rpx',
              padding: '24rpx',
              fontSize: '28rpx',
              color: '#1e293b'
            }}
          />
        </View>

        {/* 性别选择 */}
        <View style={{ marginBottom: '64rpx' }}>
          <Text style={{
            fontSize: '20rpx',
            fontWeight: 'bold',
            color: '#64748b',
            marginBottom: '16rpx',
            letterSpacing: '2rpx',
            textTransform: 'uppercase'
          }}>
            性别选择
          </Text>
          <View style={{
            display: 'flex',
            backgroundColor: '#f8fafc',
            border: '1rpx solid #e2e8f0',
            borderRadius: '24rpx',
            padding: '8rpx'
          }}>
            <Button
              onClick={() => setFormData({...formData, gender: Gender.MALE})}
              style={{
                flex: 1,
                padding: '24rpx',
                borderRadius: '16rpx',
                fontSize: '24rpx',
                fontWeight: formData.gender === Gender.MALE ? 'bold' : 'normal',
                backgroundColor: formData.gender === Gender.MALE ? '#4f46e5' : 'transparent',
                color: formData.gender === Gender.MALE ? '#ffffff' : '#64748b',
                border: 'none'
              }}
            >
              乾造 (男)
            </Button>
            <Button
              onClick={() => setFormData({...formData, gender: Gender.FEMALE})}
              style={{
                flex: 1,
                padding: '24rpx',
                borderRadius: '16rpx',
                fontSize: '24rpx',
                fontWeight: formData.gender === Gender.FEMALE ? 'bold' : 'normal',
                backgroundColor: formData.gender === Gender.FEMALE ? '#e11d48' : 'transparent',
                color: formData.gender === Gender.FEMALE ? '#ffffff' : '#64748b',
                border: 'none'
              }}
            >
              坤造 (女)
            </Button>
          </View>
        </View>

        {/* 提交按钮 */}
        <Button
          onClick={handleSubmit}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: '#ffffff',
            fontSize: '32rpx',
            fontWeight: 'bold',
            padding: '40rpx',
            borderRadius: '32rpx',
            border: 'none',
            boxShadow: '0 10rpx 15rpx -3rpx rgba(79, 70, 229, 0.3)',
            letterSpacing: '4rpx',
            textTransform: 'uppercase'
          }}
        >
          ✨ 开始排盘解析
        </Button>
      </View>
    </View>
  );
};

export default UserInfoPage;