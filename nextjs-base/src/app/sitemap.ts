import type { MetadataRoute } from 'next'

const buildAbsoluteUrl = (path = '/'): string => {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return `${base}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: buildAbsoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
  ]
}
