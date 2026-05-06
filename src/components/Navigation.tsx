import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Zap, Cpu, Settings, BarChart3, Bell, Search, Menu, X, 
  ChevronRight, Activity, ShieldCheck, History, BookOpen, User, LogOut, CreditCard,
  Globe, Wallet
} from 'lucide-react';
import { Screen } from '../types';
import { useFirebase } from './FirebaseProvider';
import { auth, signOut } from '../firebase';

interface NavProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

export function Sidebar({ currentScreen, setScreen }: NavProps) {
  const { userConfig } = useFirebase();
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'intelligence', label: 'Intelligence Feed', icon: Globe, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'brokerage', label: 'Live Accounts', icon: Wallet, roles: ['admin', 'researcher'] },
    { id: 'efficiency', label: 'Efficiency', icon: Zap, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'resources', label: 'Resources', icon: Cpu, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'comparison', label: 'Comparison', icon: BarChart3, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'backtest', label: 'Backtest', icon: History, roles: ['admin', 'researcher'] },
    { id: 'strategy', label: 'Strategy Builder', icon: Zap, roles: ['admin', 'researcher'] },
    { id: 'simulation', label: 'Live Simulation', icon: Activity, roles: ['admin', 'researcher'] },
    { id: 'methodology', label: 'Methodology', icon: BookOpen, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, roles: ['admin'] },
    { id: 'config', label: 'Config', icon: Settings, roles: ['admin', 'researcher'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    !userConfig || item.roles.includes(userConfig.role || 'viewer')
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface-container border-r border-outline/30 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,157,0.3)]">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-black font-headline tracking-tight text-white leading-none">QUANT</h1>
          <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase">Edge Intelligence</span>
        </div>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 space-y-2">
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentScreen === item.id 
                ? 'bg-secondary text-black font-bold shadow-[0_0_15px_rgba(0,255,157,0.2)]' 
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentScreen === item.id ? 'text-black' : 'text-on-surface-variant group-hover:text-secondary'}`} />
            <span className="text-sm">{item.label}</span>
            {currentScreen === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-outline/30">
        <div className="bg-surface-container-high rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">System Status</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-on-surface-variant font-medium">Network Load</span>
            <span className="text-[10px] text-secondary font-bold">Optimal</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-secondary" />
          </div>
        </div>
      </div>
    </aside>
  );
}

export function TopAppBar({ currentScreen, setScreen }: NavProps) {
  const { user, userConfig } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const markets = [
    { pair: 'EUR/USD', type: 'Forex', trend: '+0.05%' },
    { pair: 'GBP/JPY', type: 'Forex', trend: '-0.12%' },
    { pair: 'BTC/USD', type: 'Crypto', trend: '+2.4%' },
    { pair: 'ETH/USD', type: 'Crypto', trend: '+1.8%' },
    { pair: 'USD/JPY', type: 'Forex', trend: '+0.02%' },
    { pair: 'AUD/USD', type: 'Forex', trend: '-0.08%' },
  ];

  const filteredMarkets = searchQuery 
    ? markets.filter(m => m.pair.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline/30 flex justify-between items-center px-4 md:px-6">
      <div className="lg:hidden flex items-center gap-2 md:gap-3">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-secondary flex items-center justify-center text-black">
          <Activity className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-base md:text-lg font-black font-headline text-white">QUANT</span>
      </div>
      
      <div className="hidden lg:block">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest opacity-50">{currentScreen}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search markets..." 
            className="bg-surface-container-high border border-outline/30 rounded-full py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-secondary/50 w-64 transition-all"
          />
          
          {isSearchFocused && searchQuery && (
            <div 
              className="absolute top-full left-0 right-0 mt-2 bg-surface-container-highest border border-outline/30 rounded-2xl shadow-2xl overflow-hidden"
            >
              {filteredMarkets.length > 0 ? (
                <div className="p-2">
                  {filteredMarkets.map((m) => (
                    <button 
                      key={m.pair}
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchFocused(false);
                        setScreen('overview');
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                    >
                      <div>
                        <span className="block text-xs font-bold text-white">{m.pair}</span>
                        <span className="text-[10px] text-on-surface-variant uppercase">{m.type}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${m.trend.startsWith('+') ? 'text-secondary' : 'text-error'}`}>
                        {m.trend}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <span className="text-xs text-on-surface-variant">No markets found for "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-on-surface-variant" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface" />
        </button>
        
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="h-8 w-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline/30 hover:border-secondary/50 transition-colors"
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User Profile" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary">
                <User className="w-4 h-4" />
              </div>
            )}
          </button>

          {isProfileOpen && (
            <div 
              className="absolute top-full right-0 mt-2 w-56 bg-surface-container-highest border border-outline/30 rounded-2xl shadow-2xl overflow-hidden p-2"
            >
              <div className="p-3 border-b border-outline/10 mb-2 flex justify-between items-start">
                <div>
                  <span className="block text-xs font-bold text-white truncate max-w-[120px]">
                    {userConfig?.displayName || user?.displayName || 'Quant Researcher'}
                  </span>
                  <span className="text-[10px] text-on-surface-variant truncate block max-w-[120px]">
                    {user?.email}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[8px] font-black uppercase rounded-md border border-secondary/20">
                  {userConfig?.role || 'User'}
                </span>
              </div>
              
              <div className="px-3 py-2 mb-2 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">API Usage</span>
                  <span className="text-[8px] font-bold text-white">84%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    style={{ width: '84%' }}
                    className="h-full bg-secondary"
                  />
                </div>
              </div>
              
              {userConfig?.role !== 'viewer' && (
                <button 
                  onClick={() => {
                    setScreen('config');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left group"
                >
                  <User className="w-4 h-4 text-on-surface-variant group-hover:text-secondary" />
                  <span className="text-xs text-white">Profile Settings</span>
                </button>
              )}
              
              {userConfig?.role === 'admin' && (
                <button 
                  onClick={() => {
                    setScreen('subscription');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left group"
                >
                  <CreditCard className="w-4 h-4 text-on-surface-variant group-hover:text-secondary" />
                  <span className="text-xs text-white">Subscription</span>
                </button>
              )}
              
              <div className="h-px bg-outline/10 my-2" />
              
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-error/10 rounded-xl transition-colors text-left group"
              >
                <LogOut className="w-4 h-4 text-error" />
                <span className="text-xs text-error font-bold">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function BottomNavBar({ currentScreen, setScreen }: NavProps) {
  const { userConfig } = useFirebase();
  
  const navItems = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'efficiency', label: 'Stats', icon: Zap, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'resources', label: 'Nodes', icon: Cpu, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'backtest', label: 'Backtest', icon: History, roles: ['admin', 'researcher'] },
    { id: 'methodology', label: 'Research', icon: BookOpen, roles: ['admin', 'researcher', 'viewer'] },
    { id: 'config', label: 'Config', icon: Settings, roles: ['admin', 'researcher'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    !userConfig || item.roles.includes(userConfig.role || 'viewer')
  );

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container/90 backdrop-blur-lg border-t border-outline/30 z-50 lg:hidden">
      {filteredNavItems.map((item) => (
        <button 
          key={item.id}
          onClick={() => setScreen(item.id as Screen)}
          className={`flex flex-col items-center justify-center ${currentScreen === item.id ? 'text-secondary' : 'text-on-surface-variant opacity-70'}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
