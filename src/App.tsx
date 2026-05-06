/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { TopAppBar, BottomNavBar, Sidebar } from './components/Navigation';
import { Overview } from './components/Overview';
import { Efficiency } from './components/Efficiency';
import { Resources } from './components/Resources';
import { Comparison } from './components/Comparison';
import { Config } from './components/Config';
import { Backtest } from './components/Backtest';
import { Methodology } from './components/Methodology';
import { Subscription } from './components/Subscription';
import { StrategyBuilder } from './components/StrategyBuilder';
import { PaperTrading } from './components/PaperTrading';
import { IntelligenceFeed } from './components/IntelligenceFeed';
import { Brokerage } from './components/Brokerage';
import { AIAssistant } from './components/AIAssistant';
import { AlertsOverlay } from './components/AlertsOverlay';
import { Login } from './components/Login';
import { useFirebase } from './components/FirebaseProvider';
import { Screen, AppConfig, Alert } from './types';
import { db, doc, setDoc } from './firebase';

export default function App() {
  const { user, loading, userConfig, error: firebaseError } = useFirebase();
  const [currentScreen, setCurrentScreen] = useState<Screen>('overview');
  console.log("App state sync:", { loading, hasUser: !!user, currentScreen, userRole: userConfig?.role });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 100,
    confidenceThreshold: 85,
    autoExecute: false,
    notifications: true,
    researchMode: false,
  });

  // Sync Firebase config to local state
  useEffect(() => {
    if (userConfig) {
      setConfig(prev => ({
        ...prev,
        learningRate: userConfig.learningRate ?? prev.learningRate,
        confidenceThreshold: (userConfig.confidenceThreshold ?? 0.85) * 100,
        notifications: userConfig.notificationsEnabled ?? prev.notifications,
        researchMode: userConfig.researchMode ?? prev.researchMode,
      }));
    }
  }, [userConfig]);

  // Save config to Firebase when it changes locally
  const updateConfig = async (newConfig: AppConfig) => {
    setConfig(newConfig);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          confidenceThreshold: newConfig.confidenceThreshold / 100,
          learningRate: newConfig.learningRate,
          notificationsEnabled: newConfig.notifications,
          researchMode: newConfig.researchMode,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (error) {
        console.error("Error saving config to Firebase:", error);
      }
    }
  };

  const addAlert = useCallback((message: string, type: Alert['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    const newAlert: Alert = {
      id,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 5));
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 5000);
  }, []);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const [loadingStartTime] = useState(Date.now());
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (loading && Date.now() - loadingStartTime > 8000) {
        setShowRetry(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, loadingStartTime]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 max-w-xs text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-secondary/10 border-t-secondary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-secondary/20 rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <span className="text-xs font-black text-white uppercase tracking-[0.2em] animate-pulse block">
              Synchronizing Neural Link
            </span>
            <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
              Establishing secure connection to Quant Edge intelligence nodes...
            </p>
          </div>

          {firebaseError && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-2xl">
              <p className="text-[10px] text-error font-bold uppercase tracking-widest">
                {firebaseError}
              </p>
            </div>
          )}

          {showRetry && (
            <div 
              className="pt-4 space-y-4"
            >
              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                Taking longer than expected?
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white/5 border border-outline/30 rounded-full text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Refresh Connection
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (firebaseError) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
          <ShieldCheck className="w-10 h-10 text-error" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Signal Loss Detected</h2>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
            The neural link to our research database has been interrupted. 
            <br />
            <span className="text-error mt-2 block font-mono text-[10px]">{firebaseError}</span>
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-secondary transition-all"
        >
          Re-establish Connection
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-surface selection:bg-secondary selection:text-black overflow-x-hidden ${config.researchMode ? 'research-mode' : ''}`}>
      <Sidebar currentScreen={currentScreen} setScreen={setCurrentScreen} />
      <TopAppBar currentScreen={currentScreen} setScreen={setCurrentScreen} />
      
      <AlertsOverlay alerts={alerts} onRemove={removeAlert} />

      <main className="lg:ml-64 pt-24 pb-32 lg:pb-12 px-6 max-w-[1600px] mx-auto">
        {currentScreen === 'overview' && <Overview addAlert={addAlert} config={config} setScreen={setCurrentScreen} />}
        {currentScreen === 'intelligence' && <IntelligenceFeed />}
        {currentScreen === 'brokerage' && <Brokerage />}
        {currentScreen === 'efficiency' && <Efficiency config={config} />}
        {currentScreen === 'resources' && <Resources />}
        {currentScreen === 'comparison' && <Comparison config={config} />}
        {currentScreen === 'methodology' && <Methodology />}
        
        {/* Protected Researcher/Admin Routes */}
        {userConfig?.role !== 'viewer' && (
          <>
            {currentScreen === 'config' && <Config config={config} setConfig={updateConfig} />}
            {currentScreen === 'backtest' && <Backtest />}
            {currentScreen === 'strategy' && <StrategyBuilder />}
            {currentScreen === 'simulation' && <PaperTrading />}
          </>
        )}

        {/* Protected Admin Only Routes */}
        {userConfig?.role === 'admin' && (
          <>
            {currentScreen === 'subscription' && <Subscription />}
          </>
        )}

        {/* Redirect for unauthorized access */}
        {(
          (['config', 'backtest', 'strategy', 'simulation'].includes(currentScreen) && userConfig?.role === 'viewer') ||
          (currentScreen === 'subscription' && userConfig?.role !== 'admin')
        ) && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
              <ShieldCheck className="w-10 h-10 text-error" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Access Restricted</h2>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                Your current role (<span className="text-secondary font-bold uppercase">{userConfig?.role}</span>) does not have sufficient permissions to view this secure research node.
              </p>
            </div>
            <button 
              onClick={() => setCurrentScreen('overview')}
              className="px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-secondary transition-all"
            >
              Return to Intelligence Overview
            </button>
          </div>
        )}
      </main>

      <AIAssistant />
      <BottomNavBar currentScreen={currentScreen} setScreen={setCurrentScreen} />
    </div>
  );
}
