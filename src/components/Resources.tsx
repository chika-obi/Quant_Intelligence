import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Cpu, Database, Network, HardDrive, ShieldCheck, Activity } from 'lucide-react';

const distributionData = [
  { name: 'Compute', value: 45, color: '#00ff9d' },
  { name: 'Storage', value: 25, color: '#ffaa00' },
  { name: 'Network', value: 20, color: '#ffffff' },
  { name: 'Security', value: 10, color: '#ff4444' },
];

const nodeLoadData = [
  { node: 'N-01', load: 85 },
  { node: 'N-02', load: 62 },
  { node: 'N-03', load: 78 },
  { node: 'N-04', load: 45 },
  { node: 'N-05', load: 92 },
  { node: 'N-06', load: 55 },
];

export function Resources() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-white tracking-tight">Infrastructure</h1>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">Distributed computing nodes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">128 Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-error" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">2 Offline</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-surface-container p-8 rounded-3xl border border-outline/30">
          <h2 className="text-lg font-black font-headline text-white mb-6">Node Load Balancing</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nodeLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="node" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="load" fill="#00ff9d" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-surface-container p-8 rounded-3xl border border-outline/30 flex flex-col items-center">
          <h2 className="text-lg font-black font-headline text-white mb-6 self-start">Resource Distribution</h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{item.name}</span>
                <span className="text-[10px] font-black text-white ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Cpu, label: 'CPU Cluster', value: '78%', status: 'Optimal', color: 'text-secondary' },
          { icon: Database, label: 'Data Lake', value: '1.2PB', status: 'Healthy', color: 'text-tertiary' },
          { icon: Network, label: 'Throughput', value: '45GB/s', status: 'High', color: 'text-white' },
          { icon: ShieldCheck, label: 'Firewall', value: 'Active', status: 'Secure', color: 'text-secondary' },
        ].map((item, i) => (
          <div key={i} className="bg-surface-container p-6 rounded-3xl border border-outline/30 flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-surface-container-high ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{item.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white font-mono">{item.value}</span>
                <span className={`text-[8px] font-bold uppercase ${item.status === 'Optimal' || item.status === 'Healthy' || item.status === 'Secure' ? 'text-secondary' : 'text-tertiary'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
