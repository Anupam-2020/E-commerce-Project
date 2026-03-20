import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">E-commerce Frontend</h1>
      <p>Built with Next.js + TypeScript for the existing Node/Express/MySQL backend.</p>
      <Link href="/products" className="inline-block rounded bg-black px-4 py-2 text-white">
        Browse Products
      </Link>
    </div>
  );
}