import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { getChatAssistantResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';

function ShieldAlert({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { 
      role: 'assistant', 
      content: "Analytical link established. I am **Quant Edge Assistant (QEA)**. \n\nHow can I assist your research objectives today? I can explain platform modules, architect strategies, or provide technical context on market indicators." 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const INITIAL_MESSAGE = { 
    role: 'assistant' as const, 
    content: "Analytical link established. I am **Quant Edge Assistant (QEA)**. \n\nHow can I assist your research objectives today? I can explain platform modules, architect strategies, or provide technical context on market indicators." 
  };

  const handleCloseClick = () => {
    if (messages.length > 1) {
      setShowClearConfirm(true);
    } else {
      setIsOpen(false);
    }
  };

  const clearAndClose = () => {
    setMessages([INITIAL_MESSAGE]);
    setShowClearConfirm(false);
    setIsOpen(false);
  };

  const justClose = () => {
    setShowClearConfirm(false);
    setIsOpen(false);
  };

  const LOADING_STEPS = [
    "Accessing Neural Nexus...",
    "Synchronizing with Transformer-FX...",
    "Analyzing Research Nodes...",
    "Formulating Quantitative Insight..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const currentHistory = [...messages];
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getChatAssistantResponse(userMessage, currentHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      const errorMessage = error?.message || "";
      let userFriendlyError = "CRITICAL ERROR: Neural nexus synchronization failed. Please attempt a hard reset of the interface.";
      
      if (errorMessage.includes("CIRCUIT_BREAKER")) {
        userFriendlyError = `**CIRCUIT BREAKER ACTIVE**: Intelligence nexus is currently cooling down due to high research load. System sync will be restored in approximately ${errorMessage.split('active.')[1] || '60s'}.`;
      } else if (errorMessage.toLowerCase().includes("quota") || errorMessage.toLowerCase().includes("resource_exhausted")) {
        userFriendlyError = "**QUOTA EXHAUSTED**: Your research allocation has been temporary saturated. My cognitive processing is currently queued by the global controller. Please wait 60 seconds.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: userFriendlyError }]);
    } finally {
      setIsLoading(false);
    }
  };

  const SUGGESTED_QUESTIONS = [
    "How is Forex PnL calculated here?",
    "Explain Transformer-FX v2.4 internals",
    "How to architect a Volatility Breakout?",
    "Managing margin in Live Simulation"
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-secondary rounded-full shadow-2xl flex items-center justify-center text-black hover:scale-110 transition-transform z-40 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform relative z-10" />
      </button>

      {isOpen && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 bg-surface-container-highest border border-outline/30 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 ${
              isExpanded ? 'w-[500px] h-[700px]' : 'w-[400px] h-[550px]'
            }`}
          >
            <div className="p-4 bg-surface border-b border-outline/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Intelligence Nexus</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.5)]" />
                    <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">QEA v2.4 Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-on-surface-variant"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={handleCloseClick} 
                  className="p-2 hover:bg-error/10 rounded-xl transition-colors text-on-surface-variant hover:text-error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative flex-grow flex flex-col overflow-hidden">
              <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-3xl text-[11px] leading-relaxed max-w-[90%] shadow-lg ${
                      msg.role === 'user' 
                        ? 'bg-secondary text-black rounded-tr-none font-bold' 
                        : 'bg-surface-container-high text-white rounded-tl-none border border-outline/20'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-invert prose-p:leading-relaxed prose-a:text-secondary prose-a:font-bold prose-code:text-tertiary">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surface-container-high p-4 rounded-3xl rounded-tl-none border border-outline/20 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-secondary/20 overflow-hidden">
                        <div className="w-1/2 h-full bg-secondary animate-[loading_2s_infinite]" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="w-1 h-1 bg-secondary rounded-full animate-bounce" />
                          <span className="w-1 h-1 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-1 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">
                          {LOADING_STEPS[loadingStep]}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {!isLoading && messages.length === 1 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button 
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="p-3 text-[9px] font-bold text-left bg-white/5 border border-white/10 rounded-2xl text-on-surface-variant hover:text-white hover:bg-white/10 hover:border-secondary/30 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirmation Overlay */}
              {showClearConfirm && (
                <div className="absolute inset-0 z-50 bg-surface/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
                  <div className="bg-surface-container-highest border border-outline/30 rounded-[2rem] p-8 space-y-6 shadow-2xl text-center">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto border border-secondary/20">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">End Session?</h4>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Would you like to clear your research history before disconnecting?</p>
                    </div>
                    <div className="flex flex-col gap-2">
                       <button 
                        onClick={clearAndClose}
                        className="w-full py-3 bg-secondary text-black rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform"
                       >
                         Clear & Disconnect
                       </button>
                       <button 
                        onClick={justClose}
                        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                       >
                         Keep History
                       </button>
                       <button 
                        onClick={() => setShowClearConfirm(false)}
                        className="w-full py-2 text-[8px] font-black text-on-surface-variant uppercase tracking-widest hover:text-white transition-colors"
                       >
                         Cancel
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-outline/30 bg-surface">
              <div className="flex items-center gap-3 mb-3 px-2">
                <ShieldAlert className="w-3 h-3 text-on-surface-variant opacity-50" />
                <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Encrypted Segmented Research Channel</span>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask QEA about the platform..."
                  className="w-full bg-surface-container-high border border-outline/30 rounded-2xl py-4 pl-5 pr-14 text-xs text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-secondary/50 transition-all shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-secondary text-black rounded-xl hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all disabled:opacity-20 disabled:grayscale"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
