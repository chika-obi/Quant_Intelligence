import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'];

interface MarketChartProps {
  pair?: string;
  height?: number;
}

export function MarketChart({ pair = 'EUR/USD', height: containerHeight = 400 }: MarketChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [timeframe, setTimeframe] = useState('1m');

  // Initial data generation
  useEffect(() => {
    const initialData: DataPoint[] = [];
    let currentPrice = pair.includes('JPY') ? 151.40 : pair.includes('BTC') ? 64200 : 1.0850;
    const now = new Date();
    
    // Determine interval in minutes
    let intervalMinutes = 1;
    if (timeframe === '5m') intervalMinutes = 5;
    else if (timeframe === '15m') intervalMinutes = 15;
    else if (timeframe === '30m') intervalMinutes = 30;
    else if (timeframe === '1h') intervalMinutes = 60;
    else if (timeframe === '4h') intervalMinutes = 240;
    else if (timeframe === '1d') intervalMinutes = 1440;
    else if (timeframe === '1w') intervalMinutes = 10080;
    else if (timeframe === '1M') intervalMinutes = 43200;

    const volatility = pair.includes('BTC') ? 100 : pair.includes('JPY') ? 0.1 : 0.0020;

    for (let i = 0; i < 60; i++) {
      const open = currentPrice;
      const close = open + (Math.random() - 0.5) * volatility * (intervalMinutes ** 0.5);
      const high = Math.max(open, close) + Math.random() * volatility * 0.2;
      const low = Math.min(open, close) - Math.random() * volatility * 0.2;
      initialData.push({
        date: new Date(now.getTime() - (60 - i) * intervalMinutes * 60000),
        open,
        high,
        low,
        close
      });
      currentPrice = close;
    }
    setData(initialData);
  }, [pair, timeframe]);

  // Real-time updates
  useEffect(() => {
    const intervalMinutes = timeframe === '1m' ? 1 : 
                           timeframe === '5m' ? 5 : 
                           timeframe === '15m' ? 15 : 
                           timeframe === '30m' ? 30 : 
                           timeframe === '1h' ? 60 : 
                           timeframe === '4h' ? 240 : 
                           timeframe === '1d' ? 1440 : 
                           timeframe === '1w' ? 10080 : 43200;

    const interval = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const open = last.close;
        const volatility = pair.includes('BTC') ? 20 : pair.includes('JPY') ? 0.02 : 0.0005;
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * volatility * 0.1;
        const low = Math.min(open, close) - Math.random() * volatility * 0.1;
        const next = {
          date: new Date(last.date.getTime() + intervalMinutes * 60000),
          open,
          high,
          low,
          close
        };
        return [...prev.slice(1), next];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [pair, timeframe]);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const margin = { top: 20, right: 60, bottom: 30, left: 10 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    d3.select(containerRef.current).selectAll("*").remove();

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.date.toISOString()))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([
        (d3.min(data, (d: DataPoint) => d.low) ?? 0) * 0.9995,
        (d3.max(data, (d: DataPoint) => d.high) ?? 0) * 1.0005
      ])
      .range([height, 0]);

    // Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.05)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""));

    // Axes
    const xAxis = d3.axisBottom(x)
      .tickValues(x.domain().filter((_, i) => !(i % 10)))
      .tickFormat(d => {
        const date = new Date(d);
        if (timeframe.includes('d') || timeframe.includes('w') || timeframe.includes('M')) {
          return d3.timeFormat("%b %d")(date);
        }
        return d3.timeFormat("%H:%M")(date);
      });

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "text-[10px] text-on-surface-variant")
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "#888");

    svg.append("g")
      .attr("transform", `translate(${width},0)`)
      .attr("class", "text-[10px] text-on-surface-variant")
      .call(d3.axisRight(y).ticks(8).tickFormat(d3.format(pair.includes('JPY') ? ".2f" : pair.includes('BTC') ? ".0f" : ".4f")))
      .selectAll("text")
      .attr("fill", "#888");

    // Wicks
    svg.selectAll(".wick")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (d: DataPoint) => x(d.date.toISOString())! + x.bandwidth() / 2)
      .attr("x2", (d: DataPoint) => x(d.date.toISOString())! + x.bandwidth() / 2)
      .attr("y1", (d: DataPoint) => y(d.high))
      .attr("y2", (d: DataPoint) => y(d.low))
      .attr("stroke", (d: DataPoint) => d.close > d.open ? "#00ff9d" : "#ff4444")
      .attr("stroke-width", 1);

    // Bodies
    svg.selectAll(".body")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: DataPoint) => x(d.date.toISOString())!)
      .attr("y", (d: DataPoint) => y(Math.max(d.open, d.close)))
      .attr("width", x.bandwidth())
      .attr("height", (d: DataPoint) => Math.max(1, Math.abs(y(d.open) - y(d.close))))
      .attr("fill", (d: DataPoint) => d.close > d.open ? "#00ff9d" : "#ff4444")
      .attr("rx", 1);

    // Current Price Line
    const lastPoint = data[data.length - 1];
    svg.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(lastPoint.close))
      .attr("y2", y(lastPoint.close))
      .attr("stroke", "#00ff9d")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.5);

  }, [data, pair, timeframe, containerHeight]);

  const last = data[data.length - 1] || { open: 0, high: 0, low: 0, close: 0 };

  return (
    <div className="w-full bg-surface-container rounded-3xl border border-outline/30 p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            {pair} 
            <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] uppercase tracking-widest">{timeframe}</span>
          </h3>
          <div className="flex gap-4 mt-1">
            <span className="text-[10px] font-mono text-on-surface-variant">O: <span className="text-white">{last.open.toFixed(4)}</span></span>
            <span className="text-[10px] font-mono text-on-surface-variant">H: <span className="text-secondary">{last.high.toFixed(4)}</span></span>
            <span className="text-[10px] font-mono text-on-surface-variant">L: <span className="text-error">{last.low.toFixed(4)}</span></span>
            <span className="text-[10px] font-mono text-on-surface-variant">C: <span className="text-white">{last.close.toFixed(4)}</span></span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {TIMEFRAMES.map(t => (
            <button 
              key={t} 
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                t === timeframe 
                  ? 'bg-secondary text-black shadow-lg shadow-secondary/20' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="w-full" style={{ height: containerHeight - 80 }} />
    </div>
  );
}
