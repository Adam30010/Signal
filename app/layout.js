import { UIProvider } from '@/components/ui/UIProvider';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/ui/BackToTop';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CookieBanner from '@/components/ui/CookieBanner';
import SearchModal from '@/components/ui/SearchModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import FloatingContact from '@/components/ui/FloatingContact';
import ClientShell from '@/components/ClientShell';
import { BRAND, faviconDataUri } from '@/lib/brand';
import './globals.css';

// Brand CSS custom properties — injected from lib/brand.js (single source of
// truth). globals.css :root values act as fallbacks only.
const BRAND_VARS = {
  '--accent': BRAND.accent,
  '--accent-ink': BRAND.accentInk,
  '--accent-dim': BRAND.accentDim,
  '--accent-glow': BRAND.accentGlow,
  '--bg': BRAND.bg,
  '--fg': BRAND.fg,
  '--line': BRAND.line,
  '--font-mono': BRAND.fontMono,
};

export const metadata = {
  title: {
    default: 'SIGNAL — Learn for free, pay to scale.',
    template: '%s — SIGNAL',
  },
  description:
    'SIGNAL turns your existing digital consumption into a validated business opportunity and a 14-day free execution roadmap. Density readouts, honest telemetry, no fake urgency.',
  keywords: ['SIGNAL', 'side hustle', 'blueprint', 'skill mapping', 'opportunity', 'business roadmap'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'SIGNAL — Learn for free, pay to scale.',
    description: 'Your consumption is a latent skill. We surface it, validate it, roadmap it.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" style={BRAND_VARS}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/print.css" media="print" />
        <link rel="icon" id="favicon" type="image/svg+xml" href={faviconDataUri()} />
        {/* Light-mode brand vars — derived from lib/brand.js */}
        <style>{`[data-theme='light']{--accent:${BRAND.accentLight};--accent-ink:${BRAND.accentInkLight};--accent-dim:${BRAND.accentDimLight};--accent-glow:${BRAND.accentGlowLight};}`}</style>
      </head>
      <body>
        <a href="#main" className="skip-link">SKIP TO CONTENT</a>
        <UIProvider>
          <ClientShell>
            <ScrollProgress />
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
            <CookieBanner />
            <SearchModal />
            <ConfirmModal />
            <FloatingContact />
            <BackToTop />
          </ClientShell>
        </UIProvider>
      </body>
    </html>
  );
}
