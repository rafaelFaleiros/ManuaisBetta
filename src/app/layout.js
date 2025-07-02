import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata = {
  title: 'Central de Arquivos',
  description: 'Central de Arquivos Betta Hidroturbinas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-blue-800 text-white p-4 flex gap-6">
          <Link href="/" className="hover:underline">Catálogos</Link>
          <Link href="/manuais" className="hover:underline">Manuais</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
