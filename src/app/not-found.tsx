import Link from 'next/link';
import '@fontsource-variable/inter';
import './globals.css';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <main className="text-center">
          <h1 className="text-6xl font-extrabold">404</h1>
          <p className="mt-4">
            <Link href="/en/" className="underline">
              Go to the homepage
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
