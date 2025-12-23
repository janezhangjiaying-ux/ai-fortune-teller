# 灵机万象 - AI命理大师 部署指南

## 📋 前置准备

### 1. 环境变量配置
确保您的 `.env.local` 文件包含有效的 Gemini API Key：
```env
GEMINI_API_KEY=您的真实API密钥
```

### 2. 构建测试
运行以下命令确保应用能正常构建：
```bash
npm run build
```

## 🚀 部署选项

### 选项1：Vercel（推荐 - 最简单）

#### 步骤：
1. **注册 Vercel 账户**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账户注册

2. **连接 GitHub 仓库**
   - 将您的项目推送到 GitHub
   - 在 Vercel 中点击 "Import Project"
   - 选择您的仓库

3. **配置环境变量**
   - 在 Vercel 项目设置中添加环境变量：
     - `GEMINI_API_KEY`: 您的 Gemini API Key

4. **部署**
   - Vercel 会自动检测为 Vite 项目
   - 点击 "Deploy" 即可完成部署

#### 优势：
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动部署（每次推送代码）

---

### 选项2：Netlify

#### 步骤：
1. **注册 Netlify 账户**
   - 访问 [netlify.com](https://netlify.com)

2. **部署方法一：拖拽上传**
   - 运行 `npm run build`
   - 将 `dist` 文件夹拖拽到 Netlify 部署页面

3. **部署方法二：连接 GitHub**
   - 连接 GitHub 仓库
   - 设置构建命令：`npm run build`
   - 设置发布目录：`dist`

4. **配置环境变量**
   - 在 Netlify 控制台添加环境变量：
     - `GEMINI_API_KEY`: 您的 API Key

#### 优势：
- ✅ 免费额度充足
- ✅ 简单易用
- ✅ 支持拖拽部署

---

### 选项3：GitHub Pages（完全免费）

#### 步骤：
1. **安装 gh-pages 包**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **修改 package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **修改 vite.config.ts**
   ```typescript
   export default defineConfig(({ mode }) => {
     const env = loadEnv(mode, '.', '');
     return {
       base: process.env.NODE_ENV === 'production' ? '/仓库名/' : '/',
       // ... 其他配置
     };
   });
   ```

4. **部署**
   ```bash
   npm run build
   npm run deploy
   ```

#### 注意事项：
- GitHub Pages 不支持服务器端功能
- 需要将仓库设为公开
- 访问地址：`https://用户名.github.io/仓库名`

---

### 选项4：传统服务器部署

#### 使用 Nginx + 静态文件
1. **构建应用**
   ```bash
   npm run build
   ```

2. **上传 dist 文件夹到服务器**

3. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/your/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

## 🔧 环境变量说明

### 生产环境配置
在部署平台的环境变量设置中添加：
- `GEMINI_API_KEY`: Google Gemini API 密钥
- `NODE_ENV`: production

### API 密钥获取
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的 API Key
3. 复制到环境变量中

---

## 📝 部署后的检查清单

- [ ] 网站能正常访问
- [ ] 所有页面正常加载
- [ ] 塔罗牌图片正常显示
- [ ] API 调用正常工作
- [ ] 响应式设计在移动端正常

---

## 🆘 常见问题

### Q: 部署后显示空白页面
A: 检查 `base` 配置是否正确，确认所有资源路径正确

### Q: API 调用失败
A: 确认环境变量 `GEMINI_API_KEY` 已正确设置

### Q: 图片不显示
A: 确认 `public/tarot-cards/` 文件夹已包含所有图片文件

---

## 💡 推荐方案

**新手用户：选择 Vercel**
- 最简单，自动部署
- 专业的外观和性能

**有经验用户：选择 Netlify**
- 更多自定义选项
- 强大的构建配置

**预算有限：选择 GitHub Pages**
- 完全免费
- 适合静态展示</content>
<parameter name="filePath">/Users/sz-20251128-001/Desktop/我的金库/AI命理大师/灵机万象---ai-命理大师/DEPLOYMENT.md