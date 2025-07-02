import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// app/layout.js
import Link from 'next/link';
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header>
          <Link href="/">Catálogos</Link>
          <Link href="/manuais">Manuais</Link>
        </header>
        {children}
      </body>
    </html>
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Central de Arquivos",
  description: "Central de Arquivos Betta Hidroturbinas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
