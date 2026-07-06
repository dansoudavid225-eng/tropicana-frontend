'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erreur Tropicana Pio Pio:', error)
  }, [error])

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        {/* Décor */}
        <div style={{ width: 80, height: 80, background: 'var(--navbar-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
         
        </div>

        {/* Titre */}
        <h1 style={{ fontSize: 26, fontWeight: 400, color: 'var(--text-primary)', fontFamily: 'Georgia, serif', marginBottom: 12 }}>
          Quelque chose s'est mal passé
        </h1>

        {/* Message */}
        <p style={{ fontSize: 15, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 32 }}>
          Une erreur inattendue s'est produite. Vous pouvez réessayer ou retourner à l'accueil.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            className="btn-gold"
            style={{ padding: '12px 28px', cursor: 'pointer' }}
          >
            Réessayer
          </button>
          <Link href="/" className="btn-ghost" style={{ padding: '12px 28px' }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
