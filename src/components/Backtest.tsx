import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, TrendingUp, Activity, Calendar, Download, Upload, Database, FileJson, FileSpreadsheet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Tooltip } from './Tooltip';

const datasets = [
  { id: 'eurusd-2023', name: 'EUR/USD 2023 (H1)', type: 'Forex' },
  { id: 'gbpjpy-2023', name: 'GBP/JPY 2023 (H1)', type: 'Forex' },
  { id: 'btcusd-2023', name: 'BTC/USD 2023 (D1)', type: 'Crypto' },
  { id: 'custom', name: 'Custom Upload', type: 'User' },
];

const generateBacktestData = (seed = 10000) => {
  let balance = seed;
  return Array.from({ length: 50 }, (_, i) => {
    const change = (Math.random() - 0.45) * 200;
    balance += change;
    return {
      time: `T-${50 - i}`,
      balance: Math.round(balance),
      drawdown: Math.round(Math.random() * 5),
    };
  });
};

export function Backtest() {
  const [data, setData] = useState(generateBacktestData());
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState(datasets[0].id);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (isRunning && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 100));
        setData(prev => {
          const last = prev[prev.length - 1];
          const change = (Math.random() - 0.42) * 250;
          return [...prev.slice(1), {
            time: `T+${prev.length}`,
            balance: Math.round(last.balance + change),
            drawdown: Math.round(Math.random() * 8),
          }];
        });
      }, 200);
    } else if (progress >= 100) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, progress]);

  const handleStart = () => {
    if (progress >= 100) {
      setProgress(0);
      setData(generateBacktestData());
    }
    setIsRunning(true);
  };

  const handleDatasetChange = (id: string) => {
    setSelectedDataset(id);
    if (id !== 'custom') {
      setData(generateBacktestData());
      setProgress(0);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file parsing
      setTimeout(() => {
        setData(generateBacktestData(15000)); // Simulate different data
        setSelectedDataset('custom');
        setIsUploading(false);
        setProgress(0);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black font-headline text-white tracking-tight">Backtesting Engine</h1>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">Historical performance simulation</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setData(generateBacktestData())}
            className="p-2 bg-surface-container-high border border-outline/30 rounded-xl hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={handleStart}
            disabled={isRunning || isUploading}
            className="px-6 py-2 bg-secondary text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            {progress > 0 && progress < 100 ? `Simulating ${progress}%` : 'Run Simulation'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-headline text-white">Equity Curve</h2>
                <Tooltip content="Visual representation of the account balance over the duration of the backtest." />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Balance ($)</span>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#00ff9d" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black font-headline text-white">Data Management</h2>
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Select or upload historical datasets</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Pre-existing Datasets</label>
                  <Tooltip content="Curated historical data from major exchanges and liquidity providers." />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {datasets.filter(d => d.id !== 'custom').map((dataset) => (
                    <button
                      key={dataset.id}
                      onClick={() => handleDatasetChange(dataset.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        selectedDataset === dataset.id 
                          ? 'bg-secondary/10 border-secondary text-white' 
                          : 'bg-surface-container-high border-outline/10 text-on-surface-variant hover:border-outline/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className={`w-4 h-4 ${selectedDataset === dataset.id ? 'text-secondary' : ''}`} />
                        <span className="text-xs font-bold">{dataset.name}</span>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{dataset.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Custom Data Upload</label>
                  <Tooltip content="Upload your own CSV or JSON files for bespoke strategy validation." />
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`h-[160px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                    isUploading ? 'border-secondary bg-secondary/5' : 'border-outline/30 hover:border-secondary/50 hover:bg-white/5'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept=".csv,.json"
                  />
                  {isUploading ? (
                    <>
                      <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Parsing Data...</span>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-2xl bg-white/5">
                        <Upload className="w-6 h-6 text-on-surface-variant" />
                      </div>
                      <div className="text-center">
                        <span className="block text-xs font-bold text-white">Drop files here or click to upload</span>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Supports CSV, JSON</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="space-y-6">
          <div className="bg-surface-container p-6 rounded-3xl border border-outline/30">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Simulation Stats</h3>
            <div className="space-y-6">
              {[
                { label: 'Total Return', value: '+14.2%', icon: TrendingUp, color: 'text-secondary' },
                { label: 'Max Drawdown', value: '4.8%', icon: Activity, color: 'text-tertiary' },
                { label: 'Win Rate', value: '68.5%', icon: Calendar, color: 'text-secondary' },
                { label: 'Sharpe Ratio', value: '2.42', icon: Activity, color: 'text-white' },
                { label: 'Sortino Ratio', value: '3.15', icon: Activity, color: 'text-white' },
                { label: 'Profit Factor', value: '1.85', icon: Activity, color: 'text-white' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <span className="text-sm font-black text-white font-mono">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container p-6 rounded-3xl border border-outline/30">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Export Results</h3>
            <p className="text-[10px] text-on-surface-variant leading-relaxed mb-6">
              Download the full simulation report including per-trade execution logs and slippage analysis.
            </p>
            <button className="w-full py-3 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <Download className="w-3 h-3" />
              Download CSV
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
