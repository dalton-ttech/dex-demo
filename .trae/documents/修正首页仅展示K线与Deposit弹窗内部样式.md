## 问题概览
- 首页大展示区仍出现交易页模块（订单簿、仓位等），未达到“只保留K线”的要求
- Deposit 弹窗内部仍存在双层边框与 outline 叠加，导致线框重叠错位

## 首页仅展示K线的实现计划
1. 移除首页对 `TradingPage` 组件的依赖，改为“仅渲染图表”的组件：
   - 优先方案：使用 SDK 内部的纯图表组件（若存在），例如 `TradingViewWidget/Chart`。若 SDK未提供独立图表组件，则使用 TradingView 原生脚本 `widget` 实例化，仅传入 `symbol`、`interval`、`customCssUrl`。
   - 这样避免 `TradingPage` 自带的模块（订单簿、持仓、资产等）被动渲染。

2. 如果暂时保留 `TradingPage`（备选方案）
   - 在首页组件 `FirstPage.tsx` 的 `TradingPage` 入参中：
     - `disableFeatures`: 明确包含 `'sider','header','footer','tradeHistory','positions','orders','asset_margin_info','slippageSetting','feesInfo','orderBook'`
     - `overrideFeatures`: 将 `orderBook`、`positions`、`orders` 等显式设置为 `null` 或空节点（兜底防止 SDK 某些版本不认 `disableFeatures`）
   - 包裹层添加专用类，如 `homepage-kline-only`，用 CSS 强制隐藏任何非图表的模块容器（选择器基于模块容器通用类前缀，例如 `div[class*="orderbook"], .oui-card[data-module=positions]` 等），并保留图表容器。

3. 图表显示与样式细节
   - 继续使用你现有的 TradingView `customCssUrl`（`/tradingview/chart.css` 或 `/tradingview/chart_v2.css`），保留对 "Orderly" 的隐藏、恢复符号与周期显示
   - 父容器高度与宽度固定（如 `min-height: 520px`），避免在首页因自适应导致图表缩到很小

## Deposit 弹窗内部样式修复
1. 外层保留双层卡片：
   - 弹窗根（`role="dialog"` 或 `.oui-dialog-content`）保留深色渐变底、单描边与圆角阴影，符合你的品牌风格

2. 内部全部改为“简洁单边框”并移除 outline：
   - 在 `role="dialog"` 作用域内：
     - 对 `section/aside/.oui-card/.oui-bg-base-9` 清除背景与阴影，只保留统一的 `border: 1px solid #38455C`
     - 对输入类（`input,.oui-input,[class*="input"],[class*="textField"],[role="textbox"]`）设定：`background: #000; border: 1px solid #38455C; outline: none`
     - 移除所有 outline 类：`.oui-outline-0,.oui-outline-1,.oui-outline-offset-0,.oui-outline,.focus-visible:oui-outline-none` 等
     - 将 `[class*="oui-border-line"]` 统一为 `#38455C`，将 `[class*="oui-bg-base"]` 统一为深色纯底 `#0A0A0A`

3. 仅在弹窗作用域内生效
   - 所有规则均以 `div[role="dialog"]` 或 `.oui-dialog-content` 为根进行限定，避免影响页面其它卡片

## 代码改动位置（待你确认后执行）
- 首页：
  - `app/components/landing/FirstPage.tsx`：
    - 方案A（推荐）：替换 `TradingPage` 为纯图表组件（若 SDK 无，则嵌入 TradingView 原生 `widget`）。
    - 方案B（备选）：保留 `TradingPage`，完善 `disableFeatures` 与 `overrideFeatures`，并添加 `homepage-kline-only` 类下的 CSS 隐藏非图表容器。
- 弹窗样式：
  - `app/styles/theme.css`：
    - 在 `div[role="dialog"], .oui-dialog-content` 作用域下，移除内部双层卡片与 outline，并统一输入与边框样式。

## 验证清单
- 首页：仅出现 K 线，右侧与下方不再渲染订单簿、仓位、订单、资产等模块；窗口缩放后图表仍保持可见尺寸
- Deposit：
  - 弹窗内部不再出现双层描边或错位
  - 输入框仅保留单一描边、无 outline 叠加
  - 外层弹窗保留品牌外观（深色双层卡片风格），内部简洁

## 风险与回退
- 如果 SDK 的模块容器类名在不同版本不一致，首页兜底策略为直接改用 TradingView 原生 `widget` 嵌入，完全无交易页模块渲染风险
- 所有样式限定在弹窗作用域内，避免影响页面其它部分；如仍出现边缘元素，请提供该元素根类名，我将追加到作用域规则中

请确认采用：
- 首页采用“纯图表组件”方案（推荐）或“保留TradingPage但彻底屏蔽其它模块”的备选方案
- 允许我按以上路径更新 `FirstPage.tsx` 与 `theme.css`，并做一次本地验证与截图回传