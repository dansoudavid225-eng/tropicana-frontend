'use client'
import { useLang } from '@/context/LanguageContext'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function RetourPaiementClient() {
  const { lang } = useLang()
  const params = useSearchParams()
  const router = useRouter()
  const commandeId = params.get('commande')
  const statutParam = params.get('status')

  const [statut, setStatut] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading')

  useEffect(() => {
    if (!commandeId) { router.replace('/boutique'); return }

    if (statutParam === 'approved') {
      setStatut('success')
    } else if (statutParam === 'declined' || statutParam === 'canceled') {
      setStatut('failed')
    } else {
      const token = localStorage.getItem('pio_access')
      fetch(`${API_BASE}/commandes/${commandeId}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(r => r.json())
        .then(data => {
          if (data.payee || data.statut === 'confirmee') setStatut('success')
          else if (data.statut === 'annulee') setStatut('failed')
          else setStatut('pending')
        })
        .catch(() => setStatut('pending'))
    }
  }, [commandeId, statutParam, router])

  const container: React.CSSProperties = {
    minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px', background: 'var(--bg-page)',
  }
  const card: React.CSSProperties = {
    background: 'var(--bg-card)', borderRadius: 20, padding: '48px 40px',
    maxWidth: 480, width: '100%', textAlign: 'center',
    border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)',
  }

  if (statut === 'loading') return (
    <div style={container}><div style={card}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
      <h1 style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>Vérification en cours…</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Nous confirmons votre paiement.</p>
    </div></div>
  )

  if (statut === 'success') return (
    <div style={container}><div style={card}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h1 style={{ fontSize: 24, color: 'var(--green-deep)', marginBottom: 8, fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
        Paiement confirmé !
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 8 }}>
        Votre commande <strong>#{commandeId}</strong> a été payée avec succès.
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
        Un email de confirmation vous a été envoyé. Notre équipe vous contactera sous 2h pour la livraison.
      </p>
      <Link href="/espace-client" className="btn-gold" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 50 }}>
        {lang === 'en' ? 'View my orders' : 'Voir mes commandes'}
      </Link>
    </div></div>
  )

  if (statut === 'failed') return (
    <div style={container}><div style={card}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>❌</div>
      <h1 style={{ fontSize: 22, color: '#dc3545', marginBottom: 8 }}>{lang === 'en' ? 'Payment failed' : 'Paiement échoué'}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32 }}>
        Le paiement n&apos;a pas pu être effectué. Votre commande reste en attente — vous pouvez réessayer ou choisir un autre mode de paiement.
      </p>
      <Link href="/boutique" className="btn-gold" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 50 }}>
        Retour à la boutique
      </Link>
    </div></div>
  )

  return (
    <div style={container}><div style={card}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🕐</div>
      <h1 style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>Paiement en attente</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32 }}>
        Votre commande <strong>#{commandeId}</strong> est enregistrée. Notre équipe vous contactera pour confirmer.
      </p>
      <Link href="/espace-client" className="btn-gold" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 50 }}>
        Voir mes commandes
      </Link>
    </div></div>
  )
}
