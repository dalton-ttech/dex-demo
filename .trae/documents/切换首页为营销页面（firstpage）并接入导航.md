## 导航文字与跳转（按你的确认）

* Markets → 链接 `/markets`

* Leaderboard → 链接 `/leaderboard`

* Governance → 改名为“Portfolio”，链接 `/portfolio`

* Developers → 改名为“Positions”，链接 `/portfolio/positions`

* Blog → 改名为“Community”，暂不跳转（禁用链接，后续补外链）

## 变更明细（保留视觉与动画）

1. 新增组件文件（方案B）：`app/components/landing/FirstPage.tsx`

   * 将 `app/routes/firstpage.tsx` 的 UI 与动画完整迁移到该组件；不改动样式类名与结构

   * 优化点：

     * `useScrambleText` 的 `interval` 类型改为 `ReturnType<typeof setInterval>`

     * 将所有导航项与按钮改为 Remix 的 `<Link>` 或 `useNavigate` 接线（仅增加行为，不改变样式）

     * “START TRADING” → `/perp/${DEFAULT_SYMBOL}`；“EXPLORE FEATURES” → `/markets`

     * Community 项设置为不可点击（禁用链接或 `javascript:void(0)`）
2. 修改根路由：`app/routes/_index.tsx`

   * 移除 `loader` 重定向逻辑

   * 引入并渲染 `FirstPage` 组件

   * 保留/复用 `meta`（`VITE_APP_NAME`、`VITE_APP_DESCRIPTION`）
3. 处理 `app/routes/firstpage.tsx`

   * 作为别名路由保留：导出一个简单组件，内部直接渲染 `FirstPage`（或重定向到 `/`），以便 `/firstpage` 仍可访问
4. 依赖完善

   * 在 `package.json` 添加 `lucide-react` 依赖，确保图标渲染一致；不改变你当前图标使用方式

## 验证

* 访问 `/` 展示首页；按钮与导航跳转生效，Community 不可点击

* 访问 `/firstpage`（若保留别名）得到同样首页

* 运行类型检查与 ESLint 无新增警告

## 说明

* 仅新增一个组件文件是为了更稳定地维护首页（UI与路由职责分离），降低未来改动时产生 bug 的风险

* 所有视觉与动画保持不变；我们只增加链接行为与小幅类型优化，不改变任何样式

