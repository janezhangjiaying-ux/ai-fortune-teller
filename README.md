# 灵机万象 - AI命理大师

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 项目简介

灵机万象是一款基于人工智能的命理分析应用，结合传统命理学与现代AI技术，为用户提供全面的命运解析服务。应用支持紫微斗数、塔罗牌占卜、梦境解析、黄历查询等多种功能，帮助用户更好地了解自己和未来。

## 功能特性

### 🌟 核心功能
- **紫微斗数分析**：基于用户出生信息进行全面的命运分析，包括性格、事业、财富、健康等方面
- **塔罗牌占卜**：支持单张或多张塔罗牌抽取，提供详细的解读和建议
- **梦境解析**：基于弗洛伊德或周公解梦理论，对梦境进行深度分析
- **黄历查询**：提供每日黄历信息，包括宜忌事项、吉凶方位等
- **历史记录**：保存用户的分析历史，便于回顾和比较

### 🎨 用户体验
- **现代化界面**：采用React构建的美观界面，支持明暗主题切换
- **多平台支持**：支持Web端和微信小程序
- **AI驱动分析**：集成Google Gemini AI，提供智能化的命理解读
- **个性化推荐**：根据分析结果提供水晶、家居宝物等VIP推荐

## 技术栈

### Web版本
- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite
- **UI组件**：自定义组件 + Lucide React图标
- **AI服务**：Google Generative AI (Gemini)

### 微信小程序版本
- **框架**：Taro 4.x + React + TypeScript
- **样式**：Sass
- **多端支持**：微信小程序、支付宝小程序、百度小程序等

## 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### Web版本运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd 灵机万象---ai-命理大师
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件，并设置您的Gemini API密钥：
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **运行开发服务器**
   ```bash
   npm run dev
   ```

5. **构建生产版本**
   ```bash
   npm run build
   ```

### 微信小程序版本运行

1. **进入小程序目录**
   ```bash
   cd xcx
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   在 `config/dev.js` 或相应配置文件中设置API密钥

4. **开发模式运行**
   ```bash
   npm run dev:weapp
   ```

5. **构建小程序**
   ```bash
   npm run build:weapp
   ```

## 项目结构

```
灵机万象---ai-命理大师/
├── components/          # React组件
│   ├── UserInfoForm.tsx # 用户信息表单
│   ├── PalaceBox.tsx    # 紫微斗数宫位组件
│   ├── TarotView.tsx    # 塔罗牌视图
│   ├── DreamView.tsx    # 梦境解析视图
│   └── ...
├── services/            # 服务层
│   └── geminiService.ts # Gemini AI服务
├── utils/               # 工具函数
│   └── ziweiEngine.ts   # 紫微斗数计算引擎
├── types.ts             # TypeScript类型定义
├── App.tsx              # 主应用组件
├── index.tsx            # 应用入口
└── xcx/                 # 微信小程序版本
    ├── src/
    │   ├── components/  # 小程序组件
    │   ├── pages/       # 小程序页面
    │   ├── services/    # 小程序服务
    │   └── utils/       # 小程序工具
    └── config/          # 配置文件
```

## 开发指南

### 代码规范
- 使用TypeScript进行类型检查
- 遵循React最佳实践
- 组件使用函数式组件和Hooks

### API使用
应用使用Google Gemini AI进行智能分析。请确保：
1. 获取有效的Gemini API密钥
2. 遵守API使用条款
3. 注意API调用频率限制

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

### 贡献步骤
1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系我们

如果您有任何问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至开发者邮箱

---

**免责声明**：本应用提供的命理分析仅供娱乐和参考之用，不应作为重要决策的依据。命运由己不由天，理性看待，谨慎行事。
