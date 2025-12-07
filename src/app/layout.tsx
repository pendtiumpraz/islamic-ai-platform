import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Tahfidz.ai - Hafal Quran, Hadits & Matan dengan AI',
  description:
    "Platform hafalan Al-Quran, Hadits, dan Matan dengan teknologi AI. Setoran otomatis, muroja'ah terjadwal, dan tracking progress untuk santri dan pesantren.",
  keywords: 'hafalan quran, tahfidz, AI quran, hafal hadits, matan, pesantren digital, islamic app',
  authors: [{ name: 'Galih' }],
  openGraph: {
    title: 'Tahfidz.ai - Hafal Quran, Hadits & Matan dengan AI',
    description: 'Platform hafalan dengan teknologi AI untuk santri dan pesantren',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
