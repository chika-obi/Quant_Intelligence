import { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getAIAnalystInsight } from '../services/geminiService';

interface AIAnalystProps {
  context: string;
  title?: string;
}

export function AIAnalyst({ context, title = "AI Analyst Insight" }: AIAnalystProps) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const lastFetchRef = useRef<number>(0);

  const fetchInsight = async (force = false) => {
    const now = Date.now();
    // Throttle: only fetch if forced or if 300 seconds (5 mins) have passed
    if (!force && now - lastFetchRef.current < 300000) return;
    
    setLoading(true);
    const result = await getAIAnalystInsight(context);
    setInsight(result);
    setLoading(false);
    lastFetchRef.current = now;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInsight();
    }, 2000); // 2 second debounce
    return () => clearTimeout(timer);
  }, [context]);

  // Initial fetch on mount is covered by the effect above since context is provided

  return (
    <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{title}</span>
        </div>
        <button 
          onClick={() => fetchInsight(true)}
          disabled={loading}
          className="p-1 hover:bg-secondary/10 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 text-secondary ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="min-h-[40px]">
        {loading ? (
          <div className="space-y-2">
            <div className="h-2 bg-secondary/10 rounded animate-pulse w-full" />
            <div className="h-2 bg-secondary/10 rounded animate-pulse w-3/4" />
          </div>
        ) : (
          <p 
            className="text-[11px] text-on-surface-variant font-medium leading-relaxed italic"
          >
            "{insight}"
          </p>
        )}
      </div>
    </div>
  );
}
