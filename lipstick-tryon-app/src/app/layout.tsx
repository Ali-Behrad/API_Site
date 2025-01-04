// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; {/* When imported in {}, it means it's exported in the source file*/}
import { Navbar } from '@/components/Navbar';
import Link from "next/link";
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LipColor Tryon',
  description: 'Virtual Lipstick Try-On Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}