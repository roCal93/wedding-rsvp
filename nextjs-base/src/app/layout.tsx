import type { Metadata } from 'next'
import { Cormorant_Garamond, Hurricane } from 'next/font/google'
import './globals.css'
import { isDisableDark } from '@/lib/theme'

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
})

const hurricane = Hurricane({
  variable: '--font-hurricane',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Amanda & Romain',
  description: 'Célébration de notre mariage',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  openGraph: {
    title: 'Amanda & Romain',
    description: 'Célébration de notre mariage',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Mariage', // ← set NEXT_PUBLIC_SITE_NAME in .env
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Site Logo',
      },
    ],
  },
}

import DevPerfProtector from '@/components/dev/DevPerfProtector'
import { SchemaOrg } from '@/components/seo/SchemaOrg'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const disableDark = isDisableDark()

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      data-disable-dark={disableDark ? 'true' : undefined}
      className={`${cormorantGaramond.variable} ${hurricane.variable}`}
    >
      <body className="antialiased">
        {/* Structured data for SEO */}
        <SchemaOrg />
        {/* Dev-only protective wrapper to avoid dev tooling throwing on performance.measure */}
        <DevPerfProtector />
        {children}
      </body>
    </html>
  )
}
