import Link from 'next/link'

export default function RootNotFound() {
  const title = '404'
  const message = "Cette page n'existe pas."
  const button = "Retour à l'accueil"

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
        {title}
      </h1>

      <p style={{ marginBottom: '1.5rem', color: '#374151' }}>{message}</p>

      <Link
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '500',
        }}
      >
        {button}
      </Link>
    </main>
  )
}
