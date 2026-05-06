import { useState } from 'react';
import { BookOpen, FileText, BarChart3, Share2, Download, CheckCircle2, Info, BrainCircuit, Microscope, Zap } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { getAIAnalystInsight } from '../services/geminiService';

export function Methodology() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<'how' | 'build' | null>(null);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const insight = await getAIAnalystInsight(
        "Generate a formal research summary for a project titled 'Computational Efficiency Analysis of ML Models for Forex Prediction'. Include an Abstract, Methodology, and Conclusion based on the current context of high-volatility market analysis and Transformer-FX model performance."
      );
      setReport(insight);
    } catch (error) {
      console.error("Failed to generate report", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-outline/10 pb-6 gap-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-white tracking-tight">Research & <span className="text-secondary">Documentation</span></h1>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-[0.3em] mt-2">Academic Framework & Technical Roadmap</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setActiveGuide('how')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeGuide === 'how' ? 'bg-secondary text-black border-secondary' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
          >
            <Info className="w-4 h-4" />
            How it Works
          </button>
          <button 
            onClick={() => setActiveGuide('build')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeGuide === 'build' ? 'bg-tertiary text-black border-tertiary' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
          >
            <Zap className="w-4 h-4" />
            Build from Scratch
          </button>
          <button 
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {isGenerating ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FileText className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'AI Summary'}
          </button>
        </div>
      </div>

      {/* Conditional Guide Overlays */}
      {activeGuide === 'how' && (
        <section className="bg-secondary/10 border border-secondary/30 p-8 rounded-3xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary text-black">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black font-headline text-white uppercase tracking-tight">How Quant Edge Works</h2>
            </div>
            <button onClick={() => setActiveGuide(null)} className="p-2 hover:bg-white/10 rounded-full text-white">
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black text-secondary uppercase tracking-widest">1. Data Ingestion</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The system connects to institutional liquidity providers and crypto exchanges via high-speed WebSockets, ingesting millions of ticks per second.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-black text-secondary uppercase tracking-widest">2. Feature Engineering</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Raw price data is transformed into multi-dimensional tensors, calculating technical indicators (RSI, EMA, ATR) and order flow imbalances in real-time.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black text-secondary uppercase tracking-widest">3. Neural Inference</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Our Transformer-FX model processes the sequence data using multi-head attention to identify non-linear patterns and predict price direction with a confidence score.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-black text-secondary uppercase tracking-widest">4. Strategy Execution</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Validated signals are passed to the execution engine, which manages risk, calculates position sizing, and routes orders to the simulation or live exchange.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeGuide === 'build' && (
        <section className="bg-tertiary/10 border border-tertiary/30 p-8 rounded-3xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-tertiary text-black">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black font-headline text-white uppercase tracking-tight">Build from Scratch Guide</h2>
            </div>
            <button onClick={() => setActiveGuide(null)} className="p-2 hover:bg-white/10 rounded-full text-white">
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black text-tertiary uppercase tracking-widest block mb-2">Phase 1</span>
                <h4 className="text-xs font-bold text-white mb-2">Environment Setup</h4>
                <ul className="text-[10px] text-on-surface-variant space-y-2 list-disc pl-4">
                  <li>Install Node.js & TypeScript</li>
                  <li>Initialize React with Vite</li>
                  <li>Setup Tailwind CSS & Lucide Icons</li>
                  <li>Configure Firebase for Auth/DB</li>
                </ul>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black text-tertiary uppercase tracking-widest block mb-2">Phase 2</span>
                <h4 className="text-xs font-bold text-white mb-2">Core Engine</h4>
                <ul className="text-[10px] text-on-surface-variant space-y-2 list-disc pl-4">
                  <li>Build WebSocket data connectors</li>
                  <li>Implement D3.js for live charting</li>
                  <li>Develop the simulation state engine</li>
                  <li>Integrate Gemini API for AI insights</li>
                </ul>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black text-tertiary uppercase tracking-widest block mb-2">Phase 3</span>
                <h4 className="text-xs font-bold text-white mb-2">Logic & UI</h4>
                <ul className="text-[10px] text-on-surface-variant space-y-2 list-disc pl-4">
                  <li>Design the Strategy Builder UI</li>
                  <li>Implement PnL calculation logic</li>
                  <li>Add responsive sidebar navigation</li>
                  <li>Deploy to Cloud Run / Vercel</li>
                </ul>
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
              <Download className="w-8 h-8 text-tertiary opacity-50" />
              <div>
                <h4 className="text-xs font-bold text-white">Technical Documentation PDF</h4>
                <p className="text-[10px] text-on-surface-variant">Download the full 45-page implementation guide including source code snippets.</p>
              </div>
              <button className="ml-auto px-4 py-2 bg-tertiary text-black rounded-lg text-[10px] font-black uppercase tracking-widest">Download</button>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Abstract Section */}
          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <BookOpen className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                  <Microscope className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black font-headline text-white">Abstract</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed font-medium mb-4">
                This research explores the intersection of deep learning architectures and computational efficiency in the context of high-frequency foreign exchange (Forex) market prediction. We evaluate the performance of Transformer-based models (Transformer-FX) against traditional Recurrent Neural Networks (LSTM, GRU) to identify the optimal balance between predictive accuracy and inference latency.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Deep Learning', 'Forex Forecasting', 'Computational Efficiency', 'Transformer Architecture'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-on-surface-variant">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Technical Architecture */}
          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-tertiary/10 text-tertiary">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black font-headline text-white">Model Architecture: Transformer-FX</h2>
            </div>
            
            <div className="bg-surface-container-high rounded-2xl p-8 border border-outline/10 flex flex-col items-center">
              {/* Simplified SVG Architecture Diagram */}
              <svg viewBox="0 0 400 200" className="w-full max-w-md">
                <rect x="10" y="70" width="60" height="60" rx="8" fill="none" stroke="#666" strokeWidth="2" />
                <text x="40" y="105" textAnchor="middle" fill="#666" fontSize="10" fontWeight="bold">INPUT</text>
                
                <line x1="70" y1="100" x2="110" y2="100" stroke="#00ff9d" strokeWidth="2" markerEnd="url(#arrow)" />
                
                <rect x="110" y="50" width="100" height="100" rx="12" fill="rgba(0,255,157,0.1)" stroke="#00ff9d" strokeWidth="2" />
                <text x="160" y="95" textAnchor="middle" fill="#00ff9d" fontSize="12" fontWeight="black">ENCODER</text>
                <text x="160" y="115" textAnchor="middle" fill="#00ff9d" fontSize="8" fontWeight="bold">Multi-Head Attention</text>

                <line x1="210" y1="100" x2="250" y2="100" stroke="#00ff9d" strokeWidth="2" />

                <rect x="250" y="50" width="100" height="100" rx="12" fill="rgba(255,170,0,0.1)" stroke="#ffaa00" strokeWidth="2" />
                <text x="300" y="95" textAnchor="middle" fill="#ffaa00" fontSize="12" fontWeight="black">DECODER</text>
                <text x="300" y="115" textAnchor="middle" fill="#ffaa00" fontSize="8" fontWeight="bold">Linear + Softmax</text>

                <line x1="350" y1="100" x2="390" y2="100" stroke="#ffaa00" strokeWidth="2" />
                <circle cx="390" cy="100" r="5" fill="#ffaa00" />
                
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#00ff9d" />
                  </marker>
                </defs>
              </svg>
              <div className="grid grid-cols-3 gap-8 w-full mt-8 pt-8 border-t border-outline/10">
                <div className="text-center">
                  <span className="block text-[10px] font-black text-on-surface-variant uppercase mb-1">Attention Heads</span>
                  <span className="text-lg font-black text-white">12</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-black text-on-surface-variant uppercase mb-1">Hidden Layers</span>
                  <span className="text-lg font-black text-white">8</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-black text-on-surface-variant uppercase mb-1">Parameters</span>
                  <span className="text-lg font-black text-white">4.2M</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI Generated Report */}
          {report && (
            <section 
              className="bg-white p-10 rounded-3xl border border-outline/30 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 border-b border-black/10 pb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-black" />
                  <h2 className="text-xl font-black font-headline text-black uppercase tracking-tight">Research Summary Report</h2>
                </div>
                <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-black" />
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-black font-serif leading-relaxed">
                {report.split('\n').map((line, i) => (
                  <p key={i} className="mb-4">{line}</p>
                ))}
              </div>
              <div className="mt-10 pt-6 border-t border-black/10 flex justify-between items-center">
                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Generated by Quant Edge AI Analyst</span>
                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {/* Research Goals */}
          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Research Objectives</h3>
            <div className="space-y-4">
              {[
                "Minimize RMSE in high-volatility regimes",
                "Reduce inference latency below 15ms",
                "Evaluate multi-head attention effectiveness",
                "Optimize resource allocation for edge nodes"
              ].map((goal, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5" />
                  <span className="text-xs text-on-surface-variant font-medium leading-relaxed">{goal}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Statistical Rigor */}
          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Statistical Summary</h3>
              <Tooltip content="Key performance indicators used to validate the statistical significance of the research findings." />
            </div>
            <div className="space-y-4">
              {[
                { label: 'Sharpe Ratio', value: '2.42', info: 'Risk-adjusted return' },
                { label: 'Sortino Ratio', value: '3.15', info: 'Downside risk-adjusted return' },
                { label: 'Max Drawdown', value: '4.2%', info: 'Peak-to-trough decline' },
                { label: 'Information Ratio', value: '1.88', info: 'Consistency of returns' },
                { label: 'P-Value', value: '< 0.001', info: 'Statistical significance' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-outline/10 last:border-0">
                  <div>
                    <span className="block text-[10px] font-bold text-white uppercase tracking-widest">{stat.label}</span>
                    <span className="text-[8px] text-on-surface-variant">{stat.info}</span>
                  </div>
                  <span className="text-xs font-black text-secondary font-mono">{stat.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Citation Section */}
          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Citations</h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-on-surface-variant italic leading-relaxed">
                "Attention Is All You Need" - Vaswani et al. (2017). Advances in Neural Information Processing Systems.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
