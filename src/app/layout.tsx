// Pass-through: each page renders its own <html lang dir> via components/LocalePage.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
