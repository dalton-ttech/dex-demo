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

  // --- 极致去标配置 ---
  const customTradingViewConfig = useMemo(() => {
    const originalConfig = config.tradingPage.tradingViewConfig || {};

    return {
      ...originalConfig,

      // [关键 1]：禁用特性列表
      // 这里禁用了 context_menus (右键菜单) 和 symbol_info (商品详情弹窗)
      // 这样用户就无法点开你截图里的那个框了
      disabled_features: [
        "use_localstorage_for_settings",
        "header_symbol_search",
        "symbol_info",           // <--- 禁用商品详情弹窗
        "display_market_status", // 隐藏市场状态
        "header_compare",
        "header_screenshot",
        "popup_hints",
        "show_exchange_logos",   // 隐藏交易所Logo
      ],

      // 启用特性：隐藏左侧工具栏，让界面更像专业交易所
      enabled_features: [
        "hide_left_toolbar_by_default"
      ],

      overrides: {
        // [关键 2]：强制左上角只显示 Ticker
        // 效果：只显示 "PERP_BTC_USDC"，不显示 "Orderly"
        "mainSeriesProperties.statusViewStyle.symbolTextSource": "ticker",
        "mainSeriesProperties.statusViewStyle.showExchange": false,
        "paneProperties.legendProperties.showExchange": false,

        // [关键 3]：配色 (Aitail 莫兰迪色 & 深灰黑底)
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
      // 工具栏背景
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