import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { useTickerStream } from "@orderly.network/hooks"; // 保持引入实时价格钩子
import config from "@/utils/config";
import { updateSymbol } from "@/utils/storage";
import { formatSymbol, generatePageTitle } from "@/utils/utils";

export const meta: MetaFunction = ({ params }) => {
  return [{ title: generatePageTitle(formatSymbol(params.symbol!)) }];
};

// 价格格式化辅助函数
const formatTitlePrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export default function PerpPage() {
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. 获取实时行情
  const ticker = useTickerStream(symbol);

  // 2. 实时更新标签页标题
  useEffect(() => {
    if (ticker && ticker.mark_price) {
      const price = formatTitlePrice(ticker.mark_price);
      document.title = `${price} | ${formatSymbol(symbol)} | Qell`;
    }
  }, [ticker, symbol]);

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

  // --- TradingView 配置 (已修改为你要求的莫兰迪配色) ---
  const customTradingViewConfig = useMemo(() => {
    const originalConfig = config.tradingPage.tradingViewConfig || {};

    return {
      ...originalConfig,
      overrides: {
        // [背景]：配合莫兰迪色，使用深灰黑 (与 theme.css 内胆一致)
        "paneProperties.background": "#0A0A0A",
        "paneProperties.backgroundType": "solid",

        // [网格]：极淡灰色
        "paneProperties.vertGridProperties.color": "rgba(55, 57, 61, 0.2)",
        "paneProperties.horzGridProperties.color": "rgba(55, 57, 61, 0.2)",

        // [关键修改]：颜色替换
        // 涨 (Green) -> #89C9A0
        "mainSeriesProperties.candleStyle.upColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.borderUpColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.wickUpColor": "#89C9A0",

        // 跌 (Red) -> #D87A7A
        "mainSeriesProperties.candleStyle.downColor": "#D87A7A",
        "mainSeriesProperties.candleStyle.borderDownColor": "#D87A7A",
        "mainSeriesProperties.candleStyle.wickDownColor": "#D87A7A",
      },
      // 加载屏背景
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