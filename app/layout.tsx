import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'BantuWear — Premium Afro-Futurist Fashion',
    template: '%s | BantuWear',
  },
  description:
    'BantuWear is an ultra-premium African streetwear label fusing ancestral craftsmanship with contemporary silhouettes. Explore hoodies, kimonos, bombers and more.',
  keywords: ['African fashion', 'streetwear', 'Ankara', 'Kente', 'Afrofuturism', 'BantuWear'],
  authors: [{ name: 'BantuWear' }],
  openGraph: {
    title: 'BantuWear — Premium Afro-Futurist Fashion',
    description: 'Where ancestral craft meets contemporary design.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-charcoal text-cream antialiased">
        <Providers>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
