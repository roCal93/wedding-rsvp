import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Vérifier le secret pour la sécurité
  const secret = request.headers.get('x-webhook-secret') || body.secret
  if (
    process.env.REVALIDATE_SECRET &&
    secret !== process.env.REVALIDATE_SECRET
  ) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    // Revalider les tags de cache
    revalidateTag('strapi-pages', {})

    // Revalider les chemins principaux au cas où
    revalidatePath('/', 'layout')

    // Revalidation successfully triggered

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    console.error('Error during revalidation:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
