## 目标
- 首页仅渲染 TradingView K 线图（不含订单簿/仓位/订单录入等模块）
- 完全隐藏 TradingView 左侧工具栏
- 交易对固定为 `DEFAULT_SYMBOL`

## 问题判断
- 当前线上首页仍在渲染完整交易页（右侧 Order book/Buy/Sell/Positions 仍可见）。
- `chart_v2.css` 在主文档可访问，但未确认由 TradingView iframe 加载；且线上 CSS 内容不包含“隐藏左侧工具栏”的选择器。

## 修改步骤
1. 组件替换（首页）
- 文件：`app/components/landing/FirstPage.tsx`
- 用法：改为渲染 `@orderly.network/ui-tradingview` 的 `TradingviewWidget`，不要再渲染 `TradingPage`。
- 代码要点：
  - `import { TradingviewWidget } from '@orderly.network/ui-tradingview'`
  - `<TradingviewWidget symbol={DEFAULT_SYMBOL} scriptSRC={config.tradingPage.tradingViewConfig.scriptSRC} library_path={config.tradingPage.tradingViewConfig.library_path} customCssUrl={window.location.origin + '/tradingview/chart_v2.css'} overrides={...可选} />`
  - 删除/注释掉 `disableFeatures` 与 `overrideFeatures` 的完整交易页配置。

2. 隐藏左侧工具栏（CSS）
- 文件：`public/tradingview/chart_v2.css`
- 在文件末尾加入强力选择器：
```
.layout__left-toolbar,
[class*="layout__left-toolbar"],
[class*="left-toolbar"],
div[data-name="left-toolbar"],
div[class*="leftToolbar-"],
div[class*="leftToolbar"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  pointer-events: none !important;
}
```
- 如需更稳妥，可加版本号防缓存：`customCssUrl={window.location.origin + '/tradingview/chart_v2.css?v=v74'}`。

3. 验证（本地）
- 运行：`npm run dev` 或 `npm run preview`
- 打开首页 Network：
  - 看到 `charting_library.js` 与 `chart_v2.css` 来自 TradingView iframe 的请求
  - 页面仅显示图表，无订单簿/仓位/订单录入
  - 左侧工具栏不可见

4. 部署（Vercel）
- 提交并重新部署，关闭构建缓存或增加 CSS 版本参数
- 在线上 `https://qell-dex.vercel.app/tradingview/chart_v2.css` 检查是否包含新增的隐藏工具栏选择器
- 首页源代码的路由清单应包含 `assets/firstpage-*.js`，但 Network 必须能看到 TradingView 的 `charting_library.js` 请求

5. 备用方案（如需“简化曲线”）
- 在 `TradingviewWidget` 的 `overrides` 中设置主序列样式为折线或面积（根据你的偏好继续微调），仍保持固定 `DEFAULT_SYMBOL` 与隐藏左侧工具栏。

## 交付物
- 首页组件替换后的代码
- 更新后的 `chart_v2.css`（含左侧工具栏隐藏）
- 验证清单与部署注意事项（缓存穿透、iframe 请求确认）

请确认以上计划，我将按此执行实现与验证。