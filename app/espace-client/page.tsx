'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/context/LanguageContext'
import { useAuth, fetchAvecAuth } from '@/context/AuthContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

type LigneCommande = { id: number; produit_nom: string; quantite: number; sous_total: number }
type Commande = {
  id: number
  statut: string
  statut_affiche: string
  total: number
  mode_paiement: string
  paiement_affiche: string
  ville_livraison: string
  date_commande: string
  lignes: LigneCommande[]
}

// ── Étapes de suivi dans l'ordre ──────────────────────────────────────────────
// ETAPES défini à l'intérieur du composant via une fonction
const getEtapes = (t: (k: string) => string) => [
  { key: 'en_attente',   label: t('espace.etapeRecue'),     emoji: '📋', desc: t('espace.descRecue') },
  { key: 'confirmee',    label: t('espace.etapeConfirmee'), emoji: '✅', desc: t('espace.descConfirmee') },
  { key: 'en_livraison', label: t('espace.etapeLivraison'), emoji: '🚚', desc: t('espace.descLivraison') },
  { key: 'livree',       label: t('espace.etapeLivree'),    emoji: '📦', desc: t('espace.descLivree') },
]

const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  en_attente:   { bg: '#C9973A30', color: '#C9973A' },
  confirmee:    { bg: '#2D6A4F30', color: 'var(--green-mid)' },
  en_livraison: { bg: '#95D5B230', color: 'var(--text-primary)' },
  livree:       { bg: '#1A3C2E30', color: 'var(--text-primary)' },
  annulee:      { bg: '#7F1D1D30', color: '#7F1D1D' },
}

function BarreProgression({ statut }: { statut: string }) {
  const { t } = useLang()
  if (statut === 'annulee') {
    return (
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginTop: 12 }}>
        <p style={{ fontSize: 13, color: '#B91C1C', fontFamily: 'Arial, sans-serif', margin: 0 }}>
          ❌ Cette commande a été annulée. Contactez-nous au <strong>+229 01 95 96 77 62</strong>.
        </p>
      </div>
    )
  }

  const ETAPES = getEtapes(t)
  const indexActuel = ETAPES.findIndex(e => e.key === statut)

  return (
    <div style={{ marginTop: 16, padding: '16px 0 8px' }}>
      {/* Barre de progression */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        {/* Ligne de fond */}
        <div style={{ position: 'absolute', top: '50%', left: '12px', right: '12px', height: 4, background: 'var(--border-light)', borderRadius: 2, transform: 'translateY(-50%)', zIndex: 0 }} />
        {/* Ligne de progression */}
        <div style={{
          position: 'absolute', top: '50%', left: '12px',
          width: indexActuel === 0 ? '0%' : `${(indexActuel / (ETAPES.length - 1)) * 100}%`,
          height: 4, background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
          borderRadius: 2, transform: 'translateY(-50%)', zIndex: 1,
          transition: 'width 0.6s ease',
        }} />
        {/* Points d'étape */}
        {ETAPES.map((etape, i) => {
          const fait     = i <= indexActuel
          const actuelle = i === indexActuel
          return (
            <div key={etape.key} style={{ flex: 1, display: 'flex', justifyContent: i === 0 ? 'flex-start' : i === ETAPES.length - 1 ? 'flex-end' : 'center', zIndex: 2 }}>
              <div style={{
                width: actuelle ? 32 : 24, height: actuelle ? 32 : 24,
                borderRadius: '50%',
                background: fait ? (actuelle ? '#2D6A4F' : '#52B788') : 'var(--bg-card)',
                border: `3px solid ${fait ? '#2D6A4F' : 'var(--border-color)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: actuelle ? 14 : 11,
                transition: 'all 0.4s ease',
                boxShadow: actuelle ? '0 0 0 4px rgba(45,106,79,0.2)' : 'none',
              }}>
                {fait ? (actuelle ? etape.emoji : '✓') : ''}
              </div>
            </div>
          )
        })}
      </div>
      {/* Labels */}
      <div style={{ display: 'flex' }}>
        {ETAPES.map((etape, i) => {
          const fait     = i <= indexActuel
          const actuelle = i === indexActuel
          return (
            <div key={etape.key} style={{ flex: 1, textAlign: i === 0 ? 'left' : i === ETAPES.length - 1 ? 'right' : 'center', paddingTop: 6 }}>
              <div style={{ fontSize: 11, fontWeight: actuelle ? 700 : 500, color: fait ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>
                {etape.label}
              </div>
            </div>
          )
        })}
      </div>
      {/* Message étape actuelle */}
      {indexActuel >= 0 && (
        <div style={{ marginTop: 10, background: 'var(--green-pale)', borderRadius: 8, padding: '8px 12px', borderLeft: '3px solid #2D6A4F' }}>
          <p style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', margin: 0 }}>
            {ETAPES[indexActuel].emoji} {ETAPES[indexActuel].desc}
            {statut === 'livree' && ' — Merci de votre confiance !'}
          </p>
        </div>
      )}
    </div>
  )
}

export default function EspaceClient() {
  const router = useRouter()
  const { user, loading, deconnecter } = useAuth()
  const { lang, t } = useLang()
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [cmdLoading, setCmdLoading] = useState(true)
  const [selectedCmd, setSelectedCmd] = useState<number | null>(null)
  const [dernierRefresh, setDernierRefresh] = useState<Date | null>(null)

  useEffect(() => {
  if (!loading && !user) {
    const timer = setTimeout(() => router.push('/connexion'), 3000)
    return () => clearTimeout(timer)
  }
}, [user, loading, router])

  const chargerCommandes = useCallback(() => {
    if (!user) return
    fetchAvecAuth(`${API_BASE}/commandes/mes/`)
      .then(r => r.json())
      .then(data => {
        setCommandes(Array.isArray(data) ? data : data.results ?? [])
        setDernierRefresh(new Date())
      })
      .catch(() => setCommandes([]))
      .finally(() => setCmdLoading(false))
  }, [user])

  // Chargement initial
  useEffect(() => { chargerCommandes() }, [chargerCommandes])

  // ✅ Auto-refresh toutes les 60 secondes pour les commandes actives
  useEffect(() => {
    const commandesActives = commandes.some(c => !['livree', 'annulee'].includes(c.statut))
    if (!commandesActives) return
    const interval = setInterval(chargerCommandes, 60_000)
    return () => clearInterval(interval)
  }, [commandes, chargerCommandes])

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTop: '3px solid #2D6A4F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>Chargement de votre espace…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>🔒</div>
        <p style={{ fontSize: 15, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Vous devez être connecté pour accéder à votre espace.</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>Redirection vers la connexion…</p>
        <Link href="/connexion" className="btn-gold" style={{ fontSize: 14 }}>Se connecter maintenant →</Link>
      </div>
    )
  }

  const initiales = `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase()
  const dateInscription = user.date_inscription ? new Date(user.date_inscription).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  const handleDeconnexion = () => {
    deconnecter()
    window.location.href = '/'
  }

  return (
    <>
      {/* Header espace client */}
      <section style={{ background: '#1A3C2E', padding: '32px 24px', borderBottom: '1px solid #0D2318' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, background: '#C9973A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', flexShrink: 0 }}>
              {initiales}
            </div>
            <div>
              <p style={{ fontSize: 13, color: 'var(--green-light)', fontFamily: 'Arial, sans-serif', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>Espace client</p>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#F0EBE0', fontFamily: 'Arial, sans-serif' }}>
                Bonjour, {user.prenom} ! 👋
              </h1>
            </div>
          </div>
          <button
            onClick={handleDeconnexion}
            style={{ background: 'transparent', border: '1px solid #2D6A4F', color: 'var(--green-light)', padding: '10px 20px', borderRadius: 6, fontSize: 14, fontFamily: 'Arial, sans-serif', cursor: 'pointer' }}
          >
            Se déconnecter
          </button>
        </div>
      </section>

      <section style={{ background: 'var(--bg-page)', padding: '40px 24px', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Grille principale */}
          <div className="dashboard-grid" style={{ display: 'grid', gap: 24, alignItems: 'start' }}>

            {/* Infos personnelles */}
            <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ background: '#1A3C2E', padding: '16px 22px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F0EBE0', fontFamily: 'Arial, sans-serif' }}>👤 Mes informations</h2>
              </div>
              <div style={{ padding: '20px 22px' }}>
                {[
                  { label: 'Nom complet', value: `${user.prenom} ${user.nom}` },
                  { label: 'Email', value: user.email },
                  { label: 'Téléphone', value: user.telephone },
                  { label: 'Ville', value: user.ville },
                  { label: 'Membre depuis', value: dateInscription },
                ].map(info => (
                  <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0EBE0', flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{info.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>{info.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Commander */}
              <div style={{ background: '#1A3C2E', border: '1px solid #2D6A4F', borderRadius: 14, padding: '24px 22px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#C9973A', fontFamily: 'Arial, sans-serif', marginBottom: 10 }}>🛒 Passer une commande</h2>
                <p style={{ fontSize: 14, color: 'var(--green-light)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 16 }}>
                  Commandez votre Thé Pio Pio — 1 000 FCFA, livraison partout au Bénin.
                </p>
                <Link href="/boutique" className="btn-gold" style={{ fontSize: 14, display: 'block', textAlign: 'center', padding: '12px' }}>
                  Voir la boutique →
                </Link>
              </div>

              {/* Laisser un avis */}
              <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, padding: '24px 22px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', marginBottom: 10 }}>⭐ Laisser un témoignage</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 16 }}>
                  Partagez votre expérience et aidez d'autres familles à découvrir le Thé Pio Pio.
                </p>
                <Link href="/temoignages" className="btn-ghost" style={{ fontSize: 14, display: 'block', textAlign: 'center', padding: '12px' }}>
                  Écrire un avis →
                </Link>
              </div>

              {/* Contact */}
              <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, padding: '24px 22px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', marginBottom: 10 }}>✉️ Besoin d'aide ?</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 16 }}>
                  Notre équipe est disponible Lun–Sam 8h–18h pour toute question.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link href="/contact" style={{ flex: 1, background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'Arial, sans-serif', padding: '10px', borderRadius: 6, textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}>
                    Formulaire
                  </Link>
                  <a href="tel:+2290195967762" style={{ flex: 1, background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'Arial, sans-serif', padding: '10px', borderRadius: 6, textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}>
                    📞 Appeler
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des commandes */}
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>
                🛒 Mes commandes
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {dernierRefresh && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>
                    Mis à jour à {dernierRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <button
                  onClick={chargerCommandes}
                  style={{ fontSize: 13, color: 'var(--green-mid)', background: 'var(--green-pale)', border: '1px solid #2D6A4F40', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'Arial, sans-serif', fontWeight: 600 }}
                >
                  🔄 Actualiser
                </button>
              </div>
            </div>

            {cmdLoading ? (
              <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', fontSize: 14 }}>
                Chargement de vos commandes…
              </div>
            ) : commandes.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, padding: 32, textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', fontSize: 14, marginBottom: 16 }}>Vous n'avez pas encore passé de commande.</p>
                <Link href="/boutique" className="btn-gold" style={{ fontSize: 14 }}>Découvrir la boutique →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {commandes.map(cmd => {
                  const st         = STATUT_COLORS[cmd.statut] || { bg: 'var(--bg-section)', color: 'var(--text-primary)' }
                  const isSelected = selectedCmd === cmd.id
                  return (
                    <div key={cmd.id} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

                      {/* En-tête commande */}
                      <div
                        onClick={() => setSelectedCmd(isSelected ? null : cmd.id)}
                        style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: 10 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>Commande #{cmd.id}</span>
                          <span style={{ fontSize: 12, background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 20, fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>
                            {cmd.statut_affiche}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#C9973A', fontFamily: 'Arial, sans-serif' }}>{Number(cmd.total).toLocaleString()} FCFA</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{new Date(cmd.date_commande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{isSelected ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {/* Détail commande (dépliable) */}
                      {isSelected && (
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #F0EBE0' }}>

                          {/* ✅ Barre de progression */}
                          <BarreProgression statut={cmd.statut} />

                          {/* Détail produits */}
                          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', marginBottom: 6 }}>Détail :</p>
                            {cmd.lignes?.map(l => (
                              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: 'Arial, sans-serif', color: 'var(--text-primary)', padding: '6px 10px', background: 'var(--bg-card-alt)', borderRadius: 8 }}>
                                <span>{l.produit_nom} × {l.quantite}</span>
                                <span style={{ fontWeight: 700, color: '#C9973A' }}>{Number(l.sous_total).toLocaleString()} FCFA</span>
                              </div>
                            ))}
                            <div style={{ borderTop: '1px solid #F0EBE0', paddingTop: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>📍 {cmd.ville_livraison}</span>
                              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>💳 {cmd.paiement_affiche}</span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>Total : {Number(cmd.total).toLocaleString()} FCFA</span>
                            </div>
                          </div>

                          {/* Besoin d'aide */}
                          {!['livree', 'annulee'].includes(cmd.statut) && (
                            <a
                              href={`https://wa.me/2290195967762?text=Bonjour, j'ai une question sur ma commande %23${cmd.id}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13, color: '#25D366', fontFamily: 'Arial, sans-serif', fontWeight: 600, textDecoration: 'none', background: '#F0FFF4', padding: '8px 14px', borderRadius: 8, border: '1px solid #BBF7D0' }}
                            >
                              💬 Suivre via WhatsApp
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </section>

      <style>{`
        .dashboard-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
