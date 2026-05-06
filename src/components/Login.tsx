import React from 'react';
import { LogIn, Sparkles, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';

export function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/20 blur-[120px] rounded-full" />
      </div>

      <div 
        className="max-w-md w-full bg-surface-container-highest border border-outline/30 rounded-[2.5rem] p-10 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 bg-secondary/10 rounded-3xl text-secondary mb-4">
            <Sparkles className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Quant Edge</h1>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
              Institutional-grade research & trading intelligence. Secure your session to access neural models.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-white/5 rounded-xl text-on-surface-variant">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-white/5 rounded-xl text-on-surface-variant">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Neural</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-white/5 rounded-xl text-on-surface-variant">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Global</span>
            </div>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-secondary text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-secondary/20"
          >
            <LogIn className="w-5 h-5" />
            Sign In with Google
          </button>

          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest pt-4">
            By signing in, you agree to our research protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
