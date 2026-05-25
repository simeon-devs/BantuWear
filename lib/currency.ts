export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // rate vs USD
  decimals: number;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$',    name: 'US Dollar',              flag: '🇺🇸', rate: 1,      decimals: 2 },
  { code: 'EUR', symbol: '€',    name: 'Euro',                   flag: '🇪🇺', rate: 0.92,   decimals: 2 },
  { code: 'GBP', symbol: '£',    name: 'British Pound',          flag: '🇬🇧', rate: 0.79,   decimals: 2 },
  { code: 'XAF', symbol: 'FCFA', name: 'CFA Franc (Central)',    flag: '🇨🇲', rate: 620,    decimals: 0 },
  { code: 'XOF', symbol: 'CFA',  name: 'CFA Franc (West)',       flag: '🇸🇳', rate: 620,    decimals: 0 },
  { code: 'NGN', symbol: '₦',    name: 'Nigerian Naira',         flag: '🇳🇬', rate: 1620,   decimals: 0 },
  { code: 'GHS', symbol: 'GH₵',  name: 'Ghanaian Cedi',          flag: '🇬🇭', rate: 15.5,   decimals: 2 },
  { code: 'KES', symbol: 'KSh',  name: 'Kenyan Shilling',        flag: '🇰🇪', rate: 130,    decimals: 0 },
  { code: 'ZAR', symbol: 'R',    name: 'South African Rand',     flag: '🇿🇦', rate: 18.5,   decimals: 2 },
  { code: 'EGP', symbol: 'E£',   name: 'Egyptian Pound',         flag: '🇪🇬', rate: 48,     decimals: 2 },
  { code: 'MAD', symbol: 'MAD',  name: 'Moroccan Dirham',        flag: '🇲🇦', rate: 10,     decimals: 2 },
  { code: 'ETB', symbol: 'Br',   name: 'Ethiopian Birr',         flag: '🇪🇹', rate: 57,     decimals: 2 },
  { code: 'TZS', symbol: 'TSh',  name: 'Tanzanian Shilling',     flag: '🇹🇿', rate: 2650,   decimals: 0 },
  { code: 'UGX', symbol: 'USh',  name: 'Ugandan Shilling',       flag: '🇺🇬', rate: 3750,   decimals: 0 },
  { code: 'RWF', symbol: 'RF',   name: 'Rwandan Franc',          flag: '🇷🇼', rate: 1300,   decimals: 0 },
  { code: 'DZD', symbol: 'DA',   name: 'Algerian Dinar',         flag: '🇩🇿', rate: 135,    decimals: 2 },
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // USD

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY;
}

export function convertPrice(usdPrice: number, currency: Currency): number {
  return usdPrice * currency.rate;
}

export function formatPrice(usdPrice: number, currency: Currency): string {
  const converted = convertPrice(usdPrice, currency);
  const formatted = converted.toLocaleString('en-US', {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });

  // Symbol placement: some currencies go after the number
  const after = ['XAF', 'XOF', 'MAD', 'DZD'];
  if (after.includes(currency.code)) {
    return `${formatted} ${currency.symbol}`;
  }
  return `${currency.symbol}${formatted}`;
}
