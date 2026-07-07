'use client'
import Link from 'next/link'
import { useLang } from '@/context/LanguageContext'

export default function NotFound() {
  const { t } = useLang()

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        {/* Décor */}
        <div style={{ width: 80, height: 80, background: 'var(--navbar-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>
         
        </div>

        {/* Code */}
        <p style={{ fontSize: 80, fontWeight: 400, color: 'var(--border-strong)', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 8 }}>404</p>

        {/* Titre */}
        <h1 style={{ fontSize: 26, fontWeight: 400, color: 'var(--text-primary)', fontFamily: 'Georgia, serif', marginBottom: 12 }}>
          {t('error.pageEvaporee')}
        </h1>

        {/* Sous-titre */}
        <p style={{ fontSize: 15, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 32 }}>
          Comme la vapeur d'une tasse de thé, cette page est introuvable.<br />
          Retournez à l'accueil pour continuer votre visite.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-gold" style={{ padding: '12px 28px' }}>
            {t('error.retourAccueil')}
          </Link>
          <Link href="/boutique" className="btn-ghost" style={{ padding: '12px 28px' }}>
            {t('error.voirBoutique')}
          </Link>
        </div>
      </div>
    </div>
  )
}
