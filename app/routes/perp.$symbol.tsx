import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import config from "@/utils/config";
import { updateSymbol } from "@/utils/storage";
import { formatSymbol, generatePageTitle } from "@/utils/utils";

export const meta: MetaFunction = ({ params }) => {
  return [{ title: generatePageTitle(formatSymbol(params.symbol!)) }];
};

export default function PerpPage() {
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setSymbol(symbol);
      
      const searchParamsString = searchParams.toString();
      const queryString = searchParamsString ? `?${searchParamsString}` : '';
      
      navigate(`/perp/${symbol}${queryString}`);
    },
    [navigate, searchParams]
  );

  // --- 自定义 TradingView 配置 (修复背景黑块) ---
  const customTradingViewConfig = useMemo(() => {
    const originalConfig = config.tradingPage.tradingViewConfig || {};
    
    return {
      ...originalConfig,
      overrides: {
        // [关键修改]：
        // 因为 TradingView iframe 不支持透明背景，我们将其设为 #0A0A0A
        // 这与 theme.css 中卡片内胆顶部的颜色一致，视觉上实现"伪透明"融合
        "paneProperties.background": "#0A0A0A", 
        "paneProperties.backgroundType": "solid",
        
        // 网格线：极淡，融入背景
        "paneProperties.vertGridProperties.color": "rgba(55, 57, 61, 0.2)",
        "paneProperties.horzGridProperties.color": "rgba(55, 57, 61, 0.2)",
        
        // 蜡烛图颜色：Aitail 莫兰迪色系
        "mainSeriesProperties.candleStyle.upColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.downColor": "#D87A7A",
        "mainSeriesProperties.candleStyle.borderUpColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.borderDownColor": "#D87A7A",
        "mainSeriesProperties.candleStyle.wickUpColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.wickDownColor": "#D87A7A",
      },
      // 工具栏背景也设为深色融合
      loading_screen: { backgroundColor: "#0A0A0A" },
      toolbar_bg: "#0A0A0A",
    };
  }, []);

  return (
    <TradingPage
      symbol={symbol}
      onSymbolChange={onSymbolChange}
      tradingViewConfig={customTradingViewConfig}
      sharePnLConfig={config.tradingPage.sharePnLConfig}
    />
  );
}