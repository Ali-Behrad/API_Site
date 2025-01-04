// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-pink-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          LipColor Tryon
        </Link>
        <div className="space-x-4">
          <Link 
            href="/" 
            className={`hover:underline ${pathname === '/' ? 'font-bold' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/try-on" 
            className={`hover:underline ${pathname === '/try-on' ? 'font-bold' : ''}`}
          >
            Try On
          </Link>
          {pathname === '/output' && (
            <Link 
              href="/output" 
              className="hover:underline font-bold"
            >
              Result
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}