import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page introuvable — Tropicana Pio Pio',
}

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        {/* Décor */}
        <div style={{ width: 80, height: 80, background: '#1A3C2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
          🍃
        </div>

        {/* Code */}
        <p style={{ fontSize: 80, fontWeight: 400, color: '#D4C9B0', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 8 }}>404</p>

        {/* Titre */}
        <h1 style={{ fontSize: 26, fontWeight: 400, color: '#1A3C2E', fontFamily: 'Georgia, serif', marginBottom: 12 }}>
          Cette page s'est évaporée…
        </h1>

        {/* Sous-titre */}
        <p style={{ fontSize: 15, color: '#7A6A5A', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 32 }}>
          Comme la vapeur d'une tasse de thé, cette page est introuvable.<br />
          Retournez à l'accueil pour continuer votre visite.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-gold" style={{ padding: '12px 28px' }}>
            ← Retour à l'accueil
          </Link>
          <Link href="/boutique" className="btn-ghost" style={{ padding: '12px 28px' }}>
            🛒 Voir la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}
