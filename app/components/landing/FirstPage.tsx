import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import { useAppContext } from '@orderly.network/react-app'
import { Box } from '@orderly.network/ui'
import { TradingPage } from '@orderly.network/trading'
import config from '@/utils/config'
import { DEFAULT_SYMBOL } from '@/utils/storage'
//
import { Zap, BarChart3, Layers } from 'lucide-react'



const useScrambleText = (text: string, active: boolean): string => {
  const [displayText, setDisplayText] = useState<string>(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;\':",./<>?'

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (active) {
      let iteration = 0
      interval = setInterval(() => {
        setDisplayText(() =>
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return text[index]
              }
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )
        if (iteration >= text.length) {
          clearInterval(interval)
        }
        iteration += 1 / 2
      }, 30)
    } else {
      setDisplayText(text)
    }
    return () => clearInterval(interval)
  }, [active, text])

  return displayText
}

interface GlitchButtonProps {
  text: string
  onClick?: () => void
}

interface GhostButtonProps {
  text: string
  to?: string
}



interface MarketRowProps {
  symbol: string
  name: string
  price: string
  change: string
}

const GlitchButton: React.FC<GlitchButtonProps> = ({ text, onClick }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const scrambledText = useScrambleText(text, isHovered)
  return (
    <button
      className="relative h-12 px-8 min-w-[180px] group overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="absolute inset-0 p-[1px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#596571] to-[#6D97C0] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-[1px] bg-black group-hover:bg-[#0A0A0A] transition-colors duration-300" />
      </div>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none mix-blend-overlay" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <span className="font-bold text-sm tracking-wider text-white group-hover:text-[#BFD4FA] transition-colors">{scrambledText}</span>
      </div>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-[#BFD4FA] transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-[#BFD4FA] transition-colors" />
    </button>
  )
}

const GhostButton: React.FC<GhostButtonProps> = ({ text, to }) => {
  const content = (
    <button className="relative h-12 px-8 min-w-[180px] group overflow-hidden bg-transparent">
      <div className="absolute inset-0 border border-[#333] group-hover:border-[#666] transition-colors duration-300" />
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <span className="font-bold text-sm tracking-wider text-[#999] group-hover:text-white transition-colors">{text}</span>
      </div>
    </button>
  )
  return to ? <Link to={to}>{content}</Link> : content
}



const MarketRow: React.FC<MarketRowProps> = ({ symbol, name, price, change }) => {
  const isUp = change.startsWith('+')
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/5 px-4 rounded-lg transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-xs text-[#666] border border-[#333]">{symbol[0]}</div>
        <div>
          <div className="text-sm font-medium text-white group-hover:text-[#BFD4FA] transition-colors">{symbol}</div>
          <div className="text-xs text-[#666]">{name}</div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-medium text-white">${price}</div>
        <div className={`text-xs ${isUp ? 'text-[#89C9A0]' : 'text-[#D87A7A]'}`}>{change}</div>
      </div>
    </div>
  )
}

const Navbar: React.FC<{ onConnect: () => void }> = ({ onConnect }) => (
  <nav className="h-20 flex items-center justify-between px-6 md:px-12 sticky top-0 w-full z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-[#1A1A1A]">
    <div className="flex items-center gap-12">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-[#37393D] to-[#BFD4FA] flex items-center justify-center">
          <div className="w-2 h-2 bg-black rotate-45" />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">Qell<span className="text-[#BFD4FA]">.dex</span></span>
      </div>
      <div className="hidden md:flex gap-8">
        <Link to="/markets" className="text-sm font-medium text-white">Markets</Link>
        <Link to="/leaderboard" className="text-sm font-medium text-[#666] hover:text-white">Leaderboard</Link>
        <Link to="/portfolio" className="text-sm font-medium text-[#666] hover:text-white">Portfolio</Link>
        <Link to="/portfolio/positions" className="text-sm font-medium text-[#666] hover:text-white">Positions</Link>
        <button type="button" className="text-sm font-medium text-[#666] cursor-not-allowed">Community</button>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button onClick={onConnect} className="px-6 py-2 rounded-full border border-[#333] hover:border-[#666] hover:bg-white/5 text-sm text-white transition-all">Connect</button>
    </div>
  </nav>
)

export default function FirstPage() {
  const navigate = useNavigate()
  const { connectWallet } = useAppContext()
  const [symbol] = useState<string>(DEFAULT_SYMBOL)
  const tradingViewConfig = React.useMemo(() => {
    const original = config.tradingPage.tradingViewConfig || {}
    return {
      scriptSRC: original.scriptSRC,
      library_path: original.library_path,
      customCssUrl: (typeof window !== 'undefined' ? window.location.origin : '') + '/tradingview/chart_v2.css?v=v74',
      overrides: {
        'mainSeriesProperties.statusViewStyle.symbolTextSource': 'description',
        'mainSeriesProperties.statusViewStyle.showExchange': 'false',
        'paneProperties.legendProperties.showExchange': 'false',
        'mainSeriesProperties.statusViewStyle.showInterval': 'true',
        'mainSeriesProperties.statusViewStyle.showDescription': 'true',
        'paneProperties.legendProperties.showSeriesTitle': 'true',
        'paneProperties.legendProperties.showLegend': 'true',
        'mainSeriesProperties.statusViewStyle.showSymbolLogo': 'false',
      },
    }
  }, [])
  const homepageDisableFeatures = [
    'sider',
    'topNavBar',
    'footer',
    'header',
    'orderBook',
    'tradeHistory',
    'positions',
    'orders',
    'asset_margin_info',
    'slippageSetting',
    'feesInfo',
  ]
  const klineOnlyOverrides = {
    sider: <></>,
    topNavBar: <></>,
    footer: <></>,
    header: <></>,
    orderBook: <></>,
    tradeHistory: <></>,
    positions: <></>,
    orders: <></>,
    asset_margin_info: <></>,
    slippageSetting: <></>,
    feesInfo: <></>,
  } as unknown as import('@orderly.network/trading').TradingPageProps['overrideFeatures']
  return (
    <div className="min-h-screen bg-[#000000] text-white font-mono selection:bg-[#BFD4FA] selection:text-black overflow-x-hidden">
      <Navbar onConnect={() => connectWallet()} />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#BFD4FA] rounded-full blur-[300px] opacity-[0.05] pointer-events-none" />
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center justify-center text-center gap-8 mb-16 mt-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#333] bg-[#0A0A0A] text-xs text-[#999999] hover:border-[#666] transition-colors cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BFD4FA] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BFD4FA]"></span>
            </span>
            Qell V2 MAINNET IS LIVE
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[1.1] max-w-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#BFD4FA] to-white/70">Limitless Liquidity.</span>
            <br />
            <span className="text-white">Zero Latency.</span>
          </h1>
          <p className="text-[#999999] text-base md:text-lg leading-relaxed max-w-lg font-light">CEX-level performance. Ethereum security.</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 items-center">
            <GhostButton text="EXPLORE FEATURES" to="/markets" />
            <GlitchButton text="START TRADING" onClick={() => navigate(`/perp/${DEFAULT_SYMBOL}`)} />
          </div>
        </div>
        <div className="mb-32 relative">
          <div className="w-full mx-auto">
            <Box
              p={0}
              intensity={900}
              r="xl"
              width="auto"
              style={{ height: 'var(--homepage-preview-height)', minHeight: 'var(--homepage-preview-height)', maxWidth: 'var(--homepage-preview-width)', overflow: 'hidden' }}
              className="homepage-trading-preview"
            >

              <TradingPage
                symbol={symbol}
                tradingViewConfig={tradingViewConfig}
                sharePnLConfig={config.tradingPage.sharePnLConfig}
                disableFeatures={homepageDisableFeatures as unknown as import('@orderly.network/trading').TradingPageProps['disableFeatures']}
                overrideFeatures={klineOnlyOverrides}
              />
            </Box>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-16 border-t border-[#1A1A1A] pt-8 text-center">
            {[
              { label: 'Total Volume', val: '$42B+' },
              { label: 'Trades / Sec', val: '15,000' },
              { label: 'Latency', val: '< 10ms' },
              { label: 'Gas Cost', val: '$0.00' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-white tracking-tight">{stat.val}</span>
                <span className="text-xs text-[#555] uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <div className="lg:col-span-8">
            <Box p={8} intensity={900} r="xl" width="100%">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#BFD4FA]" />
                    Market Overview
                  </h3>
                  <div className="flex gap-2">
                    {['All', 'Gainers', 'Losers'].map((tab) => (
                      <button key={tab} className="px-3 py-1 rounded text-xs transition-colors font-bold text-[#666] hover:text-white">{tab}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <MarketRow symbol="BTC" name="Bitcoin" price="64,230.50" change="+2.4%" />
                  <MarketRow symbol="ETH" name="Ethereum" price="3,450.12" change="+1.8%" />
                  <MarketRow symbol="SOL" name="Solana" price="145.20" change="+5.2%" />
                  <MarketRow symbol="JUP" name="Jupiter" price="1.24" change="-0.5%" />
                  <MarketRow symbol="BONK" name="Bonk" price="0.000024" change="+12.4%" />
                </div>
              </div>
            </Box>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Box p={6} intensity={900} r="xl" width="100%" className="flex-1">
              <div className="flex flex-col h-full justify-center items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#BFD4FA]">
                  <Zap size={24} />
                </div>
                <h4 className="text-lg font-bold text-white">Matching Engine</h4>
                <p className="text-[#999999] text-sm leading-relaxed">High-frequency matching engine capable of sustaining 100k TPS with deterministic latency.</p>
              </div>
            </Box>
            <Box p={6} intensity={900} r="xl" width="100%" className="flex-1">
              <div className="flex flex-col h-full justify-center items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#89C9A0]">
                  <Layers size={24} />
                </div>
                <h4 className="text-lg font-bold text-white">Unified Liquidity</h4>
                <p className="text-[#999999] text-sm leading-relaxed">Access liquidity across multiple chains from a single, unified interface.</p>
              </div>
            </Box>
          </div>
        </div>
      </main>
    </div>
  )
}
