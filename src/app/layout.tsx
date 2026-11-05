import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import './refinements.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kassanabdallah0.github.io'),
  title: 'Abdallah Kassan — Ingénieur logiciel & IA embarquée',
  description:
    'Abdallah Kassan, ingénieur logiciel UTT à Caen. Full Stack, backend, AWS et Edge AI : six réalisations Fastpoint, de React et Node.js à la vision NVIDIA Jetson. CV de référence disponible.',
  alternates: { canonical: '/portofolio/' },
  openGraph: {
    title: 'Abdallah Kassan — Ingénieur logiciel & IA embarquée',
    description:
      'De l’algorithme au monde réel. Logiciel, vision par ordinateur et systèmes embarqués.',
    url: '/portofolio/',
    siteName: 'Abdallah Kassan · Neural Core',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/portofolio/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'Abdallah Kassan — Logiciel. Systèmes intelligents. IA embarquée.',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/portofolio/favicon.svg' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#06090F' };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
