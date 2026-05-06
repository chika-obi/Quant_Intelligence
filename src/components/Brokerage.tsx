import { useState } from 'react';
import { Wallet, Plus, Shield, Globe, Lock, CheckCircle2, AlertTriangle, ExternalLink, Trash2, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BrokerAccount {
  id: string;
  name: string;
  provider: string;
  type: 'live' | 'paper';
  status: 'connected' | 'error' | 'disconnected';
  balance: number;
  currency: string;
}

export function Brokerage() {
  const [accounts, setAccounts] = useState<BrokerAccount[]>([
    { id: '1', name: 'IBKR Pro - Global', provider: 'Interactive Brokers', type: 'live', status: 'connected', balance: 142500.50, currency: 'USD' },
    { id: '2', name: 'Main Crypto Wallet', provider: 'Binance', type: 'live', status: 'error', balance: 0.42, currency: 'BTC' }
  ]);
  const [isAdding, setIsAdding] = useState(false);

  const PAIRED_PROVIDERS = [
    { name: 'Interactive Brokers', icon: 'IB', color: 'bg-emerald-500' },
    { name: 'MetaTrader 5', icon: 'MT', color: 'bg-blue-500' },
    { name: 'Binance', icon: 'BN', color: 'bg-yellow-500' },
    { name: 'Oanda', icon: 'OA', color: 'bg-orange-500' },
    { name: 'TD Ameritrade', icon: 'TD', color: 'bg-green-600' }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black font-headline text-white tracking-tight text-shadow-glow">Live <span className="text-secondary">Connectivity</span></h1>
          </div>
          <p className="text-on-surface-variant text-xs font-medium max-w-md uppercase tracking-wider">
            Secure multi-brokerage aggregation layer via Quant Edge high-frequency bridges.
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Connect New Brokerage
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {accounts.map((acc, idx) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-surface-container rounded-[2rem] border p-6 flex flex-col gap-6 relative overflow-hidden group transition-all duration-300 ${
                acc.status === 'connected' ? 'border-outline/30 hover:border-secondary/40' : 'border-error/30 hover:border-error/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{acc.provider}</span>
                  <h3 className="text-lg font-black text-white">{acc.name}</h3>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  acc.status === 'connected' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'connected' ? 'bg-secondary animate-pulse' : 'bg-error'}`} />
                  {acc.status}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Valuation</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-mono">{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-xs font-black text-on-surface-variant">{acc.currency}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-outline/10 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-on-surface-variant">
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-error/10 rounded-lg transition-colors text-on-surface-variant hover:text-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-outline/20 rounded-xl text-[10px] font-black text-secondary uppercase tracking-widest hover:bg-white/10 transition-all">
                  Launch Terminal <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {acc.status === 'error' && (
                <div className="absolute inset-0 bg-error/5 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                  <div className="space-y-3">
                    <AlertTriangle className="w-8 h-8 text-error mx-auto" />
                    <p className="text-[10px] font-black text-error uppercase tracking-widest">API Authentication Expired</p>
                    <button className="px-4 py-2 bg-error text-white rounded-xl text-[8px] font-black uppercase tracking-widest">Reconnect Account</button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container rounded-3xl p-8 border border-outline/30 space-y-6">
          <div className="flex items-center gap-3">
             <Shield className="w-6 h-6 text-secondary" />
             <h4 className="text-sm font-black text-white uppercase tracking-[0.1em]">Institutional Security Protocol</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
            Your brokerage credentials never leave the encrypted enclave of the Quant Edge Neural Server. We use military-grade AES-256 encryption and hardware security modules (HSM) to handle your API handshakes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-secondary" /> AES-256
              </span>
              <span className="text-[8px] text-on-surface-variant font-bold uppercase">Rest Encryption</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3 text-secondary" /> OAuth 2.0
              </span>
              <span className="text-[8px] text-on-surface-variant font-bold uppercase">Native Auth Flow</span>
            </div>
          </div>
        </div>

        <div className="bg-tertiary/5 rounded-3xl p-8 border border-tertiary/20 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-[0.1em] mb-4">Supported Providers</h4>
            <div className="flex flex-wrap gap-3">
              {PAIRED_PROVIDERS.map((p) => (
                <div key={p.name} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                  <div className={`w-6 h-6 rounded-lg ${p.color} flex items-center justify-center text-[10px] font-black text-white text-shadow-none`}>
                    {p.icon}
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{p.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-dashed border-white/20 opacity-50">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">+ 50 more</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-tertiary/20 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-tertiary" />
            <span className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em]">Ready for Automated Execution</span>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-surface-container-highest rounded-[3rem] border border-outline/30 p-10 space-y-8 shadow-2xl shadow-black/50"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Select Provider</h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Connect your live trade engine</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {PAIRED_PROVIDERS.map((p) => (
                 <button 
                  key={p.name}
                  className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-secondary/50 hover:bg-white/10 transition-all flex flex-col items-center gap-4 group"
                 >
                   <div className={`w-12 h-12 rounded-2xl ${p.color} flex items-center justify-center text-lg font-black text-white group-hover:scale-110 transition-transform`}>
                     {p.icon}
                   </div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.name}</span>
                 </button>
               ))}
            </div>

            <button 
              onClick={() => setIsAdding(false)}
              className="w-full py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
              Cancel Integration
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
