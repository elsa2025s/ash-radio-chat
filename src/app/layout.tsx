import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import { AudioProvider } from '@/lib/AudioContext'
import GlobalAudioPlayer from '@/components/GlobalAudioPlayer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ASH Radio - Votre Station Radio Moderne',
  description: 'Découvrez ASH Radio, votre station radio moderne avec musique, émissions, podcasts et chat en direct. Disponible 24h/24.',
  keywords: 'radio, musique, émissions, podcasts, chat, direct, ASH Radio',
  authors: [{ name: 'ASH Radio Team' }],
  creator: 'ASH Radio',
  publisher: 'ASH Radio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ashradio-direct.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ASH Radio - Votre Station Radio Moderne',
    description: 'Découvrez ASH Radio, votre station radio moderne avec musique, émissions, podcasts et chat en direct.',
    url: 'https://ashradio-direct.com',
    siteName: 'ASH Radio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ASH Radio',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASH Radio - Votre Station Radio Moderne',
    description: 'Découvrez ASH Radio, votre station radio moderne avec musique, émissions, podcasts et chat en direct.',
    images: ['/twitter-image.jpg'],
    creator: '@ashradio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ASH Radio',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'theme-color': '#dc2626',
    'msapplication-TileColor': '#dc2626',
    'msapplication-config': '/browserconfig.xml',
  },
}

export const viewport: Viewport = {
  themeColor: '#dc2626',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />

        {/* PWA Meta Tags */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#dc2626" />

        {/* Preload critical resources */}
        <link rel="preload" href="https://ext.same-assets.com/3147506062/ash-radio-promo.mp4" as="video" type="video/mp4" />
        <link rel="preconnect" href="https://ext.same-assets.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//ext.same-assets.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//source.unsplash.com" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <AudioProvider>
          <div className="relative min-h-screen">
            <Header />
            <main className="relative">
              {children}
            </main>
            <GlobalAudioPlayer />
          </div>
        </AudioProvider>

        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>

        {/* PWA Install Prompt */}
        <Script id="pwa-install" strategy="afterInteractive">
          {`
            let deferredPrompt;
            let installButton = null;

            window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              deferredPrompt = e;

              // Show install button
              installButton = document.createElement('button');
              installButton.textContent = '📱 Installer l\\'app';
              installButton.className = 'fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors';
              installButton.addEventListener('click', () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                      console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                    if (installButton) {
                      installButton.remove();
                      installButton = null;
                    }
                  });
                }
              });

              // Add button after a delay to not disturb initial experience
              setTimeout(() => {
                if (installButton && deferredPrompt) {
                  document.body.appendChild(installButton);
                }
              }, 10000);
            });

            window.addEventListener('appinstalled', () => {
              console.log('PWA was installed');
              if (installButton) {
                installButton.remove();
                installButton = null;
              }
            });
          `}
        </Script>
      </body>
    </html>
  )
}
