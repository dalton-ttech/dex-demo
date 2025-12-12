# Vercel 部署指南

## 问题原因

本地预览和 Vercel 部署页面不一致的根本原因是：

1. **环境变量未正确传递到构建过程** - Remix + Vite 在 SSR 模式下，`import.meta.env` 需要在构建时被正确替换
2. **Vercel 环境变量配置** - Vercel 上的环境变量需要单独配置
3. **构建时环境变量替换** - Vite 的 `define` 选项现在已配置好，确保所有环境变量在构建时被正确替换

## 已修复的内容

### 1. `vite.config.ts` 
已添加 `define` 配置，确保所有环境变量在构建时被正确注入：
- VITE_ORDERLY_BROKER_ID
- VITE_ORDERLY_BROKER_NAME  
- VITE_APP_NAME
- VITE_APP_DESCRIPTION
- VITE_NETWORK_ID
- VITE_MAINNET_URL
- VITE_TESTNET_URL
- VITE_WALLET_CONNECT_PROJECT_ID

### 2. `.gitignore`
已更新，确保 `.env` 文件不会被提交，但保留 `.env.example` 作为模板。

## Vercel 部署步骤

### 方案 A：在 Vercel Dashboard 配置（推荐）

1. **登录 Vercel Dashboard**
   访问：https://vercel.com/dashboard

2. **进入项目设置**
   找到您的项目 → Settings → Environment Variables

3. **添加以下环境变量**
   
   ```
   VITE_ORDERLY_BROKER_ID = qell
   VITE_ORDERLY_BROKER_NAME = Qell
   VITE_APP_NAME = Qell
   VITE_APP_DESCRIPTION = CEX-level performance. Ethereum security.
   VITE_NETWORK_ID = mainnet
   VITE_MAINNET_URL = https://qell-dex.vercel.app
   VITE_TESTNET_URL = https://broker-template-git-develop-orderly-devrels-projects.vercel.app
   ```

   **重要**：每个变量都要选择所有环境：
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

4. **重新部署**
   
   **选项 1 - 清除缓存重新部署（推荐）：**
   - 进入 Deployments 页面
   - 找到最新的部署
   - 点击右侧的 "..." 菜单
   - 选择 "Redeploy"
   - **勾选** "Use existing Build Cache" 取消勾选（清除缓存）
   - 点击 "Redeploy"

   **选项 2 - 推送新代码触发部署：**
   ```bash
   git add .
   git commit -m "fix: 配置环境变量以修复部署问题"
   git push origin main
   ```

### 方案 B：使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录**
   ```bash
   vercel login
   ```

3. **从本地 .env 导入环境变量**
   ```bash
   vercel env pull
   ```

4. **部署**
   ```bash
   vercel --prod
   ```

## 验证部署

部署完成后，检查以下内容：

1. **页面标题** - 应该显示 "Qell" 而不是 undefined
2. **连接钱包** - 应该能正常弹出钱包连接界面
3. **网络切换** - 应该在 mainnet 而不是 undefined
4. **首页显示** - 应该显示自定义的首页，而不是默认页面

## 常见问题排查

### 问题：部署后页面仍然不对

**解决方案：**
1. 检查 Vercel 构建日志，确认环境变量已被正确读取
2. 确保已清除构建缓存
3. 检查浏览器缓存（使用无痕模式访问）
4. 验证所有环境变量都已在 Vercel 中配置

### 问题：本地开发正常，但部署后报错

**解决方案：**
1. 运行本地生产构建测试：
   ```bash
   npm run build
   npm run preview
   ```
2. 检查是否有环境特定的错误
3. 查看 Vercel 部署日志中的错误信息

### 问题：环境变量未生效

**解决方案：**
1. 确认在 Vercel 中配置的环境变量包含 `VITE_` 前缀
2. 确认选择了正确的环境（Production/Preview/Development）
3. 部署后刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）

## 技术细节

### 为什么需要 `define` 配置？

在 Remix + Vite 的 SSR 模式下：
- 客户端代码可以访问 `import.meta.env.*`
- 但服务器端渲染时，Vite 不会自动替换这些变量
- 使用 `define` 可以在构建时将变量值直接编译到代码中
- 确保 SSR 和客户端都使用相同的值

### 构建流程

```mermaid
graph LR
A[环境变量] --> B[vite.config.ts loadEnv]
B --> C[define 替换]
C --> D[Remix 构建]
D --> E[生成 SSR + 客户端代码]
E --> F[Vercel 部署]
```

## 后续优化建议

1. **添加环境变量验证** - 在应用启动时检查必需的环境变量
2. **配置不同环境** - 为 Preview 和 Production 使用不同的配置
3. **CI/CD 集成** - 使用 GitHub Actions 自动化部署流程
4. **监控和日志** - 集成 Vercel Analytics 和错误追踪

## 需要帮助？

如果按照上述步骤操作后问题仍未解决，请提供：
1. Vercel 构建日志
2. 浏览器控制台错误信息
3. 部署的 URL

---

**最后更新：** 2025年12月12日
**适用版本：** Remix v2.15+, Vite v5+, Vercel

