# xcx-app

AI命理大师 - 微信小程序

## 快速开始

安装依赖

```bash
npm install
```

或者使用 yarn

```bash
yarn install
```

### 微信小程序

```bash
# 开发时构建
npm run dev:weapp

# 生产构建
npm run build:weapp
```

### 其他平台

```bash
# 支付宝小程序
npm run dev:alipay
npm run build:alipay

# 百度小程序
npm run dev:swan
npm run build:swan

# 字节跳动小程序
npm run dev:tt
npm run build:tt

# QQ 小程序
npm run dev:qq
npm run build:qq

# 京东小程序
npm run dev:jd
npm run build:jd

# H5
npm run dev:h5
npm run build:h5

# React Native
npm run dev:rn
npm run build:rn

# 快应用
npm run dev:quickapp
npm run build:quickapp
```

## 项目结构

```
src/
├── app.config.ts          # 全局配置
├── app.scss               # 全局样式
├── app.tsx                # 入口组件
├── pages/                 # 页面
│   └── index/             # 首页
│       ├── index.config.ts
│       ├── index.scss
│       └── index.tsx
└── components/            # 组件（可添加）
```

## 开发说明

- 使用 TypeScript 开发
- 使用 React 框架
- 使用 Sass 作为 CSS 预处理器
- 支持多端编译