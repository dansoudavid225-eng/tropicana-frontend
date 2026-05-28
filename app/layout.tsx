import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import AnnouncementBar from '@/components/AnnouncementBar'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { LanguageProvider } from '@/context/LanguageContext'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const OG_IMAGE = 'https://tropicanapiopio.com/images/og-cover.jpg'

export const metadata: Metadata = {
  metadataBase: new URL('https://tropicanapiopio.com'),
  title: {
    default: 'Tropicana Pio Pio — Thé Naturel Bio | Porto-Novo, Bénin',
    template: '%s | Tropicana Pio Pio',
  },
  description: 'Thé Pio Pio à base de verveine blanche citronnée, 100% bio, cultivé à Porto-Novo. Boostez votre énergie, améliorez votre sommeil. Livraison nationale au Bénin.',
  keywords: ['thé bio', 'verveine blanche', 'bien-être', 'Bénin', 'Porto-Novo', 'santé naturelle', 'thé pio pio', 'infusion naturelle', 'thé africain'],
  authors: [{ name: 'Felicien Prosper Durand', url: 'https://tropicanapiopio.com' }],
  creator: 'Tropicana Pio Pio',
  publisher: 'Tropicana Pio Pio',

  openGraph: {
    title: 'Tropicana Pio Pio — Thé Naturel Bio 🌿',
    description: '🌿 100% Bio · Cultivé à Porto-Novo, Bénin · Livraison nationale 24h. Découvrez le thé qui prend soin de votre famille.',
    url: 'https://tropicanapiopio.com',
    siteName: 'Tropicana Pio Pio',
    locale: 'fr_BJ',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Tropicana Pio Pio — Thé Naturel Bio, Porto-Novo Bénin',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Tropicana Pio Pio — Thé Naturel Bio 🌿',
    description: '100% Bio · Cultivé à Porto-Novo, Bénin · Livraison nationale 24h.',
    images: [OG_IMAGE],
  },

  // WhatsApp et Facebook lisent ces balises
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'og:locale:alternate': 'fr_FR',
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg',    type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://tropicanapiopio.com',
    languages: {
      'fr-BJ': 'https://tropicanapiopio.com',
      'fr-FR': 'https://tropicanapiopio.com',
    },
  },
  verification: {
    google: 'tropicana-google-verification',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Anti-flash : applique le thème AVANT le premier rendu */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('pio-theme');
              if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              document.documentElement.setAttribute('data-theme', t);
            } catch(e){}
          })();
        `}} />
        {/* Schema.org JSON-LD — améliore le référencement Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Tropicana Pio Pio",
            "url": "https://tropicanapiopio.com",
            "logo": "https://tropicanapiopio.com/images/logo.png",
            "description": "Thé naturel bio à base de verveine blanche citronnée, cultivé à Porto-Novo, Bénin.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Porto-Novo",
              "addressCountry": "BJ"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+229-01-95-96-77-62",
              "contactType": "customer service",
              "availableLanguage": ["French"]
            },
            "sameAs": [
              "https://www.facebook.com/tropicanapiopio",
              "https://www.instagram.com/tropicanapiopio"
            ],
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "XOF",
              "offerCount": "2",
              "lowPrice": "100",
              "highPrice": "1000"
            }
          })}}
        />
      </head>
      <body>
        <Script src="https://accounts.google.com/gsi/client" async strategy="afterInteractive" />
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <AnnouncementBar />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
