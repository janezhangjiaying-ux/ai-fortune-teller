# GitHub 推送指南

## 📋 准备工作

### 1. 注册 GitHub 账户
如果还没有 GitHub 账户，请访问 [github.com](https://github.com) 注册。

### 2. 创建新的仓库
1. 点击右上角 "+" 按钮 → "New repository"
2. 填写仓库信息：
   - **Repository name**: `ai-fortune-teller` 或您喜欢的名称
   - **Description**: "AI命理大师 - 智能塔罗牌与紫微斗数应用"
   - **Visibility**: Public（公开）或 Private（私有）
3. **不要勾选** "Add a README file" 等选项（因为我们已有代码）
4. 点击 "Create repository"

### 3. 获取仓库地址
创建完成后，在仓库页面点击绿色的 "Code" 按钮，复制 HTTPS 地址：
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## 🚀 推送代码到 GitHub

### 步骤 1：配置 Git 用户信息（如果还没配置）
```bash
git config --global user.name "您的名字"
git config --global user.email "您的邮箱@example.com"
```

### 步骤 2：添加远程仓库
将下面的命令中的 `YOUR_USERNAME` 和 `YOUR_REPO_NAME` 替换为您的实际信息：

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 步骤 3：推送代码
```bash
git push -u origin main
```

### 步骤 4：输入 GitHub 账户信息
- **Username**: 您的 GitHub 用户名
- **Password**: 不是您的账户密码，而是 **Personal Access Token**

## 🔑 创建 Personal Access Token

由于 GitHub 不再支持账户密码认证，您需要创建 Personal Access Token：

1. 访问 [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 配置：
   - **Note**: "AI命理大师项目"
   - **Expiration**: 选择合适的时间（如 90 天）
   - **Scopes**: 勾选 `repo`（完整仓库访问权限）
4. 点击 "Generate token"
5. **重要**：复制生成的 token（只显示一次）

## ✅ 验证推送成功

推送完成后，刷新您的 GitHub 仓库页面，应该能看到所有代码文件。

## 🔄 后续更新推送

以后每次修改代码后，执行：
```bash
git add .
git commit -m "更新说明"
git push
```

## 🆘 常见问题解决

### Q: 推送时提示 "Repository not found"
A: 检查仓库地址是否正确，确认仓库存在且拼写正确

### Q: 提示 "Permission denied"
A: 确认 Personal Access Token 有 `repo` 权限，且输入正确

### Q: 提示 "fatal: remote origin already exists"
A: 先执行 `git remote remove origin`，然后重新添加

### Q: 推送大文件失败
A: 检查 `.gitignore` 是否正确排除了 `node_modules` 和 `dist` 等大文件夹

## 📝 安全提醒

- **不要推送 `.env.local` 文件**（已通过 `.gitignore` 排除）
- **API Key 等敏感信息** 应在部署平台的环境变量中配置
- **定期更新 Personal Access Token**

## 🎯 下一步：部署到 Vercel

推送成功后，您可以按照 `DEPLOYMENT.md` 中的指南将应用部署到 Vercel 等平台。</content>
<parameter name="filePath">/Users/sz-20251128-001/Desktop/我的金库/AI命理大师/灵机万象---ai-命理大师/GITHUB_GUIDE.md