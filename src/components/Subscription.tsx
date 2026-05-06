import { Check, Zap, Shield, Globe, Cpu, CreditCard, Calendar, ArrowRight } from 'lucide-react';

export function Subscription() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For individual researchers and hobbyists.',
      features: [
        'Basic Model Analytics',
        '5 Backtests per month',
        'Standard Latency',
        'Community Support'
      ],
      current: false,
      cta: 'Current Plan',
      color: 'bg-white/5'
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/mo',
      description: 'Advanced tools for professional quant traders.',
      features: [
        'Unlimited Backtesting',
        'Real-time Market Insights',
        'Advanced Risk Metrics',
        'Priority API Access',
        'Research Mode UI',
        'Email Support'
      ],
      current: true,
      cta: 'Manage Plan',
      color: 'bg-secondary/10 border-secondary/30'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Institutional grade infrastructure and support.',
      features: [
        'Custom Model Integration',
        'Dedicated GPU Clusters',
        'White-label Reporting',
        '24/7 Phone Support',
        'On-premise Deployment',
        'SLA Guarantees'
      ],
      current: false,
      cta: 'Contact Sales',
      color: 'bg-white/5'
    }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      <header className="text-center space-y-4">
        <div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest"
        >
          <Shield className="w-3 h-3" />
          Secure Billing
        </div>
        <h1 
          className="text-4xl lg:text-5xl font-black font-headline text-white tracking-tight"
        >
          Scale your <span className="text-secondary">Quant Edge</span>
        </h1>
        <p 
          className="text-on-surface-variant max-w-2xl mx-auto text-sm"
        >
          Choose the plan that fits your research requirements. All plans include our core Transformer-FX engine and real-time market connectivity.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`relative p-8 rounded-3xl border border-outline/30 flex flex-col ${plan.color} overflow-hidden group`}
          >
            {plan.current && (
              <div className="absolute top-0 right-0 bg-secondary text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                Active
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                {plan.period && <span className="text-on-surface-variant text-sm">{plan.period}</span>}
              </div>
              <p className="mt-4 text-xs text-on-surface-variant leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-secondary/20 text-secondary">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-on-surface">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              plan.current 
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                : 'bg-secondary text-black hover:bg-secondary-fixed-dim'
            }`}>
              {plan.cta}
              {!plan.current && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
          className="bg-surface-container p-8 rounded-3xl border border-outline/30 flex items-center gap-6"
        >
          <div className="p-4 rounded-2xl bg-white/5 text-secondary">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Payment Method</h4>
            <p className="text-xs text-on-surface-variant mb-3">Visa ending in 4242 • Expires 12/26</p>
            <button className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline">Update Card</button>
          </div>
        </div>

        <div 
          className="bg-surface-container p-8 rounded-3xl border border-outline/30 flex items-center gap-6"
        >
          <div className="p-4 rounded-2xl bg-white/5 text-tertiary">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Next Billing Date</h4>
            <p className="text-xs text-on-surface-variant mb-3">Your next payment of $49 is scheduled for May 12, 2026.</p>
            <button className="text-[10px] font-black text-tertiary uppercase tracking-widest hover:underline">View Invoices</button>
          </div>
        </div>
      </div>
    </div>
  );
}
