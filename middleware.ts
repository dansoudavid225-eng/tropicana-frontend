import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROUTES_PROTEGEES = ['/espace-client']
const ROUTES_AUTH_SEULEMENT = ['/connexion', '/inscription']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Récupérer le token depuis le cookie (plus sécurisé que localStorage)
  const token = request.cookies.get('pio_access')?.value
  const userCookie = request.cookies.get('pio_user')?.value

  // Vérifier si la route est protégée
  const routeProtegee = ROUTES_PROTEGEES.some(r => pathname.startsWith(r))
  const routeAuthSeulement = ROUTES_AUTH_SEULEMENT.some(r => pathname.startsWith(r))

  // Rediriger vers /connexion si pas de token sur route protégée
  if (routeProtegee && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/connexion'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // /admin-panel : la page gère elle-même la vérification is_staff

  // Rediriger vers accueil si déjà connecté et tente d'accéder à login/inscription
  if (routeAuthSeulement && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // En-têtes de sécurité sur toutes les réponses
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' http://localhost:8000 https:; frame-src https://www.google.com https://maps.google.com;"
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
