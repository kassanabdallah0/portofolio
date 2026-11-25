import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import './liquid-glass.css';
import './engineering-lab.css';
import './engineering-3d.css';
import './engineering-fleet.css';
import './engineering-software.css';
import './vision.css';
import './hero.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kassanabdallah0.github.io'),
  title: 'Abdallah Kassan — Ingénieur logiciel Full Stack & Backend',
  description:
    'Ingénieur logiciel Full Stack et Backend à Caen, diplômé de l’UTT. Interfaces React, API Node.js et Python, déploiement et maintenance sur AWS et NVIDIA Jetson. Réalisations professionnelles et CV de référence.',
  alternates: { canonical: '/portofolio/' },
  openGraph: {
    title: 'Abdallah Kassan — Ingénieur logiciel Full Stack & Backend',
    description:
      'Interfaces React, API Node.js et Python, logiciels en production sur AWS et Jetson. Découvrez mes réalisations chez Fastpoint.',
    url: '/portofolio/',
    siteName: 'Abdallah Kassan · Ingénierie logicielle',
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
export const viewport: Viewport = { themeColor: '#F6F7F8' };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
