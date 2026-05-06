import { Settings, Shield, Database, Bell, Cpu, Save, RefreshCw, UserCheck, ShieldAlert } from 'lucide-react';
import { AppConfig, UserRole } from '../types';
import { Tooltip } from './Tooltip';
import { useFirebase } from './FirebaseProvider';
import { db, doc, setDoc } from '../firebase';

interface ConfigProps {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
}

export function Config({ config, setConfig }: ConfigProps) {
  const { user, userConfig } = useFirebase();

  const handleChange = (key: keyof AppConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const handleRoleChange = async (newRole: UserRole) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        role: newRole,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-white tracking-tight">System Configuration</h1>
          <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">Global parameters & security</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setConfig({
              learningRate: 0.001,
              batchSize: 32,
              epochs: 100,
              confidenceThreshold: 85,
              autoExecute: false,
              notifications: true,
              researchMode: false,
            })}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-outline/30 text-white font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all">
            <Save className="w-3 h-3" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* User Identity Section */}
          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <UserCheck className="w-24 h-24 text-secondary" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black font-headline text-white">User Identity</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Email</span>
                    <span className="text-sm font-bold text-white truncate block">{user?.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Active Role</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      userConfig?.role === 'admin' ? 'bg-secondary text-black' : 
                      userConfig?.role === 'researcher' ? 'bg-tertiary text-black' : 'bg-white/10 text-white'
                    }`}>
                      {userConfig?.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-64 space-y-4 pt-6 md:pt-0 md:border-l md:pl-8 border-outline/10">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Permission Level</h4>
                <div className="space-y-3">
                  {['admin', 'researcher', 'viewer'].map((r) => {
                    const isCurrent = userConfig?.role === r;
                    const canChange = userConfig?.role === 'admin';
                    
                    return (
                      <button 
                        key={r}
                        disabled={!canChange || isCurrent}
                        onClick={() => handleRoleChange(r as UserRole)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isCurrent 
                            ? 'bg-secondary/10 border-secondary text-secondary' 
                            : canChange 
                              ? 'bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10 hover:border-white/20' 
                              : 'bg-white/5 border-transparent text-on-surface-variant/40 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{r}</span>
                        {isCurrent && <Shield className="w-3 h-3" />}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[8px] text-on-surface-variant italic">
                  {userConfig?.role === 'admin' 
                    ? '* Admins can manage security protocols and node access.' 
                    : '* Contact an administrator to upgrade your node permissions.'}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black font-headline text-white">Model Parameters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Inference Engine</label>
                  <Tooltip content="The core neural architecture used for real-time market analysis and signal generation." />
                </div>
                <select className="w-full bg-surface-container-high border border-outline/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary/50 appearance-none">
                  <option>Transformer-FX v2.4</option>
                  <option>LSTM-X1 Legacy</option>
                  <option>GRU-Quantum Beta</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Batch Size</label>
                  <Tooltip content="Number of data samples processed in a single pass. Higher values increase throughput but require more memory." />
                </div>
                <input 
                  type="number" 
                  value={config.batchSize} 
                  onChange={(e) => handleChange('batchSize', parseInt(e.target.value))}
                  className="w-full bg-surface-container-high border border-outline/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary/50" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Learning Rate</label>
                  <Tooltip content="Determines the step size at each iteration while moving toward a minimum of a loss function." />
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0.0001" 
                    max="0.01" 
                    step="0.0001"
                    value={config.learningRate}
                    onChange={(e) => handleChange('learningRate', parseFloat(e.target.value))}
                    className="flex-1 accent-secondary" 
                  />
                  <span className="text-xs font-mono text-secondary w-12">{config.learningRate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Confidence Threshold</label>
                  <Tooltip content="Minimum probability required for the system to flag a signal as actionable." />
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="50" 
                    max="99" 
                    value={config.confidenceThreshold}
                    onChange={(e) => handleChange('confidenceThreshold', parseInt(e.target.value))}
                    className="flex-1 accent-secondary" 
                  />
                  <span className="text-xs font-mono text-secondary w-8">{config.confidenceThreshold}%</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-tertiary/10 text-tertiary">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black font-headline text-white">Data Sources</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'OANDA API', status: 'Connected', latency: '12ms' },
                { name: 'Binance WebSocket', status: 'Connected', latency: '8ms' },
                { name: 'Bloomberg Terminal', status: 'Standby', latency: '-' },
              ].map((source, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high border border-outline/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${source.status === 'Connected' ? 'bg-secondary' : 'bg-on-surface-variant'}`} />
                    <span className="text-sm font-bold text-white">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-on-surface-variant">{source.latency}</span>
                    <button className="text-[10px] font-black text-secondary uppercase tracking-widest">Configure</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-error/10 text-error">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black font-headline text-white">Security</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="block text-sm font-bold text-white">2FA Authentication</span>
                    <Tooltip content="Adds an extra layer of security by requiring a second form of verification." />
                  </div>
                  <span className="text-[10px] text-on-surface-variant">Require biometric verification</span>
                </div>
                <button 
                  onClick={() => handleChange('autoExecute', !config.autoExecute)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${config.autoExecute ? 'bg-secondary' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-all ${config.autoExecute ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="block text-sm font-bold text-white">API Encryption</span>
                    <Tooltip content="End-to-end encryption for all data transmitted between the client and the inference server." />
                  </div>
                  <span className="text-[10px] text-on-surface-variant">AES-256 GCM Protocol</span>
                </div>
                <div className="w-10 h-5 bg-secondary rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="block text-sm font-bold text-white">Research Mode</span>
                    <Tooltip content="Optimizes the UI for academic review, enabling formal typography and research-focused visualizations." />
                  </div>
                  <span className="text-[10px] text-on-surface-variant">Enable academic layout</span>
                </div>
                <button 
                  onClick={() => handleChange('researchMode', !config.researchMode)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${config.researchMode ? 'bg-secondary' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-all ${config.researchMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="pt-4 border-t border-outline/10">
                <button className="w-full py-3 bg-error/10 text-error border border-error/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-error/20 transition-colors">
                  Revoke All Access
                </button>
              </div>
            </div>
          </section>

          <section className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-white/5 text-white">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black font-headline text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={config.notifications} 
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  className="accent-secondary h-4 w-4" 
                />
                <span className="text-sm text-on-surface-variant">Signal Alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-secondary h-4 w-4" />
                <span className="text-sm text-on-surface-variant">System Health</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="accent-secondary h-4 w-4" />
                <span className="text-sm text-on-surface-variant">Weekly Reports</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
