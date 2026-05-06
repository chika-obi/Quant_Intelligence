import { useState, useMemo } from 'react';
import { 
  Zap, Plus, Play, Save, Trash2, ChevronRight, Settings2, 
  Activity, ArrowRight, Code, Layers, MousePointer2, 
  Info, Sparkles, Database, BarChart3, AlertCircle,
  Clock, Filter, Cpu
} from 'lucide-react';

type BlockType = 'trigger' | 'condition' | 'action' | 'filter';

interface StrategyBlock {
  id: string;
  type: BlockType;
  label: string;
  description: string;
  params: Record<string, any>;
}

const BLOCK_METADATA: Record<BlockType, { color: string; icon: any; bg: string }> = {
  trigger: { 
    color: 'text-secondary', 
    bg: 'bg-secondary/10', 
    icon: Zap 
  },
  condition: { 
    color: 'text-tertiary', 
    bg: 'bg-tertiary/10', 
    icon: Filter 
  },
  filter: { 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/10', 
    icon: Cpu 
  },
  action: { 
    color: 'text-white', 
    bg: 'bg-white/10', 
    icon: Play 
  },
};

const AVAILABLE_BLOCKS = [
  { type: 'trigger', label: 'Price Crossing', description: 'Triggers when price crosses an indicator or level.', icon: Activity },
  { type: 'trigger', label: 'Volume Spike', description: 'Triggers on unusual volume activity.', icon: BarChart3 },
  { type: 'condition', label: 'RSI Threshold', description: 'Check if RSI is overbought or oversold.', icon: Filter },
  { type: 'condition', label: 'MA Alignment', description: 'Verify if short-term MA is above long-term MA.', icon: Layers },
  { type: 'filter', label: 'Time Filter', description: 'Restrict strategy to specific market sessions.', icon: Clock },
  { type: 'filter', label: 'Volatility Filter', description: 'Only execute during specific ATR ranges.', icon: Sparkles },
  { type: 'action', label: 'Market Order', description: 'Execute immediate buy or sell order.', icon: Play },
  { type: 'action', label: 'Limit Order', description: 'Place order at specific price level.', icon: Database },
];

const STRATEGY_TEMPLATES = [
  {
    name: 'EMA Cross Buy',
    description: 'Classic trend-following entries using slow EMA crossover.',
    blocks: [
      { type: 'trigger', label: 'EMA Cross', description: 'Price crosses EMA 200', params: { period: 200, type: 'EMA' } },
      { type: 'action', label: 'Market Buy', description: 'Execute long position', params: { size: '1.0 Lot' } }
    ]
  },
  {
    name: 'RSI Reversal',
    description: 'Mean reversion strategy for overextended markets.',
    blocks: [
      { type: 'trigger', label: 'Price Action', description: 'Wait for price movement', params: {} },
      { type: 'condition', label: 'RSI Oversold', description: 'RSI < 30', params: { period: 14, threshold: 30, operator: '<' } },
      { type: 'action', label: 'Market Buy', description: 'Execute long position', params: { size: '0.5 Lot' } }
    ]
  },
  {
    name: 'Volatility Breakout',
    description: 'High-momentum breakout strategy during peak liquidity.',
    blocks: [
      { type: 'trigger', label: 'Volume Spike', description: 'Volume > 2x Avg', params: { multiplier: 2 } },
      { type: 'filter', label: 'NY Session', description: 'Restrict to NY overlap', params: { session: 'New York' } },
      { type: 'condition', label: 'Strong Trend', description: 'MA 50 > MA 200', params: { fast: 50, slow: 200 } },
      { type: 'action', label: 'Limit Order', description: 'Place bid at level', params: { size: '2.0 Lot' } }
    ]
  }
];

export function StrategyBuilder() {
  const [blocks, setBlocks] = useState<StrategyBlock[]>([
    { 
      id: '1', 
      type: 'trigger', 
      label: 'EMA Cross', 
      description: 'Price crosses EMA 200',
      params: { period: 200, type: 'EMA' } 
    },
    { 
      id: '2', 
      type: 'condition', 
      label: 'RSI Oversold', 
      description: 'RSI < 30',
      params: { period: 14, threshold: 30, operator: '<' } 
    },
    { 
      id: '3', 
      type: 'action', 
      label: 'Market Buy', 
      description: 'Execute long position',
      params: { size: '1.0 Lot' } 
    }
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = useMemo(() => 
    blocks.find(b => b.id === selectedBlockId), 
  [blocks, selectedBlockId]);

  const addBlock = (block: typeof AVAILABLE_BLOCKS[0]) => {
    const newBlock: StrategyBlock = {
      id: Math.random().toString(36).substring(7),
      type: block.type as BlockType,
      label: block.label,
      description: block.description,
      params: {}
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const loadTemplate = (template: typeof STRATEGY_TEMPLATES[0]) => {
    const newBlocks: StrategyBlock[] = template.blocks.map((b, i) => ({
      id: (Date.now() + i).toString(),
      type: b.type as BlockType,
      label: b.label,
      description: b.description,
      params: { ...b.params }
    }));
    setBlocks(newBlocks);
    setSelectedBlockId(null);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const updateParam = (blockId: string, key: string, value: any) => {
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, params: { ...b.params, [key]: value } } : b
    ));
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">Alpha v2.0</span>
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> No-Code Engine
            </span>
          </div>
          <h1 className="text-3xl font-black font-headline text-white tracking-tight">Strategy <span className="text-secondary">Builder</span></h1>
          <p className="text-on-surface-variant text-xs mt-2">Architect sophisticated algorithmic logic using modular visual blocks.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Strategy
          </button>
          <button className="px-5 py-2.5 bg-secondary text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary-fixed-dim transition-all shadow-lg shadow-secondary/20 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Backtest Flow
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Block Library */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-container rounded-3xl border border-outline/30 p-6">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Block Library
            </h3>
            <div className="space-y-3">
              {AVAILABLE_BLOCKS.map((b) => {
                const meta = BLOCK_METADATA[b.type as BlockType];
                return (
                  <button 
                    key={b.label} 
                    onClick={() => addBlock(b)}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-secondary/30 hover:bg-white/10 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-xl ${meta.bg} ${meta.color}`}>
                        <b.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">{b.label}</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed line-clamp-2">
                      {b.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-container rounded-3xl border border-outline/30 p-6">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tertiary" />
              Strategy Templates
            </h3>
            <div className="space-y-4">
              {STRATEGY_TEMPLATES.map((template) => (
                <div 
                  key={template.name}
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-tertiary/30 hover:bg-white/10 transition-all group cursor-default"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-bold text-white">{template.name}</h4>
                    <button 
                      onClick={() => loadTemplate(template)}
                      className="px-2 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-tertiary hover:text-black transition-all"
                    >
                      Load
                    </button>
                  </div>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    {template.description}
                  </p>
                  <div className="mt-3 flex gap-1">
                    {template.blocks.map((b, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-3xl">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-secondary" />
              <h4 className="text-[10px] font-black text-secondary uppercase">Builder Guide</h4>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Strategies execute from top to bottom. Triggers start the flow, Conditions and Filters validate the signal, and Actions execute the trade.
            </p>
          </div>
        </div>

        {/* Center: Builder Canvas */}
        <div className="lg:col-span-6 bg-surface-container rounded-3xl border border-outline/30 p-8 min-h-[700px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            {blocks.length === 0 ? (
              <div className="mt-32 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                  <MousePointer2 className="w-8 h-8 text-on-surface-variant opacity-20" />
                </div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Canvas is empty</p>
                <p className="text-[10px] text-on-surface-variant/60">Select a block from the library to begin</p>
              </div>
            ) : (
              blocks.map((block, i) => {
                const meta = BLOCK_METADATA[block.type];
                const isSelected = selectedBlockId === block.id;
                
                return (
                  <div key={block.id} className="flex flex-col items-center gap-6 w-full">
                    <div 
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`w-full max-w-sm p-5 rounded-2xl border-2 transition-all cursor-pointer group relative ${
                        isSelected 
                          ? 'bg-surface-container-highest border-secondary shadow-[0_0_30px_rgba(0,255,157,0.1)]' 
                          : 'bg-surface-container border-outline/30 hover:border-white/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${meta.bg} ${meta.color}`}>
                            <meta.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${meta.color}`}>{block.type}</span>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">{block.label}</h4>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(block.params).map(([key, val]) => (
                          <span key={key} className="px-2 py-1 rounded-md bg-white/5 text-[9px] font-mono text-on-surface-variant border border-white/5">
                            {key}: {val}
                          </span>
                        ))}
                        {Object.keys(block.params).length === 0 && (
                          <span className="text-[9px] text-on-surface-variant/40 italic">No parameters configured</span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-full" />
                      )}
                    </div>
                    
                    {i < blocks.length - 1 && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-0.5 h-8 bg-outline/30" />
                        <ChevronRight className="w-4 h-4 text-outline/30 rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {blocks.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Flow Validated</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Block Settings */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-container rounded-3xl border border-outline/30 p-6 sticky top-24">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Block Settings
            </h3>

            {selectedBlock ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{selectedBlock.label}</h4>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">{selectedBlock.description}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-outline/10">
                  {selectedBlock.type === 'trigger' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Indicator Type</label>
                        <select 
                          value={selectedBlock.params.type || 'EMA'}
                          onChange={(e) => updateParam(selectedBlock.id, 'type', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-secondary/50"
                        >
                          <option value="EMA">EMA</option>
                          <option value="SMA">SMA</option>
                          <option value="WMA">WMA</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Period ({selectedBlock.params.period || 200})</label>
                        <input 
                          type="range" 
                          min="1" 
                          max="500" 
                          value={selectedBlock.params.period || 200}
                          onChange={(e) => updateParam(selectedBlock.id, 'period', parseInt(e.target.value))}
                          className="w-full accent-secondary" 
                        />
                      </div>
                    </>
                  )}

                  {selectedBlock.type === 'condition' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Threshold ({selectedBlock.params.threshold || 30})</label>
                        <input 
                          type="number" 
                          value={selectedBlock.params.threshold || 30}
                          onChange={(e) => updateParam(selectedBlock.id, 'threshold', parseInt(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Operator</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['<', '>', '=='].map(op => (
                            <button 
                              key={op}
                              onClick={() => updateParam(selectedBlock.id, 'operator', op)}
                              className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                                selectedBlock.params.operator === op 
                                  ? 'bg-secondary text-black border-secondary' 
                                  : 'bg-white/5 text-white border-white/10'
                              }`}
                            >
                              {op}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedBlock.type === 'action' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Position Size</label>
                      <input 
                        type="text" 
                        value={selectedBlock.params.size || '1.0 Lot'}
                        onChange={(e) => updateParam(selectedBlock.id, 'size', e.target.value)}
                        placeholder="e.g. 1.0 Lot"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-secondary/50"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Code className="w-4 h-4" />
                    View Generated Code
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                  <AlertCircle className="w-6 h-6 text-on-surface-variant opacity-20" />
                </div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">No Block Selected</p>
                <p className="text-[10px] text-on-surface-variant/60">Click a block on the canvas to configure its parameters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
