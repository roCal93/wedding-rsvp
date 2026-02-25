import type { Metadata } from 'next'
import { Cormorant_Garamond, Hurricane } from 'next/font/google'
import './globals.css'
import { cookies, headers } from 'next/headers'
import { defaultLocale } from '@/lib/locales'
import { isDisableDark } from '@/lib/theme'

// Mark layout dynamic since we read cookies/headers for locale detection
export const dynamic = 'force-dynamic'

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
  let locale = defaultLocale

  try {
    const cookieStore = await cookies()
    const cookieLocale = cookieStore.get('locale')?.value
    if (cookieLocale === 'fr' || cookieLocale === 'en') {
      locale = cookieLocale
    } else {
      locale = defaultLocale
    }
  } catch {
    // Fallback: parse header cookie string if cookies() is unavailable
    try {
      const cookieHeader = (await headers()).get('cookie') ?? ''
      const match = cookieHeader.match(/(?:^|; )locale=([^;]+)/)
      const parsedLocale = match ? decodeURIComponent(match[1]) : defaultLocale
      locale =
        parsedLocale === 'fr' || parsedLocale === 'en'
          ? parsedLocale
          : defaultLocale
    } catch {
      locale = defaultLocale
    }
  }

  const disableDark = isDisableDark()

  return (
    <html
      lang={locale}
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
