import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import OrderlyProvider from "@/components/orderlyProvider";
import "./styles/index.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        {/* ============================================
            首页交易预览区配置
            设计调整阶段：方便快速修改尺寸
            只需调整下方的 4 个 CSS 变量即可
            ============================================ */}
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            /* 🎨 PC 端尺寸配置 */
            --homepage-preview-width: 860px;
            --homepage-preview-height: 700px;
            
            /* 🎨 移动端尺寸配置 */
            --homepage-preview-width-mobile: 100%;
            --homepage-preview-height-mobile: 500px;
          }
          
          /* ==================== PC 端样式（≥768px） ==================== */
          @media (min-width: 768px) {
            .homepage-trading-preview {
              width: var(--homepage-preview-width) !important;
              max-width: var(--homepage-preview-width) !important;
              height: var(--homepage-preview-height) !important;
              min-height: var(--homepage-preview-height) !important;
              max-height: var(--homepage-preview-height) !important;
              overflow: hidden !important;
              margin: 0 auto !important;
              display: block !important;
            }
            
            .homepage-trading-preview div[id*="tradingview"] {
              display: block !important;
              min-height: var(--homepage-preview-height) !important;
            }
          }
          
          /* ==================== 移动端样式（<768px） ==================== */
          @media (max-width: 767px) {
            .homepage-trading-preview {
              width: var(--homepage-preview-width-mobile) !important;
              max-width: var(--homepage-preview-width-mobile) !important;
              height: var(--homepage-preview-height-mobile) !important;
              min-height: var(--homepage-preview-height-mobile) !important;
              max-height: var(--homepage-preview-height-mobile) !important;
              overflow: hidden !important;
              margin: 0 auto !important;
              display: block !important;
            }
            
            .homepage-trading-preview div[id*="tradingview"] {
              display: block !important;
              min-height: var(--homepage-preview-height-mobile) !important;
            }
          }
          
          /* ==================== 隐藏不需要的交易模块 ==================== */
          
          /* 方法1: 使用 :has() 选择器 - 只显示包含 TradingView 的布局块 */
          .homepage-trading-preview .orderly-dashboard-layout-item {
            display: none !important;
          }
          
          .homepage-trading-preview .orderly-dashboard-layout-item:has(div[id*="tradingview"]) {
            display: block !important;
          }
          
          .homepage-trading-preview .orderly-dashboard-layout-item *:not(div[id*="tradingview"]):not(div[id*="tradingview"] *) {
            display: none !important;
          }
          
          /* 方法2: 直接隐藏特定模块（备用保护） */
          .homepage-trading-preview [class*="sider"],
          .homepage-trading-preview [class*="Sider"],
          .homepage-trading-preview [class*="orderBook"],
          .homepage-trading-preview [class*="OrderBook"],
          .homepage-trading-preview [class*="tradeHistory"],
          .homepage-trading-preview [class*="TradeHistory"],
          .homepage-trading-preview [class*="positions"],
          .homepage-trading-preview [class*="Positions"],
          .homepage-trading-preview [class*="orders"],
          .homepage-trading-preview [class*="Orders"],
          .homepage-trading-preview [class*="dataList"],
          .homepage-trading-preview [class*="DataList"],
          .homepage-trading-preview [data-testid*="positions"],
          .homepage-trading-preview [data-testid*="orders"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
        `}} />

        <Meta />
        <Links />
      </head>
      <body>
        <OrderlyProvider>{children}</OrderlyProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
