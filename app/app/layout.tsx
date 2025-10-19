import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sourdough ↔ Yeast Converter | Baking Great Bread at Home',
  description: 'Convert bread recipes between commercial yeast and sourdough starter with intelligent adjustments for hydration, timing, and technique.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
