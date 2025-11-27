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

  // --- 关键修改 ---
  const customTradingViewConfig = useMemo(() => {
    const originalConfig = config.tradingPage.tradingViewConfig || {};
    
    return {
      ...originalConfig,
      overrides: {
        // [修正]：尝试设为透明 (transparent)。
        // 注意：TradingView 对 transparent 的支持取决于版本。
        // 如果透明不生效，请将下方代码改为与 CSS 渐变底部一致的深色： "#1A1E26"
        "paneProperties.background": "transparent", 
        "paneProperties.backgroundType": "solid",
        
        // 网格线极淡
        "paneProperties.vertGridProperties.color": "rgba(55, 57, 61, 0.2)",
        "paneProperties.horzGridProperties.color": "rgba(55, 57, 61, 0.2)",
        
        // 蜡烛图颜色 (保持不变)
        "mainSeriesProperties.candleStyle.upColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.downColor": "#D87A7A",
        "mainSeriesProperties.candleStyle.borderUpColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.borderDownColor": "#D87A7A",
        "mainSeriesProperties.candleStyle.wickUpColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.wickDownColor": "#D87A7A",
      },
      // [修正]：工具栏背景设为透明或半透明
      loading_screen: { backgroundColor: "transparent" },
      toolbar_bg: "transparent",
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