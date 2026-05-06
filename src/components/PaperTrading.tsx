import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, Wallet, History, 
  ArrowUpRight, ArrowDownRight, Zap, X, Info, 
  BarChart3, ShieldCheck, Clock, DollarSign, Percent,
  AlertTriangle, CheckCircle2
 } from 'lucide-react';
import { MarketChart } from './MarketChart';
import { Trade, MarketPrice } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_BALANCE = 100000;
const TRADABLE_PAIRS = [
  { pair: 'EUR/USD', basePrice: 1.0850, volatility: 0.0002 },
  { pair: 'GBP/USD', basePrice: 1.2640, volatility: 0.0003 },
  { pair: 'USD/JPY', basePrice: 151.40, volatility: 0.05 },
  { pair: 'BTC/USD', basePrice: 64200, volatility: 50 },
  { pair: 'ETH/USD', basePrice: 3450, volatility: 5 },
];

export function PaperTrading() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [prices, setPrices] = useState<Record<string, MarketPrice>>(() => {
    const initial: Record<string, MarketPrice> = {};
    TRADABLE_PAIRS.forEach(p => {
      initial[p.pair] = { pair: p.pair, price: p.basePrice, change: 0, changePercent: 0 };
    });
    return initial;
  });
  
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [lotSize, setLotSize] = useState(0.1);
  const [leverage, setLeverage] = useState(100);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [pulseType, setPulseType] = useState<'Long' | 'Short' | null>(null);
  const [stopLoss, setStopLoss] = useState<number | ''>('');
  const [takeProfit, setTakeProfit] = useState<number | ''>('');

  // Price Simulation Engine
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        TRADABLE_PAIRS.forEach(p => {
          const current = prev[p.pair];
          const movement = (Math.random() - 0.5) * p.volatility;
          const newPrice = current.price + movement;
          const change = newPrice - p.basePrice;
          const changePercent = (change / p.basePrice) * 100;
          
          next[p.pair] = {
            pair: p.pair,
            price: newPrice,
            change,
            changePercent
          };
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Notification cleanup
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Real-time PnL Calculation
  const activeTrades = useMemo(() => trades.filter(t => t.status === 'Active'), [trades]);
  const closedTrades = useMemo(() => trades.filter(t => t.status === 'Closed'), [trades]);

  const totalPnL = useMemo(() => {
    return activeTrades.reduce((acc, trade) => {
      const currentPrice = prices[trade.pair]?.price || trade.entryPrice;
      const priceDiff = trade.type === 'Long' 
        ? currentPrice - trade.entryPrice 
        : trade.entryPrice - currentPrice;
      
      const contractSize = trade.pair.includes('BTC') || trade.pair.includes('ETH') ? 1 : 100000;
      return acc + (priceDiff * trade.size * contractSize);
    }, 0);
  }, [activeTrades, prices]);

  const equity = balance + totalPnL;
  const marginUsed = useMemo(() => {
    return activeTrades.reduce((acc, trade) => {
      const currentPrice = prices[trade.pair]?.price || trade.entryPrice;
      const contractSize = trade.pair.includes('BTC') || trade.pair.includes('ETH') ? 1 : 100000;
      return acc + (currentPrice * trade.size * contractSize) / trade.leverage;
    }, 0);
  }, [activeTrades, prices]);

  const freeMargin = useMemo(() => Math.max(0, equity - marginUsed), [equity, marginUsed]);
  const marginLevel = useMemo(() => marginUsed > 0 ? (equity / marginUsed) * 100 : 0, [equity, marginUsed]);

  // Margin Call Simulation: Liquidate all positions if margin level falls below 50%
  useEffect(() => {
    if (marginUsed > 0 && marginLevel < 50) {
      setNotification({ message: 'MARGIN CALL: Positions Liquidated', type: 'error' });
      setTrades(prev => prev.map(t => {
        if (t.status === 'Active') {
          const currentPrice = prices[t.pair]?.price || t.entryPrice;
          const priceDiff = t.type === 'Long' 
            ? currentPrice - t.entryPrice 
            : t.entryPrice - currentPrice;
          const contractSize = t.pair.includes('BTC') || t.pair.includes('ETH') ? 1 : 100000;
          const finalPnL = priceDiff * t.size * contractSize;
          
          setBalance(b => b + finalPnL);
          return {
            ...t,
            status: 'Closed',
            exitPrice: currentPrice,
            pnl: finalPnL,
            exitTimestamp: new Date().toLocaleTimeString([], { hour12: false })
          };
        }
        return t;
      }));
    }
  }, [marginLevel, marginUsed, prices]);

  const executeTrade = (type: 'Long' | 'Short') => {
    const currentPrice = prices[selectedPair].price;
    const spread = selectedPair.includes('BTC') || selectedPair.includes('ETH') ? 1.0 : 0.0002;
    const executionPrice = type === 'Long' ? currentPrice + spread : currentPrice - spread;
    
    // Check if enough margin
    const contractSize = selectedPair.includes('BTC') || selectedPair.includes('ETH') ? 1 : 100000;
    const requiredMargin = (executionPrice * lotSize * contractSize) / leverage;

    if (requiredMargin > freeMargin) {
      setNotification({ message: 'Insufficient Margin for execution.', type: 'error' });
      return;
    }

    const newTrade: Trade = {
      id: Math.random().toString(36).substring(7),
      pair: selectedPair,
      type,
      entryPrice: executionPrice,
      size: lotSize,
      leverage,
      pnl: 0,
      status: 'Active',
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      stopLoss: typeof stopLoss === 'number' ? stopLoss : undefined,
      takeProfit: typeof takeProfit === 'number' ? takeProfit : undefined,
    };

    setTrades(prev => [newTrade, ...prev]);
    setPulseType(type);
    setTimeout(() => setPulseType(null), 600);
    setNotification({ message: `${type} order executed for ${selectedPair}`, type: 'success' });
    
    // Reset SL/TP fields
    setStopLoss('');
    setTakeProfit('');
  };

  const updateTradeSLTP = (id: string, sl?: number, tp?: number) => {
    setTrades(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          stopLoss: sl,
          takeProfit: tp
        };
      }
      return t;
    }));
  };

  const closeTrade = (id: string) => {
    setTrades(prev => prev.map(t => {
      if (t.id === id && t.status === 'Active') {
        const currentPrice = prices[t.pair]?.price || t.entryPrice;
        const priceDiff = t.type === 'Long' 
          ? currentPrice - t.entryPrice 
          : t.entryPrice - currentPrice;
        const contractSize = t.pair.includes('BTC') || t.pair.includes('ETH') ? 1 : 100000;
        const finalPnL = priceDiff * t.size * contractSize;
        
        setBalance(b => b + finalPnL);
        setNotification({ message: `Position closed: ${finalPnL >= 0 ? '+' : ''}${finalPnL.toFixed(2)} USD`, type: finalPnL >= 0 ? 'success' : 'error' });
        return {
          ...t,
          status: 'Closed',
          exitPrice: currentPrice,
          pnl: finalPnL,
          exitTimestamp: new Date().toLocaleTimeString([], { hour12: false })
        };
      }
      return t;
    }));
  };

  // SL/TP Logic: Automatically close positions if levels are hit
  useEffect(() => {
    activeTrades.forEach(trade => {
      const currentPrice = prices[trade.pair]?.price;
      if (!currentPrice) return;

      let triggered = false;
      let reason = '';

      if (trade.type === 'Long') {
        if (trade.stopLoss && currentPrice <= trade.stopLoss) {
          triggered = true;
          reason = 'Stop Loss';
        } else if (trade.takeProfit && currentPrice >= trade.takeProfit) {
          triggered = true;
          reason = 'Take Profit';
        }
      } else { // Short
        if (trade.stopLoss && currentPrice >= trade.stopLoss) {
          triggered = true;
          reason = 'Stop Loss';
        } else if (trade.takeProfit && currentPrice <= trade.takeProfit) {
          triggered = true;
          reason = 'Take Profit';
        }
      }

      if (triggered) {
        closeTrade(trade.id);
        console.log(`${reason} hit for trade ${trade.id}`);
      }
    });
  }, [prices, activeTrades]);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto relative">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-12 left-1/2 z-[100] px-6 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-md ${
              notification.type === 'success' ? 'bg-secondary/20 border-secondary/40 text-secondary' : 'bg-error/20 border-error/40 text-error'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black font-headline text-white tracking-tight">Live <span className="text-secondary">Simulation</span></h1>
          <p className="text-on-surface-variant text-xs mt-2">Institutional-grade paper trading terminal with real-time liquidity simulation.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-xl shrink-0">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Live Market Feed</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl shrink-0">
            <Clock className="w-4 h-4 text-on-surface-variant" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{new Date().toLocaleTimeString([], { hour12: false })} UTC</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Account Metrics */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { label: 'Balance', value: `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Wallet, color: 'text-white' },
              { label: 'Equity', value: `$${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Activity, color: 'text-secondary' },
              { label: 'Margin Used', value: `$${marginUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: ShieldCheck, color: 'text-tertiary' },
              { label: 'Free Margin', value: `$${freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Wallet, color: 'text-white' },
              { label: 'Margin Level', value: marginUsed > 0 ? `${marginLevel.toFixed(1)}%` : '∞', icon: Percent, color: marginLevel < 100 && marginLevel > 0 ? 'text-error' : 'text-secondary' },
            ].map((stat, i) => (
              <div key={stat.label} className="bg-surface-container p-6 rounded-3xl border border-outline/30 relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-1">{stat.label}</span>
                  <h4 className={`text-xl font-black font-mono ${stat.color}`}>{stat.value}</h4>
                  {stat.label === 'Margin Level' && marginUsed > 0 && (
                    <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, marginLevel / 5)}%` }}
                        className={`h-full ${marginLevel < 100 ? 'bg-error' : marginLevel < 200 ? 'bg-amber-500' : 'bg-secondary'}`}
                      />
                    </div>
                  )}
                </div>
                <stat.icon className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MarketChart pair={selectedPair} height={500} />
            </div>
            <div className="space-y-6">
              <div className="bg-surface-container rounded-3xl border border-outline/30 p-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-secondary" />
                  Terminal Execution
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 block">Select Instrument</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TRADABLE_PAIRS.map(p => (
                        <button
                          key={p.pair}
                          onClick={() => setSelectedPair(p.pair)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                            selectedPair === p.pair 
                              ? 'bg-secondary text-black border-secondary' 
                              : 'bg-white/5 text-white border-white/10 hover:border-white/30'
                          }`}
                        >
                          {p.pair}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 block">Lot Size (Volume)</label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-2">
                          <button 
                            onClick={() => setLotSize(prev => Math.max(0.01, Number((prev - 0.01).toFixed(2))))} 
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
                          >
                            <TrendingDown className="w-3 h-3" />
                          </button>
                          <input 
                            type="number" 
                            step="0.01"
                            min="0.01"
                            value={lotSize} 
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) setLotSize(val);
                            }}
                            className="w-full bg-transparent text-center text-sm font-black text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button 
                            onClick={() => setLotSize(prev => Number((prev + 0.01).toFixed(2)))} 
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
                          >
                            <TrendingUp className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[0.01, 0.1, 1.0].map(val => (
                            <button
                              key={val}
                              onClick={() => setLotSize(val)}
                              className={`py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                                lotSize === val 
                                  ? 'bg-secondary/20 border-secondary text-secondary' 
                                  : 'bg-white/5 border-white/10 text-on-surface-variant hover:border-white/30'
                              }`}
                            >
                              {val === 0.01 ? 'Micro' : val === 0.1 ? 'Mini' : 'Standard'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 block">Leverage</label>
                      <select 
                        value={leverage}
                        onChange={(e) => setLeverage(parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-outline transition-all cursor-pointer"
                      >
                        {[1, 10, 25, 50, 100, 200, 500].map(l => (
                          <option key={l} value={l} className="bg-surface">{l}:1</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 block">Stop Loss</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        placeholder="None"
                        value={stopLoss} 
                        onChange={(e) => setStopLoss(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-secondary transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 block">Take Profit</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        placeholder="None"
                        value={takeProfit} 
                        onChange={(e) => setTakeProfit(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-secondary transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-on-surface-variant">Market Price</span>
                        <span className="text-white font-mono">{prices[selectedPair].price.toFixed(selectedPair.includes('JPY') ? 2 : 4)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-on-surface-variant">Notional Value</span>
                        <span className="text-white font-mono">
                          ${((prices[selectedPair].price * lotSize * (selectedPair.includes('BTC') || selectedPair.includes('ETH') ? 1 : 100000))).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-on-surface-variant">Required Margin</span>
                        <span className="text-secondary font-mono">
                          ${((prices[selectedPair].price * lotSize * (selectedPair.includes('BTC') || selectedPair.includes('ETH') ? 1 : 100000)) / leverage).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        const spread = selectedPair.includes('BTC') || selectedPair.includes('ETH') ? 1.0 : 0.0002;
                        const precision = selectedPair.includes('JPY') ? 2 : (selectedPair.includes('BTC') ? 1 : 4);
                        return (
                          <>
                            <motion.button 
                              onClick={() => executeTrade('Long')}
                              animate={pulseType === 'Long' ? { 
                                scale: [1, 1.05, 1],
                                backgroundColor: ['#00E5FF', '#FFFFFF', '#00E5FF'],
                                boxShadow: ['0px 0px 0px rgba(0,229,255,0)', '0px 0px 20px rgba(0,229,255,0.5)', '0px 0px 0px rgba(0,229,255,0)']
                              } : {}}
                              transition={{ duration: 0.4 }}
                              className="group relative overflow-hidden py-4 bg-secondary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                              <div className="relative z-10 flex flex-col items-center">
                                <span>Buy / Long</span>
                                <span className="text-[8px] opacity-60">Ask: {(prices[selectedPair].price + spread).toFixed(precision)}</span>
                              </div>
                            </motion.button>
                            <motion.button 
                              onClick={() => executeTrade('Short')}
                              animate={pulseType === 'Short' ? { 
                                scale: [1, 1.05, 1],
                                backgroundColor: ['#FF3B30', '#FFFFFF', '#FF3B30'],
                                boxShadow: ['0px 0px 0px rgba(255,59,48,0)', '0px 0px 20px rgba(255,59,48,0.5)', '0px 0px 0px rgba(255,59,48,0)']
                              } : {}}
                              transition={{ duration: 0.4 }}
                              className="group relative overflow-hidden py-4 bg-error text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                              <div className="relative z-10 flex flex-col items-center">
                                <span>Sell / Short</span>
                                <span className="text-[8px] opacity-60">Bid: {(prices[selectedPair].price - spread).toFixed(precision)}</span>
                              </div>
                            </motion.button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Watchlist & History */}
        <div className="space-y-8">
          <div className="bg-surface-container rounded-3xl border border-outline/30 overflow-hidden">
            <div className="p-6 border-b border-outline/30">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-secondary" />
                Market Watch
              </h3>
            </div>
            <div className="divide-y divide-outline/10">
              {TRADABLE_PAIRS.map(p => (
                <div key={p.pair} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedPair(p.pair)}>
                  <div>
                    <span className="block text-xs font-bold text-white">{p.pair}</span>
                    <span className={`text-[8px] font-bold uppercase ${prices[p.pair].change >= 0 ? 'text-secondary' : 'text-error'}`}>
                      {prices[p.pair].changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-mono font-bold text-white">
                      {prices[p.pair].price.toFixed(p.pair.includes('JPY') ? 2 : 4)}
                    </span>
                    <div className="w-12 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${prices[p.pair].change >= 0 ? 'bg-secondary' : 'bg-error'}`}
                        style={{ width: `${Math.min(100, Math.abs(prices[p.pair].changePercent) * 50)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container rounded-3xl border border-outline/30 overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-outline/30 flex justify-between items-center bg-surface-container-high/50">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('active')}
                  className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'active' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant'}`}
                >
                  Active ({activeTrades.length})
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'history' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant'}`}
                >
                  History ({closedTrades.length})
                </button>
              </div>
              {activeTab === 'active' && activeTrades.length > 0 && (
                <button 
                  onClick={() => activeTrades.forEach(t => closeTrade(t.id))}
                  className="px-2 py-1 bg-error/10 text-error border border-error/20 rounded-md text-[8px] font-black uppercase tracking-widest hover:bg-error/20 transition-all"
                >
                  Close All
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === 'active' ? (
                <div className="divide-y divide-outline/10">
                  {activeTrades.length === 0 ? (
                    <div className="p-10 text-center">
                      <Info className="w-8 h-8 text-on-surface-variant mx-auto mb-3 opacity-20" />
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">No Active Positions</p>
                    </div>
                  ) : (
                    activeTrades.map((trade) => {
                      const currentPrice = prices[trade.pair]?.price || trade.entryPrice;
                      const priceDiff = trade.type === 'Long' 
                        ? currentPrice - trade.entryPrice 
                        : trade.entryPrice - currentPrice;
                      const contractSize = trade.pair.includes('BTC') || trade.pair.includes('ETH') ? 1 : 100000;
                      const currentPnL = priceDiff * trade.size * contractSize;

                      return (
                        <div key={trade.id} className="p-4 hover:bg-white/5 transition-colors group">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{trade.pair}</span>
                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${trade.type === 'Long' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                                  {trade.type}
                                </span>
                              </div>
                              <span className="text-[8px] text-on-surface-variant font-mono uppercase tracking-widest">Size: {trade.size} Lot</span>
                            </div>
                            <button 
                              onClick={() => closeTrade(trade.id)}
                              className="p-1.5 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex justify-between items-end mb-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[9px] font-mono">
                                <span className="text-on-surface-variant">Entry:</span>
                                <span className="text-white">{trade.entryPrice.toFixed(4)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[9px] font-mono">
                                <span className="text-on-surface-variant">Price:</span>
                                <span className="text-white">{currentPrice.toFixed(4)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-black font-mono block ${currentPnL >= 0 ? 'text-secondary' : 'text-error'}`}>
                                {currentPnL >= 0 ? '+' : ''}{currentPnL.toFixed(2)}
                              </span>
                              <span className="text-[8px] text-on-surface-variant uppercase font-bold tracking-tighter">PnL (USD)</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline/10">
                            <div className="space-y-1">
                              <label className="text-[7px] font-black text-on-surface-variant uppercase tracking-widest block">Stop Loss</label>
                              <input 
                                type="number"
                                step="0.0001"
                                value={trade.stopLoss || ''}
                                onChange={(e) => updateTradeSLTP(trade.id, e.target.value === '' ? undefined : parseFloat(e.target.value), trade.takeProfit)}
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-[9px] font-mono text-white focus:outline-none focus:border-error/20"
                                placeholder="Not Set"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[7px] font-black text-on-surface-variant uppercase tracking-widest block">Take Profit</label>
                              <input 
                                type="number"
                                step="0.0001"
                                value={trade.takeProfit || ''}
                                onChange={(e) => updateTradeSLTP(trade.id, trade.stopLoss, e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-[9px] font-mono text-white focus:outline-none focus:border-secondary/20"
                                placeholder="Not Set"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="divide-y divide-outline/10">
                  {closedTrades.length === 0 ? (
                    <div className="p-10 text-center">
                      <History className="w-8 h-8 text-on-surface-variant mx-auto mb-3 opacity-20" />
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">No Trade History</p>
                    </div>
                  ) : (
                    closedTrades.map((trade) => (
                      <div key={trade.id} className="p-4 bg-white/[0.02]">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-white">{trade.pair}</span>
                          <span className={`text-xs font-black font-mono ${trade.pnl >= 0 ? 'text-secondary' : 'text-error'}`}>
                            {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">{trade.type} • {trade.size} Lot</span>
                          <span className="text-[8px] text-on-surface-variant font-mono uppercase">{trade.exitTimestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
