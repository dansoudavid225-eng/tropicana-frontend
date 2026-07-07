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

const getEtapes = (t: (k: string) => string) => [
  { key: 'en_attente',   label: t('espace.etapeRecue'),     emoji: '', desc: t('espace.descRecue') },
  { key: 'confirmee',    label: t('espace.etapeConfirmee'), emoji: '', desc: t('espace.descConfirmee') },
  { key: 'en_livraison', label: t('espace.etapeLivraison'), emoji: '', desc: t('espace.descLivraison') },
  { key: 'livree',       label: t('espace.etapeLivree'),    emoji: '', desc: t('espace.descLivree') },
]

const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  en_attente:   { bg: '#C9973A30', color: 'var(--gold)' },
  confirmee:    { bg: '#2D6A4F30', color: 'var(--green-mid)' },
  en_livraison: { bg: '#95D5B230', color: 'var(--text-primary)' },
  livree:       { bg: '#1A3C2E30', color: 'var(--text-primary)' },
  annulee:      { bg: '#7F1D1D30', color: '#7F1D1D' },
}

function BarreProgression({ statut }: { statut: string }) {
  const { t } = useLang()
  if (statut === 'annulee') {
    return (
      <div style={{ background: 'var(--bg-error)', border: '1px solid var(--border-error)', borderRadius: 10, padding: '12px 16px', marginTop: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--text-error)', fontFamily: 'Arial, sans-serif', margin: 0 }}>
          {t('espace.commandeAnnulee')} <strong>+229 01 95 96 77 62</strong>.
        </p>
      </div>
    )
  }

  const ETAPES = getEtapes(t)
  const indexActuel = ETAPES.findIndex(e => e.key === statut)

  return (
    <div style={{ marginTop: 16, padding: '16px 0 8px' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ position: 'absolute', top: '50%', left: '12px', right: '12px', height: 4, background: 'var(--border-light)', borderRadius: 2, transform: 'translateY(-50%)', zIndex: 0 }} />
        <div style={{
          position: 'absolute', top: '50%', left: '12px',
          width: indexActuel === 0 ? '0%' : `${(indexActuel / (ETAPES.length - 1)) * 100}%`,
          height: 4, background: 'linear-gradient(90deg, var(--green-mid), #52B788)',
          borderRadius: 2, transform: 'translateY(-50%)', zIndex: 1,
          transition: 'width 0.6s ease',
        }} />
        {ETAPES.map((etape, i) => {
          const fait     = i <= indexActuel
          const actuelle = i === indexActuel
          return (
            <div key={etape.key} style={{ flex: 1, display: 'flex', justifyContent: i === 0 ? 'flex-start' : i === ETAPES.length - 1 ? 'flex-end' : 'center', zIndex: 2 }}>
              <div style={{
                width: actuelle ? 32 : 24, height: actuelle ? 32 : 24,
                borderRadius: '50%',
                background: fait ? (actuelle ? 'var(--green-mid)' : '#52B788') : 'var(--bg-card)',
                border: `3px solid ${fait ? 'var(--green-mid)' : 'var(--border-color)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: actuelle ? 14 : 11,
                transition: 'all 0.4s ease',
                boxShadow: actuelle ? '0 0 0 4px rgba(45,106,79,0.2)' : 'none',
              }}>
                {fait ? (actuelle ? etape.emoji : '') : ''}
              </div>
            </div>
          )
        })}
      </div>
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
      {indexActuel >= 0 && (
        <div style={{ marginTop: 10, background: 'var(--green-pale)', borderRadius: 8, padding: '8px 12px', borderLeft: '3px solid var(--green-mid)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', margin: 0 }}>
            {ETAPES[indexActuel].emoji} {ETAPES[indexActuel].desc}
            {statut === 'livree' && ` — ${t('espace.merciConfiance')}`}
          </p>
        </div>
      )}
    </div>
  )
}

export default function EspaceClient() {
  const router = useRouter()
  const { user, loading, deconnecter, refreshUser } = useAuth()
  const { lang, t } = useLang()
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [cmdLoading, setCmdLoading] = useState(true)
  const [selectedCmd, setSelectedCmd] = useState<number | null>(null)
  const [dernierRefresh, setDernierRefresh] = useState<Date | null>(null)

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ prenom: '', nom: '', telephone: '', ville: '' })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [savingProfil, setSavingProfil] = useState(false)
  const [profilMsg, setProfilMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    if (user) setEditForm({ prenom: user.prenom, nom: user.nom, telephone: user.telephone || '', ville: user.ville || '' })
  }, [user])

  const ouvrirEdition = () => { setEditing(true); setProfilMsg(null) }
  const fermerEdition = () => { setEditing(false); setPhotoFile(null); setPhotoPreview(null); setProfilMsg(null) }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setProfilMsg({ ok: false, text: t('espace.photoFormatInvalide') }); return
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfilMsg({ ok: false, text: t('espace.photoTropLourde') }); return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setProfilMsg(null)
  }

  const enregistrerProfil = async () => {
    setSavingProfil(true)
    setProfilMsg(null)
    try {
      const fd = new FormData()
      fd.append('prenom', editForm.prenom)
      fd.append('nom', editForm.nom)
      fd.append('telephone', editForm.telephone)
      fd.append('ville', editForm.ville)
      if (photoFile) fd.append('photo', photoFile)

      const res = await fetchAvecAuth(`${API_BASE}/auth/profil/`, { method: 'PATCH', body: fd })
      if (res.ok) {
        await refreshUser()
        setProfilMsg({ ok: true, text: t('espace.profilMisAJour') })
        setPhotoFile(null)
        setPhotoPreview(null)
        setTimeout(() => setEditing(false), 1200)
      } else {
        setProfilMsg({ ok: false, text: t('espace.profilErreur') })
      }
    } catch {
      setProfilMsg({ ok: false, text: t('espace.profilErreurReseau') })
    } finally {
      setSavingProfil(false)
    }
  }

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

  useEffect(() => { chargerCommandes() }, [chargerCommandes])

  useEffect(() => {
    const commandesActives = commandes.some(c => !['livree', 'annulee'].includes(c.statut))
    if (!commandesActives) return
    const interval = setInterval(chargerCommandes, 60_000)
    return () => clearInterval(interval)
  }, [commandes, chargerCommandes])

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTop: '3px solid var(--green-mid)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{t('espace.chargementEspace')}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}></div>
        <p style={{ fontSize: 15, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>{t('espace.doigtConnecte')}</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{t('espace.redirection')}</p>
        <Link href="/connexion" className="btn-gold" style={{ fontSize: 14 }}>{t('espace.connecterMaintenant')}</Link>
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
      <section style={{ background: 'var(--green-deep)', padding: '32px 24px', borderBottom: '1px solid var(--green-deep)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>
              {user.photo_affichee
                ? <img src={user.photo_affichee} alt={user.prenom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initiales}
            </div>
            <div>
              <p style={{ fontSize: 13, color: 'var(--green-light)', fontFamily: 'Arial, sans-serif', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>{t('espace.espClient')}</p>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-inverse)', fontFamily: 'Arial, sans-serif' }}>
                {t('espace.bonjour')}, {user.prenom} !
              </h1>
            </div>
          </div>
          <button
            onClick={handleDeconnexion}
            style={{ background: 'transparent', border: '1px solid var(--green-mid)', color: 'var(--green-light)', padding: '10px 20px', borderRadius: 6, fontSize: 14, fontFamily: 'Arial, sans-serif', cursor: 'pointer' }}
          >
            {t('espace.deconnexion')}
          </button>
        </div>
      </section>

      <section style={{ background: 'var(--bg-page)', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

          <div className="dashboard-grid" style={{ display: 'grid', gap: 24, alignItems: 'start' }}>

            <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ background: 'var(--green-deep)', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-inverse)', fontFamily: 'Arial, sans-serif', margin: 0 }}>{t('espace.mesInfos')}</h2>
                {!editing && (
                  <button onClick={ouvrirEdition} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontFamily: 'Arial, sans-serif', cursor: 'pointer', fontWeight: 700 }}>
                    {t('espace.modifierInfos')}
                  </button>
                )}
              </div>

              {!editing ? (
                <div style={{ padding: '20px 22px' }}>
                  {[
                    { label: t('espace.nomComplet'), value: `${user.prenom} ${user.nom}` },
                    { label: t('espace.email'), value: user.email },
                    { label: t('espace.tel'), value: user.telephone },
                    { label: t('espace.ville'), value: user.ville },
                    { label: t('espace.membreDepuis'), value: dateInscription },
                  ].map(info => (
                    <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{info.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>{info.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>
                      {photoPreview
                        ? <img src={photoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : user.photo_affichee
                          ? <img src={user.photo_affichee} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : initiales}
                    </div>
                    <label style={{ fontSize: 13, color: 'var(--green-mid)', fontFamily: 'Arial, sans-serif', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: 6 }}>
                      {t('espace.changerPhoto')}
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} style={{ display: 'none' }} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', marginBottom: 4 }}>{t('espace.prenom')}</label>
                      <input value={editForm.prenom} onChange={e => setEditForm(f => ({ ...f, prenom: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border-color)', borderRadius: 6, fontSize: 14, background: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', marginBottom: 4 }}>{t('espace.nom')}</label>
                      <input value={editForm.nom} onChange={e => setEditForm(f => ({ ...f, nom: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border-color)', borderRadius: 6, fontSize: 14, background: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', marginBottom: 4 }}>{t('espace.telephone')}</label>
                    <input value={editForm.telephone} onChange={e => setEditForm(f => ({ ...f, telephone: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border-color)', borderRadius: 6, fontSize: 14, background: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', marginBottom: 4 }}>{t('espace.ville')}</label>
                    <input value={editForm.ville} onChange={e => setEditForm(f => ({ ...f, ville: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border-color)', borderRadius: 6, fontSize: 14, background: 'var(--bg-card)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
                  </div>

                  {profilMsg && (
                    <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, fontFamily: 'Arial, sans-serif', background: profilMsg.ok ? 'var(--green-pale)' : 'var(--bg-error)', color: profilMsg.ok ? 'var(--green-mid)' : 'var(--text-error)' }}>
                      {profilMsg.text}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button onClick={enregistrerProfil} disabled={savingProfil}
                      style={{ flex: 1, background: 'var(--green-mid)', color: 'var(--text-inverse)', border: 'none', padding: '11px', borderRadius: 6, fontSize: 14, fontFamily: 'Arial, sans-serif', fontWeight: 700, cursor: savingProfil ? 'not-allowed' : 'pointer', opacity: savingProfil ? 0.7 : 1 }}>
                      {savingProfil ? t('espace.enregistrement') : t('espace.enregistrer')}
                    </button>
                    <button onClick={fermerEdition} disabled={savingProfil}
                      style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '11px 20px', borderRadius: 6, fontSize: 14, fontFamily: 'Arial, sans-serif', cursor: 'pointer' }}>
                      {t('espace.annuler')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div style={{ background: 'var(--green-deep)', border: '1px solid var(--green-mid)', borderRadius: 14, padding: '24px 22px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Arial, sans-serif', marginBottom: 10 }}>{t('espace.passerCmd')}</h2>
                <p style={{ fontSize: 14, color: 'var(--green-light)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 16 }}>
                  {t('espace.descCommander')}
                </p>
                <Link href="/boutique" className="btn-gold" style={{ fontSize: 14, display: 'block', textAlign: 'center', padding: '12px' }}>
                  {t('espace.voirBoutique')}
                </Link>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, padding: '24px 22px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', marginBottom: 10 }}>{t('espace.laisserAvis')}</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 16 }}>
                  {t('espace.descAvis')}
                </p>
                <Link href="/temoignages" className="btn-ghost" style={{ fontSize: 14, display: 'block', textAlign: 'center', padding: '12px' }}>
                  {t('espace.ecrireAvis')}
                </Link>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, padding: '24px 22px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', marginBottom: 10 }}>{t('espace.besoinAide')}</h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 16 }}>
                  {t('espace.descAide')}
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link href="/contact" style={{ flex: 1, background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'Arial, sans-serif', padding: '10px', borderRadius: 6, textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}>
                    {t('espace.formulaire')}
                  </Link>
                  <a href="tel:+2290195967762" style={{ flex: 1, background: 'var(--bg-page)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'Arial, sans-serif', padding: '10px', borderRadius: 6, textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}>
                    {t('espace.appeler')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>
                {t('espace.mesCommandes')}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {dernierRefresh && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>
                    {t('espace.misAJour')} {dernierRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <button
                  onClick={chargerCommandes}
                  style={{ fontSize: 13, color: 'var(--green-mid)', background: 'var(--green-pale)', border: '1px solid #2D6A4F40', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'Arial, sans-serif', fontWeight: 600 }}
                >
                  {t('espace.actualiser')}
                </button>
              </div>
            </div>

            {cmdLoading ? (
              <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', fontSize: 14 }}>
                {t('espace.chargementCmd')}
              </div>
            ) : commandes.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, padding: 32, textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', fontSize: 14, marginBottom: 16 }}>{t('espace.aucuneCmd')}</p>
                <Link href="/boutique" className="btn-gold" style={{ fontSize: 14 }}>{t('espace.decouvrirBtq')}</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {commandes.map(cmd => {
                  const st         = STATUT_COLORS[cmd.statut] || { bg: 'var(--bg-section)', color: 'var(--text-primary)' }
                  const isSelected = selectedCmd === cmd.id
                  return (
                    <div key={cmd.id} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-color)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

                      <div
                        onClick={() => setSelectedCmd(isSelected ? null : cmd.id)}
                        style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: 10 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>{t('espace.commandeHash')}{cmd.id}</span>
                          <span style={{ fontSize: 12, background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 20, fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>
                            {cmd.statut_affiche}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Arial, sans-serif' }}>{Number(cmd.total).toLocaleString()} FCFA</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{new Date(cmd.date_commande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{isSelected ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--text-inverse)' }}>

                          <BarreProgression statut={cmd.statut} />

                          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', marginBottom: 6 }}>{t('espace.detail')}</p>
                            {cmd.lignes?.map(l => (
                              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: 'Arial, sans-serif', color: 'var(--text-primary)', padding: '6px 10px', background: 'var(--bg-card-alt)', borderRadius: 8 }}>
                                <span>{l.produit_nom} × {l.quantite}</span>
                                <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{Number(l.sous_total).toLocaleString()} FCFA</span>
                              </div>
                            ))}
                            <div style={{ borderTop: '1px solid var(--text-inverse)', paddingTop: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{cmd.ville_livraison}</span>
                              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{cmd.paiement_affiche}</span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>{t('espace.total')} {Number(cmd.total).toLocaleString()} FCFA</span>
                            </div>
                          </div>

                          {!['livree', 'annulee'].includes(cmd.statut) && (
                            <a
                              href={`https://wa.me/2290195967762?text=${encodeURIComponent(`Bonjour, j'ai une question sur ma commande #${cmd.id}`)}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13, color: '#25D366', fontFamily: 'Arial, sans-serif', fontWeight: 600, textDecoration: 'none', background: '#F0FFF4', padding: '8px 14px', borderRadius: 8, border: '1px solid #BBF7D0' }}
                            >
                              {t('espace.suivreWhatsApp')}
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .dashboard-grid > div { animation:fadeUp .5s ease both; }
        .dashboard-grid > div:nth-child(1) { animation-delay:.1s; }
        .dashboard-grid > div:nth-child(2) { animation-delay:.25s; }
        [class*="commande"] { transition:all .25s; }
        [class*="commande"]:hover { border-color:rgba(201,151,58,0.3) !important; }
        .dashboard-grid button:not(:disabled):hover { transform:translateY(-1px); transition:all .2s; }
      `}</style>
    </>
  )
}
