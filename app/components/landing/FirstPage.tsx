import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import { DEFAULT_SYMBOL } from '@/utils/storage'
import {
  ChevronDown,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Search,
  Layers,
} from 'lucide-react'

const COLORS = {
  bg: '#000000',
  main: '#FFFFFF',
  mainAccent: '#BFD4FA',
  secondary: '#999999',
  wireframeStart: '#37393D',
  wireframeMid: '#38455C',
  wireframeEnd: '#BFD4FA',
  buttonBorderStart: '#596571',
  buttonBorderEnd: '#6D97C0',
}

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

interface DoubleLayerCardProps {
  children: React.ReactNode
  className?: string
  glowIntensity?: 'normal' | 'high'
}

interface MarketRowProps {
  symbol: string
  name: string
  price: string
  change: string
  chartPath: string
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

const DoubleLayerCard: React.FC<DoubleLayerCardProps> = ({ children, className = '', glowIntensity = 'normal' }) => {
  return (
    <div
      className={`relative rounded-3xl p-[1px] transition-all duration-500 group ${className}`}
      style={{
        background: `linear-gradient(160deg, ${COLORS.wireframeStart} 0%, ${COLORS.wireframeMid} 60%, ${COLORS.wireframeEnd} 100%)`,
      }}
    >
      <div className="h-full w-full bg-[#000000] rounded-[23px] p-[4px] relative">
        <div className="h-full w-full rounded-[19px] relative overflow-hidden flex flex-col">
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${COLORS.mainAccent} 0%, ${COLORS.wireframeMid} 15%, transparent 80%)`, opacity: 0.15 }}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 z-0 pointer-events-none blur-2xl transition-opacity duration-700 ${glowIntensity === 'high' ? 'opacity-30 h-[100px]' : 'opacity-15 h-[60px]'}`}
            style={{ background: COLORS.mainAccent }}
          />
          <div className="relative z-10 h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}

const MarketRow: React.FC<MarketRowProps> = ({ symbol, name, price, change, chartPath }) => {
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
      <div className="w-24 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
          <path d={chartPath} fill="none" stroke={isUp ? '#89C9A0' : '#D87A7A'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-white">${price}</div>
        <div className={`text-xs ${isUp ? 'text-[#89C9A0]' : 'text-[#D87A7A]'}`}>{change}</div>
      </div>
    </div>
  )
}

const Navbar: React.FC = () => (
  <nav className="h-20 flex items-center justify-between px-6 md:px-12 fixed top-0 w-full z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-[#1A1A1A]">
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
        <a href="javascript:void(0)" className="text-sm font-medium text-[#666] cursor-not-allowed">Community</a>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2 bg-[#0A0A0A] border border-[#222] rounded-full px-3 py-1.5">
        <Search size={14} className="text-[#666]" />
        <input type="text" placeholder="Search tokens..." className="bg-transparent text-sm text-white placeholder-[#444] outline-none w-32" />
        <span className="text-[10px] text-[#444] border border-[#333] px-1 rounded">/</span>
      </div>
      <button className="px-6 py-2 rounded-full border border-[#333] hover:border-[#666] hover:bg白/5 text-sm text-white transition-all">Connect</button>
    </div>
  </nav>
)

export default function FirstPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#000000] text白 font-mono selection:bg-[#BFD4FA] selection:text黑 overflow-x-hidden">
      <Navbar />
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
            <span className="text白">Zero Latency.</span>
          </h1>
          <p className="text-[#999999] text-base md:text-lg leading-relaxed max-w-lg font-light">CEX-level performance. Ethereum security.</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 items-center">
            <GhostButton text="EXPLORE FEATURES" to="/markets" />
            <GlitchButton text="START TRADING" onClick={() => navigate(`/perp/${DEFAULT_SYMBOL}`)} />
          </div>
        </div>
        <div className="mb-32 relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="absolute inset-0 bg-[#BFD4FA] blur-[150px] opacity-[0.08] pointer-events-none" />
          <DoubleLayerCard className="w-full mx-auto shadow-2xl shadow-indigo-500/10" glowIntensity="high">
            <div className="flex flex-col h-[500px] md:h-[600px] bg-[#050505]">
              <div className="h-14 border-b border-[#1A1A1A] flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-[#1A1A1A] px-2 py-1 rounded transition-colors">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                    <span className="font-medium text白">SOL-USDC</span>
                    <ChevronDown size={14} className="text-[#666]" />
                  </div>
                  <span className="text-green-400 text-sm">$145.20</span>
                  <span className="text-[#666] text-xs">24h Vol: $42.5M</span>
                </div>
                <div className="flex gap-4 text-xs text-[#666]">
                  <span className="text-[#BFD4FA]">Spot</span>
                  <span className="hover:text白 cursor-pointer">Perp</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col md:flex-row">
                <div className="flex-1 border-r border-[#1A1A1A] p-6 relative flex flex-col">
                  <div className="absolute top-6 left-6 flex gap-2">
                    {['15m', '1H', '4H', '1D'].map((t) => (
                      <span key={t} className="text-xs text-[#444] hover:text-[#BFD4FA] cursor-pointer bg-[#0A0A0A] px-2 py-1 rounded border border-[#222]">{t}</span>
                    ))}
                  </div>
                  <div className="flex-1 mt-8 relative opacity-80">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#BFD4FA" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#BFD4FA" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 300 C 100 280, 200 320, 300 250 C 400 180, 500 220, 600 150 L 600 400 L 0 400 Z" fill="url(#chartGradient)" />
                      <path d="M0 300 C 100 280, 200 320, 300 250 C 400 180, 500 220, 600 150" fill="none" stroke="#BFD4FA" strokeWidth="2" />
                    </svg>
                    <div className="absolute right-0 top-[37%] flex items-center gap-2 transform translate-x-1/2">
                      <div className="bg-[#BFD4FA] text黑 text-[10px] font-bold px-2 py-0.5 rounded-l">145.20</div>
                      <div className="w-full border-t border-dashed border-[#BFD4FA]/30 absolute right-full top-1/2 w-[600px]" />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-[320px] flex flex-col">
                  <div className="flex-1 p-4 border-b border-[#1A1A1A] overflow-hidden">
                    <div className="flex justify-between text-[10px] text-[#666] mb-2 uppercase">
                      <span>Price (USDC)</span>
                      <span>Size (SOL)</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <div key={`ask-${i}`} className="flex justify-between">
                          <span className="text-red-400">145.{25 + i}</span>
                          <span className="text-[#444]">{(Math.random() * 10).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="py-2 flex justify-center items-center text白 font-medium text-sm">145.20</div>
                      {[...Array(5)].map((_, i) => (
                        <div key={`bid-${i}`} className="flex justify之间">
                          <span className="text-green-400">145.{15 - i}</span>
                          <span className="text-[#444]">{(Math.random() * 10).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-[#080808]">
                    <div className="flex gap-2 mb-4 bg-[#111] p-1 rounded-lg">
                      <button className="flex-1 py-1 text-xs font-medium text黑 bg-[#BFD4FA] rounded">Buy</button>
                      <button className="flex-1 py-1 text-xs font-medium text-[#666] hover:text白">Sell</button>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[#111] border border-[#222] rounded-lg p-3 flex justify-between items-center">
                        <span className="text-xs text-[#666]">Amount</span>
                        <span className="text-sm text白">0.00</span>
                      </div>
                      <button className="w-full h-10 relative group overflow-hidden bg黑 border border-[#333] hover:border-[#BFD4FA] transition-colors">
                        <div className="absolute inset-0 bg白/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-medium text白 relative z-10">Place Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DoubleLayerCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-16 border-t border-[#1A1A1A] pt-8 text-center">
            {[
              { label: 'Total Volume', val: '$42B+' },
              { label: 'Trades / Sec', val: '15,000' },
              { label: 'Latency', val: '< 10ms' },
              { label: 'Gas Cost', val: '$0.00' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-2xl font-bold text白 tracking-tight">{stat.val}</span>
                <span className="text-xs text-[#555] uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <div className="lg:col-span-8">
            <DoubleLayerCard className="h-full">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text白 flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#BFD4FA]" />
                    Market Overview
                  </h3>
                  <div className="flex gap-2">
                    {['All', 'Gainers', 'Losers'].map((tab) => (
                      <button key={tab} className="px-3 py-1 rounded text-xs transition-colors font-bold text-[#666] hover:text白">{tab}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <MarketRow symbol="BTC" name="Bitcoin" price="64,230.50" change="+2.4%" chartPath="M0 35 Q 25 35, 35 20 T 70 15 T 100 5" />
                  <MarketRow symbol="ETH" name="Ethereum" price="3,450.12" change="+1.8%" chartPath="M0 30 Q 25 35, 50 20 T 100 10" />
                  <MarketRow symbol="SOL" name="Solana" price="145.20" change="+5.2%" chartPath="M0 38 Q 20 30, 40 35 T 60 15 T 100 2" />
                  <MarketRow symbol="JUP" name="Jupiter" price="1.24" change="-0.5%" chartPath="M0 10 Q 30 5, 50 20 T 100 35" />
                  <MarketRow symbol="BONK" name="Bonk" price="0.000024" change="+12.4%" chartPath="M0 35 Q 10 35, 20 20 T 40 30 T 100 5" />
                </div>
              </div>
            </DoubleLayerCard>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <DoubleLayerCard className="flex-1">
              <div className="p-6 flex flex-col h-full justify-center items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#BFD4FA]">
                  <Zap size={24} />
                </div>
                <h4 className="text-lg font-bold text白">Matching Engine</h4>
                <p className="text-[#999999] text-sm leading-relaxed">High-frequency matching engine capable of sustaining 100k TPS with deterministic latency.</p>
              </div>
            </DoubleLayerCard>
            <DoubleLayerCard className="flex-1">
              <div className="p-6 flex flex-col h-full justify-center items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#89C9A0]">
                  <Layers size={24} />
                </div>
                <h4 className="text-lg font-bold text白">Unified Liquidity</h4>
                <p className="text-[#999999] text-sm leading-relaxed">Access liquidity across multiple chains from a single, unified interface.</p>
              </div>
            </DoubleLayerCard>
          </div>
        </div>
      </main>
    </div>
  )
}
