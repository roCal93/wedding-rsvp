'use client'

import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  const segments = pathname?.split('/').filter(Boolean) || []
  const locale =
    segments[0] === 'en' || segments[0] === 'fr' ? segments[0] : 'fr'

  const content = {
    fr: {
      title: '404',
      message: "Cette page n'existe pas.",
    },
    en: {
      title: '404',
      message: "This page doesn't exist.",
    },
  }

  const text = content[locale as 'fr' | 'en']

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
      aria-labelledby="notfound-title"
    >
      <h1
        id="notfound-title"
        style={{ fontSize: '3rem', marginBottom: '1rem' }}
      >
        {text.title}
      </h1>
      <p style={{ color: '#374151' }}>{text.message}</p>
    </main>
  )
}
