# AI 命理大师（灵机万象）项目概览

## 项目定位
这是一个前端单页应用（React + Vite），提供多术数融合的“AI 命理大师”体验，包含紫微命理、塔罗占卜、梦境解析、老黄历与历史档案功能。AI 推演由 Google Gemini 模型完成，界面强调沉浸式视觉、仪式感与情绪价值。

## 核心功能
- 紫微命理：输入出生信息，生成命盘格局与 AI 解析结果。
- 塔罗占卜：三牌阵抽取与解读，真实塔罗牌面展示，可解锁 VIP 额外建议。
- 梦境解析：支持 5 种流派（周公解梦、弗洛伊德、荣格、认知学派、文化人类学），可在详情页切换并对比不同流派解读；VIP 追加开运建议。
- 老黄历：按日期生成宜忌、干支、五行等，提供更完整文字解读；VIP 追加开运建议。
- 万象档案：保存历史记录并可回溯（含黄历记录标签与标题优化）。
- 画像引导：星座、MBTI、城市用于增强 AI 解读准确度；首页齿轮入口可随时编辑并保存画像。
- 主题切换：支持深浅色。

## 架构与目录
- `App.tsx`：主入口页面与模式切换、导航、全局状态管理。
- `components/`
  - `ModeSelection.tsx`：四大入口选择页（含画像编辑入口）。
  - `UserInfoForm.tsx`：命盘信息输入。
  - `TarotView.tsx` / `DreamView.tsx` / `HuangliView.tsx`：三大业务视图与 VIP 交互。
  - `HistoryView.tsx`：历史档案列表。
  - `OnboardingForm.tsx`：用户画像引导与校准。
  - `PalaceBox.tsx`：紫微命盘宫位格。
  - `VIPRecommendationSection.tsx`：VIP 推荐展示。
  - `*Loading.tsx`：加载动画组件。
- `services/geminiService.ts`：AI 推演与结构化响应 Schema；紫微/塔罗/解梦/黄历均通过此层调用模型。
- `utils/ziweiEngine.ts`：紫微命盘的“可重复伪随机”计算逻辑（当前为可视化 mock）。
- `types.ts`：全域类型定义。
- `index.tsx` / `index.html`：React 启动与字体、Tailwind CDN 配置。
- `metadata.json`：AI Studio 应用元信息。
- `dist/`：构建产物（已存在）。

## 关键流程
1) 进入首页后选择模式（命理/塔罗/解梦/黄历/档案）。
2) 首次进入引导填画像信息（星座/MBTI/城市），存入 localStorage；首页齿轮可随时编辑。
3) 功能页请求 AI 推演，返回结构化 JSON 并展示。
4) 可保存结果到“万象档案”，从历史记录可回看与复用。

## AI 模型调用
- 紫微命理：`gemini-3-pro-preview`
- 塔罗/解梦/黄历：`gemini-3-flash-preview`
- 结果通过 JSON schema 约束返回（确保结构化结果）。
- VIP 模式会要求追加 `vipData`（穿搭/家居/避坑）。

## 数据存储
- `localStorage`
  - `user_profile`：画像信息
  - `destiny_records`：历史记录列表
  - `vip_onboarding_pending`：VIP 引导临时状态

## 运行与配置
- 依赖：Node.js
- 开发运行：`npm run dev`
- 构建：`npm run build`
- 预览：`npm run preview`
- 环境变量：前端通过 Vite 读取 `VITE_GEMINI_API_KEY`（兼容 `VITE_API_KEY`）。

## 当前进展（基于代码现状）
- 主流程与 4 个核心功能页面已完整实现，并增强了加载动画与文案。
- VIP 付费流程为前端模拟（3 秒仪式感加载替代二维码弹窗）。
- 紫微命盘计算为 mock 逻辑，尚未接入真实天文历算法。
- 梦境解析增加多流派选择与对比视图。
- 老黄历加载/展示样式优化为“卷轴/书页”风格，并增加文字解读。
- UI/动效完成度高，移动端适配有考虑。
- `index.html` 引入 `/index.css`，仓库中未见该文件，可能依赖外部或遗漏。

## 测试链接
- 本地预览：运行 `npm run dev` 后访问终端提示的本地地址（默认 `http://localhost:5173`）
