import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Zap, Activity, Clock, Cpu, ArrowUpRight } from 'lucide-react';
import { AppConfig } from '../types';
import { AIAnalyst } from './AIAnalyst';
import { Tooltip } from './Tooltip';

interface EfficiencyProps {
  config: AppConfig;
}

export function Efficiency({ config }: EfficiencyProps) {
  // Simulated data based on config
  const simulatedAccuracy = 94.2 + (config.learningRate > 0.005 ? -1.2 : 0.5);
  const simulatedLatency = 12 + (config.batchSize > 64 ? 5 : -2);

  const accuracyData = [
    { time: '00:00', accuracy: simulatedAccuracy - 2, latency: simulatedLatency + 3 },
    { time: '04:00', accuracy: simulatedAccuracy - 1, latency: simulatedLatency + 1 },
    { time: '08:00', accuracy: simulatedAccuracy - 2.5, latency: simulatedLatency + 6 },
    { time: '12:00', accuracy: simulatedAccuracy, latency: simulatedLatency },
    { time: '16:00', accuracy: simulatedAccuracy + 0.9, latency: simulatedLatency - 2 },
    { time: '20:00', accuracy: simulatedAccuracy + 0.6, latency: simulatedLatency + 1 },
    { time: '23:59', accuracy: simulatedAccuracy + 1.3, latency: simulatedLatency - 1 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Project Context Banner */}
      <section className="bg-secondary/5 border border-secondary/20 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-24 h-24 text-secondary" />
        </div>
        <div className="relative z-10">
          <h2 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-2">Project Analysis</h2>
          <h1 className="text-2xl font-black font-headline text-white mb-4">Computational Efficiency Analysis of ML Models</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-secondary mt-1.5" />
              <p className="text-[10px] text-on-surface-variant font-medium">Developed and evaluated multiple ML models for time-series forecasting</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-secondary mt-1.5" />
              <p className="text-[10px] text-on-surface-variant font-medium">Compared model accuracy, training time, and computational resource usage</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-secondary mt-1.5" />
              <p className="text-[10px] text-on-surface-variant font-medium">Identified trade-offs between model complexity and efficiency</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-secondary mt-1.5" />
              <p className="text-[10px] text-on-surface-variant font-medium">Stack: Python, scikit-learn, NumPy, Pandas</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-black font-headline text-white tracking-tight">Performance Metrics</h2>
              <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">Real-time model evaluation</p>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-surface-container-high rounded-lg border border-outline/30 text-[10px] font-bold text-white">
                Last 24h
              </div>
              <div className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg border border-secondary/20 text-[10px] font-bold">
                Live
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container p-6 rounded-3xl border border-outline/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Avg Accuracy</span>
                  <Tooltip content="The mean percentage of correct predictions over the evaluation period." />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">{simulatedAccuracy.toFixed(1)}%</span>
                <span className="text-secondary text-xs font-bold">+0.8%</span>
              </div>
            </div>
            
            <div className="bg-surface-container p-6 rounded-3xl border border-outline/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-tertiary/10 text-tertiary">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Inference Time</span>
                  <Tooltip content="The time taken by the model to process a single input and generate a prediction." />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">{simulatedLatency.toFixed(0)}ms</span>
                <span className="text-secondary text-xs font-bold">-2ms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <AIAnalyst 
            title="Efficiency Report"
            context={`Model accuracy is ${simulatedAccuracy.toFixed(1)}% with ${simulatedLatency.toFixed(0)}ms latency. Learning rate is ${config.learningRate} and batch size is ${config.batchSize}.`} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
          <h2 className="text-lg font-black font-headline text-white mb-6">Accuracy vs. Time</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#00ff9d' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#00ff9d" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
          <h2 className="text-lg font-black font-headline text-white mb-6">Latency Distribution</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyData}>
                <defs>
                  <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffaa00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#ffaa00' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#ffaa00" fillOpacity={1} fill="url(#colorLat)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="bg-surface-container rounded-3xl border border-outline/30 overflow-hidden">
        <div className="p-6 border-b border-outline/30">
          <h2 className="text-lg font-black font-headline text-white">Active Training Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  Epoch
                  <Tooltip content="One complete pass of the entire training dataset through the neural network." className="ml-1" />
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  Loss
                  <Tooltip content="A numerical value representing the difference between the model's prediction and the actual target." className="ml-1" />
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Val Accuracy</th>
                <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { epoch: `${config.epochs}/${config.epochs * 2}`, loss: '0.0024', val: `${simulatedAccuracy.toFixed(1)}%`, status: 'In Progress' },
                { epoch: `${config.epochs - 1}/${config.epochs * 2}`, loss: '0.0025', val: `${(simulatedAccuracy - 0.1).toFixed(1)}%`, status: 'Completed' },
                { epoch: `${config.epochs - 2}/${config.epochs * 2}`, loss: '0.0027', val: `${(simulatedAccuracy - 0.4).toFixed(1)}%`, status: 'Completed' },
              ].map((row, i) => (
                <tr key={i} className="border-t border-outline/10 hover:bg-white/5 transition-colors">
                  <td className="px-8 py-4 font-mono text-xs text-white">{row.epoch}</td>
                  <td className="px-8 py-4 font-mono text-xs text-on-surface-variant">{row.loss}</td>
                  <td className="px-8 py-4 font-mono text-xs text-secondary font-bold">{row.val}</td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${row.status === 'In Progress' ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-on-surface-variant'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
