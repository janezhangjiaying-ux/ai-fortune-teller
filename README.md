# 灵机万象 · AI 命理大师

一个以东方玄学美学为主题的多模块 AI 命理应用，涵盖紫微斗数、塔罗、解梦、老黄历等体验，并提供 VIP 深度解析与记录归档能力。

## 功能概览
- 紫微命理：命盘解析 + 追加提问
- 神秘塔罗：占卜解读 + 追加提问 + 补牌机制
- 梦的解析：多流派解读与对比
- 老黄历：当日宜忌 + 事项推演
- 万象档案：保存与回看历史记录
- VIP 深度建议：基于用户画像与追问上下文的个性化建议

## 技术栈
- 前端：React + TypeScript + TailwindCSS
- AI：Gemini API（通过 `/api/gemini` 代理）
- 部署：Cloudflare Pages / Vercel

## 本地运行
1. 安装依赖  
   `npm install`
2. 配置环境变量  
   在 `.env.local` 中加入：
   `GEMINI_API_KEY=你的key`
3. 启动开发  
   `npm run dev`

## 关键环境变量
- `GEMINI_API_KEY`：Gemini API 密钥（用于 `/api/gemini`）

## Cloudflare Pages 部署
1. 连接 GitHub 仓库
2. Build command: `npm run build`
3. Build output directory: `dist`
4. 在 `Settings -> Variables and Secrets` 增加 `GEMINI_API_KEY`
5. 重新部署后访问 Pages 域名

## Vercel 部署
1. 导入 GitHub 仓库
2. 在 Project Settings -> Environment Variables 增加 `GEMINI_API_KEY`
3. 自动构建部署完成后访问域名

## 说明
- `/api/gemini` 使用 Cloudflare Pages Functions 代理请求 Gemini
- 记录保存在本地 `localStorage`（不同设备互不影响）

## 目录结构（简要）
- `components/` 主要 UI 组件
- `services/` AI 调用与提示词
- `functions/` Cloudflare Pages Functions
- `types.ts` 类型定义
