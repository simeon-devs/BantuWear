import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BantuWear brand palette
        charcoal: {
          DEFAULT: '#1A1A1A',
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#636363',
          600: '#4a4a4a',
          700: '#363636',
          800: '#2a2a2a',
          900: '#1A1A1A',
          950: '#0d0d0d',
        },
        terracotta: {
          DEFAULT: '#E05936',
          50:  '#fef4f0',
          100: '#fde6dd',
          200: '#fbc8b5',
          300: '#f7a081',
          400: '#f1714c',
          500: '#E05936',
          600: '#c94120',
          700: '#a8331a',
          800: '#8a2d1b',
          900: '#732a1b',
          950: '#3e1209',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50:  '#fdfbec',
          100: '#f9f4cc',
          200: '#f3e88a',
          300: '#edd64d',
          400: '#e5c226',
          500: '#D4AF37',
          600: '#b7891a',
          700: '#926318',
          800: '#794f1b',
          900: '#67421c',
          950: '#3b220b',
        },
        forest: {
          DEFAULT: '#1B4332',
          50:  '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7d1',
          300: '#86efad',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#1B4332',
          950: '#052e16',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          50:  '#fdfcf9',
          100: '#F5F0E8',
          200: '#ede4d3',
          300: '#ddd1b8',
          400: '#c9b894',
          500: '#b89d72',
        },
        // shadcn/ui design tokens
        background:        'hsl(var(--background))',
        foreground:        'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.4s ease-out',
        'slide-up':       'slide-up 0.5s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
