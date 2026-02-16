
import React, { useState, useEffect } from 'react';
import { Check, Crown, Zap, ShieldCheck, Globe, CreditCard } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface PricingProps {
  lang: 'en' | 'id';
}

const Pricing: React.FC<PricingProps> = ({ lang }) => {
  const [isIndonesia, setIsIndonesia] = useState(false);

  useEffect(() => {
    // Basic location detection
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isIndo = timezone.toLowerCase().includes('jakarta') || 
                   timezone.toLowerCase().includes('makassar') || 
                   navigator.language.toLowerCase().includes('id');
    setIsIndonesia(isIndo);
  }, []);

  const handleCheckout = (planId: string) => {
    if (planId === 'free') return;
    
    if (isIndonesia) {
      alert("Redirecting to Midtrans Snap Checkout... (QRIS/Bank Transfer)");
      // Logic for Midtrans Snap API integration
    } else {
      alert("Redirecting to Stripe Checkout... (Credit Card/Google Pay)");
      // Logic for Stripe Checkout integration
    }
  };

  const plans = [
    {
      id: 'free',
      name: TRANSLATIONS.free_tier[lang],
      price: '$0',
      priceIdr: 'Rp 0',
      desc: 'Test the waters of NusaAI Hub.',
      features: ['1x Free Trial Credit', 'Basic AI Models', 'Community Support', 'Web Access'],
      button: 'Current Plan',
      highlight: false,
    },
    {
      id: 'pro',
      name: TRANSLATIONS.pro_monthly[lang],
      price: '$19.99',
      priceIdr: 'Rp 299.000',
      period: '/mo',
      desc: 'Full power for creators & pros.',
      features: ['Unlimited AI Access', 'Use Your Own API Key', 'Priority Support', '4K Video Tools', 'No Watermarks'],
      button: TRANSLATIONS.upgrade_pro[lang],
      highlight: true,
    },
    {
      id: 'annual',
      name: TRANSLATIONS.annual_plan[lang],
      price: '$199',
      priceIdr: 'Rp 2.900.000',
      period: '/yr',
      desc: 'Best value for long-term growth.',
      features: ['Everything in Pro', '2 Months Free', 'Early Access to Beta Features', 'White-labeling Options'],
      button: 'Go Annual',
      highlight: false,
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
          <Globe size={12} /> {isIndonesia ? 'Detected Location: Indonesia' : 'International Checkout Active'}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Flexible Plans for Every Journey</h1>
        <p className="text-slate-500 text-lg">Choose the right path for your AI transformation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative glass-card p-8 rounded-[2.5rem] border ${
              plan.highlight ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/10' : 'border-white/5'
            } flex flex-col h-full hover:border-white/20 transition-all group`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-300 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {isIndonesia ? plan.priceIdr : plan.price}
                </span>
                <span className="text-slate-500">{plan.period}</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">{plan.desc}</p>
            </div>

            <ul className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-500'}`}>
                    <Check size={14} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleCheckout(plan.id)}
              className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                plan.highlight 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
              }`}
            >
              {plan.id !== 'free' && <CreditCard size={18} />}
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold">Secure Global Payments</h4>
            <p className="text-slate-500 text-sm">
              We use {isIndonesia ? 'Midtrans' : 'Stripe'} for world-class security. {isIndonesia ? 'Supported: QRIS, GoPay, ShopeePay, Bank Transfer.' : 'Supported: Visa, Mastercard, AMEX, Google Pay.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
