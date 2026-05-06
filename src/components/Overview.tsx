import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Cpu, Zap, Activity, ShieldCheck, ArrowUpRight, ArrowDownRight, MoreHorizontal, Globe, Clock, Share2, Download, Info } from 'lucide-react';
import { ModelMetric, AppConfig, Alert, Screen } from '../types';
import { AIAnalyst } from './AIAnalyst';
import { Tooltip } from './Tooltip';
import { MarketChart } from './MarketChart';

interface OverviewProps {
  addAlert: (message: string, type: Alert['type']) => void;
  config: AppConfig;
  setScreen: (screen: Screen) => void;
}

const initialMetrics: ModelMetric[] = [
  { name: 'LSTM-X1', type: 'Time Series', rmse: '0.0042', trend: '+1.2%', trendDirection: 'up', icon: 'Activity', color: 'text-secondary' },
  { name: 'GRU-Quantum', type: 'Recurrent', rmse: '0.0038', trend: '-0.4%', trendDirection: 'down', icon: 'Zap', color: 'text-tertiary' },
  { name: 'Transformer-FX', type: 'Attention', rmse: '0.0029', trend: '+2.8%', trendDirection: 'up', icon: 'ShieldCheck', color: 'text-secondary' },
];

const initialPredictions = [
  { id: 1, pair: 'EUR/USD', signal: 'Strong Buy', conf: '94.2%', target: '1.0942', time: '14:20:05' },
  { id: 2, pair: 'GBP/JPY', signal: 'Neutral', conf: '62.1%', target: '190.45', time: '14:19:58' },
  { id: 3, pair: 'USD/CHF', signal: 'Sell', conf: '88.5%', target: '0.8812', time: '14:19:42' },
  { id: 4, pair: 'AUD/USD', signal: 'Buy', conf: '74.8%', target: '0.6521', time: '14:19:30' },
  { id: 5, pair: 'USD/CAD', signal: 'Strong Sell', conf: '91.3%', target: '1.3542', time: '14:19:15' },
];

export function Overview({ addAlert, config, setScreen }: OverviewProps) {
  const [predictions, setPredictions] = useState(initialPredictions);
  const [sentiment, setSentiment] = useState(85);
  const [activeMetrics, setActiveMetrics] = useState(initialMetrics);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Pair,Signal,Confidence,Target,Time\n"
      + predictions.map(p => `${p.pair},${p.signal},${p.conf},${p.target},${p.time}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "live_predictions.csv");
    document.body.appendChild(link);
    link.click();
    addAlert("Live predictions exported successfully", "success");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Update Sentiment
      setSentiment(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.min(Math.max(prev + change, 70), 95);
      });

      // Update Predictions (shift and add new)
      const pairs = ['EUR/USD', 'GBP/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP'];
      const signals = ['Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell'];
      const confValue = Math.random() * 30 + 65;
      const signal = signals[Math.floor(Math.random() * signals.length)];
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      
      // Alert Logic
      if (confValue > config.confidenceThreshold) {
        addAlert(`High Confidence Signal: ${signal} on ${pair} (${confValue.toFixed(1)}%)`, "warning");
      }

      const newPrediction = {
        id: Date.now(),
        pair: pair,
        signal: signal,
        conf: `${confValue.toFixed(1)}%`,
        target: (Math.random() * 2 + 0.5).toFixed(4),
        time: new Date().toLocaleTimeString([], { hour12: false }),
      };

      setPredictions(prev => [newPrediction, ...prev.slice(0, 4)]);

      // Update Metrics Trends
      setActiveMetrics(prev => prev.map(m => ({
        ...m,
        trend: `${(parseFloat(m.trend) + (Math.random() - 0.5) * 0.2).toFixed(1)}%`
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, [config.confidenceThreshold, addAlert]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Project Summary Card */}
      <section className="bg-surface-container-high border border-outline/30 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Project Focus</h3>
            <p className="text-[10px] text-on-surface-variant font-medium">Computational Efficiency Analysis of ML Models for Forex Prediction</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Python', 'Scikit-Learn', 'NumPy', 'Pandas'].map(tech => (
            <span key={tech} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-on-surface-variant uppercase tracking-widest shrink-0">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Hero / Market Status */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl graphite-sheen p-8 text-white shadow-2xl flex flex-col justify-between min-h-[320px]">
          {/* Animated Data Flow Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{ top: Math.random() * 100 + '%' }}
                className="absolute h-px w-24 bg-gradient-to-r from-transparent via-secondary to-transparent"
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Live Market Feed</span>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4"
            >
              Predictive <br />
              <span className="text-secondary">Intelligence</span>
            </h1>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed max-w-md">
              Transformer-based neural networks analyzing global liquidity flows and order book depth in real-time.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-wrap gap-4 mt-8">
            <button 
              onClick={() => setScreen('methodology')}
              className="bg-secondary text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              How it Works
            </button>
            <button 
              onClick={() => setScreen('methodology')}
              className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-xl border border-white/20 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-tertiary" />
              Build Guide
            </button>
          </div>

          <div className="absolute top-0 right-0 w-1/2 h-full opacity-40 pointer-events-none p-4">
            <MarketChart />
          </div>
        </div>

        <div className="bg-surface-container rounded-3xl p-8 border border-outline/30 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-black font-headline text-white">Global Sentiment</h2>
              <Tooltip content="Aggregate market sentiment derived from social media, news feeds, and order flow analysis." />
            </div>
            <p className="text-on-surface-variant text-xs font-medium mb-6">Aggregate AI confidence score</p>
            
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-highest" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="283" 
                  style={{ strokeDashoffset: 283 - (283 * sentiment) / 100 }}
                  className="text-secondary" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span 
                  key={sentiment}
                  className="text-2xl font-black text-white"
                >
                  {Math.round(sentiment)}%
                </span>
                <span className="text-[8px] font-bold text-secondary uppercase tracking-widest">Bullish</span>
              </div>
            </div>
          </div>
          
          <button className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-secondary transition-colors relative z-10">
            Execute Strategy
          </button>

          {/* Background Pulse */}
          <div 
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary rounded-full blur-3xl pointer-events-none opacity-10"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Model Performance Grid */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-xl font-black font-headline text-white tracking-tight">Model Performance</h2>
                <p className="text-on-surface-variant text-xs font-medium">Neural processing unit efficiency</p>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeMetrics.map((metric) => (
                <div 
                  key={metric.name}
                  className="bg-surface-container p-6 rounded-3xl border border-outline/30 hover:border-secondary/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl bg-surface-container-high ${metric.color}`}>
                      {metric.icon === 'Activity' && <Activity className="w-6 h-6" />}
                      {metric.icon === 'Zap' && <Zap className="w-6 h-6" />}
                      {metric.icon === 'ShieldCheck' && <ShieldCheck className="w-6 h-6" />}
                    </div>
                    <div 
                      key={metric.trend}
                      className={`flex items-center gap-1 text-xs font-bold font-mono ${metric.trendDirection === 'up' ? 'text-secondary' : 'text-error'}`}
                    >
                      {metric.trendDirection === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {metric.trend}
                    </div>
                  </div>
                  <h3 className="text-md font-black text-white mb-1">{metric.name}</h3>
                  <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-4">{metric.type}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-black text-white font-mono">{metric.rmse}</span>
                      <span className="text-on-surface-variant text-[8px] font-bold ml-1 uppercase tracking-widest">
                        RMSE
                        <Tooltip content="Root Mean Square Error: A measure of the differences between values predicted by a model and the values observed." className="ml-1" />
                      </span>
                    </div>
                    <div className="w-20 h-8 relative">
                      <div className="absolute inset-0 chart-grid opacity-20" />
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <path 
                          d={`M0,30 Q25,${Math.random() * 30} 50,${Math.random() * 30} T100,${Math.random() * 30}`} 
                          fill="none" 
                          stroke={metric.trendDirection === 'up' ? '#00ff9d' : '#ff4444'} 
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <AIAnalyst 
            title="Market Intelligence"
            context={`Current sentiment is ${sentiment}% bullish. Live predictions show ${predictions[0].signal} on ${predictions[0].pair} with ${predictions[0].conf} confidence.`} 
          />
          
          <div className="bg-surface-container p-6 rounded-3xl border border-outline/30">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={handleExport}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex flex-col items-center gap-2"
              >
                <Download className="w-4 h-4 text-secondary" />
                <span className="text-[8px] font-bold text-white uppercase">Export CSV</span>
              </button>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex flex-col items-center gap-2">
                <Share2 className="w-4 h-4 text-secondary" />
                <span className="text-[8px] font-bold text-white uppercase">Share Feed</span>
              </button>
            </div>
            
            <button 
              onClick={() => setScreen('intelligence')}
              className="w-full p-4 bg-secondary/10 border border-secondary/30 rounded-2xl hover:bg-secondary/20 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-secondary group-hover:rotate-12 transition-transform" />
                <div className="text-left">
                  <span className="block text-[10px] font-black text-white uppercase tracking-widest">Market Narratives</span>
                  <span className="block text-[8px] text-on-surface-variant font-bold uppercase">Explore AI Scenarios</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Predictions Table */}
      <section className="bg-surface-container rounded-3xl border border-outline/30 overflow-hidden">
        <div className="p-6 border-b border-outline/30 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-headline text-white">Live Prediction Stream</h2>
              <p className="text-on-surface-variant text-xs font-medium">Real-time inference output from Transformer-FX</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full border border-secondary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">Live Feed</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Pair</th>
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Signal</th>
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Confidence</th>
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Target</th>
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Time</th>
              </tr>
            </thead>
          <tbody className="relative">
            {predictions.map((row) => (
              <tr 
                key={row.id}
                className="border-t border-outline/10 hover:bg-white/5 transition-colors group"
              >
                <td className="px-8 py-5 font-black text-white text-sm">{row.pair}</td>
                <td className="px-8 py-5">
                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    row.signal === 'Strong Buy' ? 'bg-secondary/10 text-secondary border-secondary/20' : 
                    row.signal === 'Buy' ? 'bg-secondary/5 text-secondary border-secondary/10' :
                    row.signal === 'Strong Sell' ? 'bg-error/10 text-error border-error/20' :
                    row.signal === 'Sell' ? 'bg-error/5 text-error border-error/10' : 'bg-white/5 text-on-surface-variant border-white/10'
                  }`}>
                    {row.signal}
                  </span>
                </td>
                <td className="px-8 py-5 font-mono text-xs text-on-surface-variant group-hover:text-white transition-colors">{row.conf}</td>
                <td className="px-8 py-5 font-mono text-xs text-white font-bold">{row.target}</td>
                <td className="px-8 py-5 text-on-surface-variant text-[10px] font-bold font-mono">{row.time}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
