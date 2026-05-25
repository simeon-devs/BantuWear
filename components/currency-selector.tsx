'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CURRENCIES } from '@/lib/currency';
import { useCurrencyStore } from '@/lib/store';

export function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { currency, setCurrency } = useCurrencyStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-cream/60 hover:text-cream font-sans text-xs tracking-widest uppercase transition-colors py-1 px-2 rounded-lg hover:bg-charcoal-800"
      >
        <span>{currency.flag}</span>
        <span>{currency.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-charcoal-900 border border-charcoal-700 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="max-h-80 overflow-y-auto">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-charcoal-800 ${
                  currency.code === c.code ? 'text-gold bg-charcoal-800' : 'text-cream/70'
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="font-sans text-xs font-medium tracking-wide">{c.code}</span>
                <span className="font-sans text-xs text-cream/40 truncate">{c.name}</span>
                <span className="ml-auto font-sans text-xs text-cream/50">{c.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
