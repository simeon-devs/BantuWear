'use client';

const ITEMS = [
  'ANKARA', 'KENTE', 'NDOP', 'TOGHU', 'ADIRE',
  'KANGA', 'BOUBOU', 'AGBADA', 'DASHIKI', 'RAFFIA',
  'BATIK', 'PAGNE', 'KABA', 'NDOP', 'SANJA',
];

const text = ITEMS.map((t) => `${t}  ◆  `).join('');

export function MarqueeStrip() {
  return (
    <div className="overflow-hidden bg-charcoal-900/70 border-y border-charcoal-800/60 py-3.5 select-none">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee 44s linear infinite' }}
      >
        <span className="text-gold/45 font-sans text-[10px] tracking-[0.45em] uppercase shrink-0 pr-0">
          {text}
        </span>
        <span className="text-gold/45 font-sans text-[10px] tracking-[0.45em] uppercase shrink-0">
          {text}
        </span>
      </div>
    </div>
  );
}
