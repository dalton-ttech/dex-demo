import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { useTickerStream } from "@orderly.network/hooks";
import config from "@/utils/config";
import { updateSymbol } from "@/utils/storage";
import { formatSymbol, generatePageTitle } from "@/utils/utils";

export const meta: MetaFunction = ({ params }) => {
  return [{ title: generatePageTitle(formatSymbol(params.symbol!)) }];
};

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

  const ticker = useTickerStream(symbol);

  useEffect(() => {
    if (ticker && ticker.mark_price) {
      const price = formatTitlePrice(ticker.mark_price);
      document.title = `${price} · ${formatSymbol(symbol)} · Qell`;
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

  const customTradingViewConfig = useMemo(() => {
    const originalConfig = config.tradingPage.tradingViewConfig || {};

    return {
      ...originalConfig,

      // [新增] 禁用一些不需要的特性，减少暴露原始数据的入口
      disabled_features: [
        "header_symbol_search", // 禁用头部的搜索（防止看到不需要的信息）
        "symbol_info",          // 尝试禁用右键菜单里的'Symbol Info'
        "display_market_status",// 隐藏市场开闭状态
        "go_to_date",
        "header_compare",       // 隐藏对比功能
      ],

      // [新增] 启用特性
      enabled_features: [
        "hide_left_toolbar_by_default" // 默认隐藏左侧绘图工具，界面更清爽
      ],

      overrides: {
        // --- 1. 核心去名 (关键修改) ---
        // 强制左上角只显示 Ticker (如 PERP_BTC_USDC)，不显示描述和交易所
        "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker",

        // 再次强制关闭交易所显示
        "mainSeriesProperties.statusViewStyle.showExchange": false,
        "paneProperties.legendProperties.showExchange": false,

        // --- 2. 颜色配置 (莫兰迪色 & 深灰黑底) ---
        "paneProperties.background": "#0A0A0A",
        "paneProperties.backgroundType": "solid",
        "paneProperties.vertGridProperties.color": "rgba(55, 57, 61, 0.2)",
        "paneProperties.horzGridProperties.color": "rgba(55, 57, 61, 0.2)",

        "mainSeriesProperties.candleStyle.upColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.downColor": "#D87A7A",
        "mainSeriesProperties.candleStyle.borderUpColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.borderDownColor": "#D87A7A",
        "mainSeriesProperties.candleStyle.wickUpColor": "#89C9A0",
        "mainSeriesProperties.candleStyle.wickDownColor": "#D87A7A",
      },
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