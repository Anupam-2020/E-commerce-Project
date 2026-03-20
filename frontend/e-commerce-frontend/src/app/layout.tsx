import './globals.css';
import type { Metadata } from 'next';
import Providers from './provider';
import Navbar from '@/components/common/Navbar';

export const metadata: Metadata = {
    title: 'E-commerce App',
    description: 'Next.js TypeScript frontend',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <html lang="en">
        <body>
          <Providers>
            <Navbar />
            <main className="mx-auto max-w-6xl p-6">{children}</main>
          </Providers>
        </body>
      </html>
    );
}