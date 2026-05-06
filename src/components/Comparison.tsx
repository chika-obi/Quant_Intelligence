import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { Activity, ShieldCheck, Zap, TrendingUp, Cpu, Layers } from 'lucide-react';
import { AppConfig } from '../types';
import { Tooltip } from './Tooltip';

interface ComparisonProps {
  config: AppConfig;
}

export function Comparison({ config }: ComparisonProps) {
  const comparisonData = [
    { subject: 'Accuracy', A: 120 + (config.learningRate > 0.005 ? -10 : 5), B: 110, fullMark: 150 },
    { subject: 'Latency', A: 98 + (config.batchSize > 64 ? 20 : -5), B: 130, fullMark: 150 },
    { subject: 'Stability', A: 86, B: 130, fullMark: 150 },
    { subject: 'Compute', A: 99 + (config.batchSize > 64 ? 15 : 0), B: 100, fullMark: 150 },
    { subject: 'Scalability', A: 85, B: 90, fullMark: 150 },
    { subject: 'Security', A: 65, B: 85, fullMark: 150 },
  ];

  const tradeOffData = [
    { name: 'Linear Regression', complexity: 10, efficiency: 95, accuracy: 65 },
    { name: 'Random Forest', complexity: 45, efficiency: 80, accuracy: 82 },
    { name: 'XGBoost', complexity: 60, efficiency: 70, accuracy: 88 },
    { name: 'LSTM', complexity: 85, efficiency: 40, accuracy: 92 },
    { name: 'Transformer', complexity: 95, efficiency: 30, accuracy: 95 },
  ];
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-white tracking-tight">Model Comparison</h1>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">Benchmarking core intelligence units</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-secondary transition-colors">
            Export Matrix
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-surface-container p-8 rounded-3xl border border-outline/30">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-black font-headline text-white">Feature Analysis Radar</h2>
            <Tooltip content="Comparative visualization of model capabilities across six key performance dimensions." />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" stroke="#666" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#333" tick={false} axisLine={false} />
                <Radar name="Transformer-FX" dataKey="A" stroke="#00ff9d" fill="#00ff9d" fillOpacity={0.4} />
                <Radar name="LSTM-X1" dataKey="B" stroke="#ffaa00" fill="#ffaa00" fillOpacity={0.4} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
          <h2 className="text-lg font-black font-headline text-white mb-6">Capability Matrix</h2>
          <div className="space-y-6">
            {[
              { label: 'Real-time Inference', value: 98, color: 'bg-secondary' },
              { label: 'Pattern Recognition', value: 92, color: 'bg-secondary' },
              { label: 'Backtesting Fidelity', value: 85, color: 'bg-tertiary' },
              { label: 'Resource Efficiency', value: 74, color: 'bg-tertiary' },
              { label: 'Anomaly Detection', value: 95, color: 'bg-secondary' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{item.label}</span>
                  <span className="text-[10px] font-black text-white font-mono">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${item.value}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-2xl bg-surface-container-high border border-outline/30">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Audit Result</span>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Transformer-FX shows 14% higher precision in high-volatility environments compared to LSTM-X1.
            </p>
          </div>
        </section>
      </div>

      {/* Complexity vs Efficiency Trade-off */}
      <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black font-headline text-white">Complexity vs. Efficiency Trade-off</h2>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Identifying optimal model architecture</p>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis type="number" dataKey="complexity" name="Complexity" unit="%" stroke="#666" fontSize={10} />
              <YAxis type="number" dataKey="efficiency" name="Efficiency" unit="%" stroke="#666" fontSize={10} />
              <ZAxis type="number" dataKey="accuracy" range={[50, 400]} name="Accuracy" unit="%" />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
              />
              <Scatter name="Models" data={tradeOffData} fill="#00ff9d" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-4 rounded-2xl bg-surface-container-high border border-outline/10">
            <span className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Observation</span>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Higher complexity models (Transformers) yield superior accuracy but suffer from significantly lower computational efficiency.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-high border border-outline/10">
            <span className="block text-[10px] font-black text-tertiary uppercase tracking-widest mb-2">Optimization</span>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              XGBoost provides the best "Efficiency-to-Accuracy" ratio for mid-tier latency requirements.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-high border border-outline/10">
            <span className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">Conclusion</span>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Model selection should be driven by specific hardware constraints and real-time inference windows.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
