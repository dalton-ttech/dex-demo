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
      customCssUrl: '/tradingview/chart_v2.css',

      // 禁用特性列表 (保持不变，继续禁用缓存和弹窗)
      disabled_features: [
        "use_localstorage_for_settings",
        "save_chart_properties_to_local_storage",
        "header_symbol_search",
        "symbol_info",
        "display_market_status",
        "header_compare",
        "header_screenshot",
        "popup_hints",
        "show_exchange_logos",
        // 额外禁用：隐藏数据源/价格来源标签以及分辨率按钮
        "symbol_info_price_source",
        "hide_resolution_in_legend",
      ],

      enabled_features: [
        "hide_left_toolbar_by_default",
      ],

      overrides: {
        // --- 核心显示配置 ---
        // 1. 只显示代码 (Ticker)
        "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker",

        // 2. 不显示交易所/数据源
        "mainSeriesProperties.statusViewStyle.showExchange": false,
        "paneProperties.legendProperties.showExchange": false,

        // 3. 显示状态栏中的分辨率 (例如 15)
        "mainSeriesProperties.statusViewStyle.showInterval": true,
        // 保持顶部时间周期按钮显示
        "mainSeriesProperties.statusViewStyle.showResolutions": true,

        // 4. 不显示描述
        "mainSeriesProperties.statusViewStyle.showDescription": false,

        // 5. 显示系列标题(符号)，不显示 OHLC
        "paneProperties.legendProperties.showSeriesTitle": true,
        "paneProperties.legendProperties.showSeriesOHLC": false,
        // 隐藏涨跌的数值（如果仍显示会占位）
        "paneProperties.legendProperties.showBarChange": false,
        // 禁用符号 Logo
        "mainSeriesProperties.statusViewStyle.showSymbolLogo": false,

        // --- 配色配置 (Aitail 风格) ---
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
