import { useState, useEffect } from 'react';
import { Globe, TrendingUp, TrendingDown, Info, Zap, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { getMarketNarratives } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface Narrative {
  title: string;
  description: string;
  impact: { [key: string]: number };
  probability: number;
  category: string;
}

export function IntelligenceFeed() {
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNarratives = async () => {
    setLoading(true);
    const data = await getMarketNarratives();
    if (data && data.length > 0) {
      setNarratives(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNarratives();
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
              <Globe className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black font-headline text-white tracking-tight">Intelligence <span className="text-secondary">Feed</span></h1>
          </div>
          <p className="text-on-surface-variant text-xs font-medium max-w-md">
            AI-driven macro narratives and technical sentiment overlays synchronized with the global neural network.
          </p>
        </div>
        <button 
          onClick={fetchNarratives}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-outline/30 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 hover:border-secondary/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Recalibrate Stream
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-surface-container rounded-[2.5rem] border border-outline/30 p-8 h-[400px] animate-pulse">
                <div className="w-1/3 h-4 bg-white/5 rounded-full mb-6" />
                <div className="w-full h-8 bg-white/10 rounded-xl mb-4" />
                <div className="w-full h-20 bg-white/5 rounded-2xl mb-8" />
                <div className="space-y-4">
                  <div className="w-full h-10 bg-white/5 rounded-xl text-transparent">Loading...</div>
                  <div className="w-full h-10 bg-white/5 rounded-xl text-transparent">Loading...</div>
                </div>
              </div>
            ))
          ) : (
            narratives.map((narrative, idx) => (
              <motion.div
                key={narrative.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface-container rounded-[2.5rem] border border-outline/30 p-8 flex flex-col relative overflow-hidden group hover:border-secondary/40 transition-colors"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${narrative.probability}%` }}
                    className="h-full bg-secondary shadow-[0_0_15px_rgba(0,255,157,0.5)]"
                  />
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-on-surface-variant uppercase tracking-[0.2em] border border-outline/20">
                    {narrative.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{narrative.probability}%</span>
                    <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest leading-none">Confidence</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white leading-tight mb-4 group-hover:text-secondary transition-colors font-headline">
                  {narrative.title}
                </h3>

                <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium flex-grow mb-8">
                  {narrative.description}
                </p>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    <Zap className="w-3 h-3 text-secondary" />
                    Projected Asset Impact
                  </h4>
                  
                  <div className="space-y-4">
                    {Object.entries(narrative.impact).map(([asset, value]) => (
                      <div key={asset} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">{asset}</span>
                          <div className="flex items-center gap-1.5 ">
                            {value >= 0 ? <TrendingUp className="w-3 h-3 text-secondary" /> : <TrendingDown className="w-3 h-3 text-error" />}
                            <span className={`text-xs font-black font-mono ${value >= 0 ? 'text-secondary' : 'text-error'}`}>
                              {value >= 0 ? '+' : ''}{(value * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.abs(value) * 100}%` }}
                            className={`h-full ${value >= 0 ? 'bg-secondary' : 'bg-error'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-outline/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-on-surface-variant" />
                    <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Verified Risk Node</span>
                  </div>
                  <button className="text-[8px] font-black text-secondary uppercase tracking-widest hover:underline flex items-center gap-1">
                    Detail Report <Info className="w-2.5 h-2.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-high rounded-3xl p-8 border border-outline/30 flex gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Narrative Conflict Warning</h4>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Detected overlapping volatility correlations between "Tech Supremacy" and "Energy Crisis" narratives. Hedge ratios should be adjusted by 15% to maintain delta neutrality.
            </p>
          </div>
        </div>

        <div className="bg-secondary/5 rounded-3xl p-8 border border-secondary/20 flex gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Alpha Signal Synchronized</h4>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Transformer-FX v2.4 has successfully integrated the latest macro narratives. Predictive accuracy for BTC/USD has increased by 1.2% following the recent "Network Regulation" analysis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
