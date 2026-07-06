'use client'
import React, { useState, useEffect, useCallback } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

type Bienfait = { id: string; icon: string; title: string; desc: string }
type HistoireSection = { num: string; title: string; text: string }
type BlogArticle = { slug: string; cat: string; date: string; title: string; excerpt: string; img: string; read: string; contenu?: string }
type Partenaire = { id: string; nom: string; logo: string; lien: string; tag: string }
type StatItem = { num: string; label: string; icon: string; desc: string }
type TemoignageRapide = { texte: string; nom: string; ville: string }
type Argument = { icon: string; title: string; sub: string }
type SiteContent = {
  hero_badge: string; hero_titre: string; hero_titre_em: string
  hero_sous_titre: string; hero_sous_titre_em: string; hero_btn1: string; hero_btn2: string
  arguments: Argument[]
  plante_label: string; plante_titre: string; plante_titre_em: string
  plante_texte: string; plante_points: string[]
  bienfaits_label: string; bienfaits_titre: string; bienfaits: Bienfait[]
  tasse_label: string; tasse_citation: string; tasse_citation_em: string; tasse_btn: string
  fondateur_label: string; fondateur_titre: string; fondateur_citation: string
  fondateur_nom: string; fondateur_sous: string; fondateur_btn: string
  stats_bandeau: string; stats: StatItem[]; temoignages_rapides: TemoignageRapide[]
  histoire_hero_label: string; histoire_hero_titre: string; histoire_hero_titre_em: string
  histoire_sections: HistoireSection[]; histoire_citation: string
  histoire_fondateur_nom: string; histoire_fondateur_sous: string
  histoire_missions: { icon: string; text: string }[]
  blog_articles: BlogArticle[]
  partenaires: Partenaire[]
  annonces: string[]
  footer_slogan: string; footer_cta_pre: string; footer_cta_titre: string
  footer_cta_btn: string; footer_adresse: string; footer_horaires: string; footer_copyright: string
  couleur_vert: string; couleur_or: string; couleur_creme: string; couleur_fonce: string
}
type Commande = { id: number; nom_client: string; email_client: string; telephone_client: string; ville_livraison: string; statut: string; total: number; date_commande: string; lignes: { id: number; produit_nom: string; quantite: number; sous_total: number }[] }
type Produit = { id: number; nom: string; slug: string; description: string; prix: number; unite: string; badge: string; image: string | null; disponible: boolean; quantite_min: number }
type Temoignage = { id: number; nom: string; ville: string; note: number; texte: string; approuve: boolean; date_creation: string }
type Message = { id: number; nom: string; email: string; telephone?: string; objet?: string; message: string; lu: boolean; date_envoi: string }
type Utilisateur = { id: number; prenom: string; nom: string; email: string; telephone?: string; ville?: string; date_inscription: string; is_staff: boolean }
type Section = 'dashboard' | 'commandes' | 'produits' | 'temoignages' | 'messages' | 'utilisateurs' | 'newsletter' | 'hero' | 'arguments' | 'plante' | 'bienfaits' | 'tasse' | 'fondateur' | 'stats' | 'histoire' | 'blog' | 'partenaires' | 'annonces' | 'footer' | 'contact' | 'accueilConfig' | 'couleurs' | 'promo' | 'zones' | 'blacklist' | 'alertes' | 'rapport'

const STATUT_LABELS: Record<string, string> = { en_attente: 'En attente', confirmee: 'Confirmee', en_livraison: 'En livraison', livree: 'Livree', annulee: 'Annulee' }
const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  en_attente: { bg: '#FFF7ED', color: '#C2410C' }, confirmee: { bg: 'var(--admin-success-bg)', color: '#15803D' },
  en_livraison: { bg: '#EFF6FF', color: '#1D4ED8' }, livree: { bg: 'var(--admin-success-bg)', color: '#166534' }, annulee: { bg: '#FFF1F2', color: '#BE123C' }
}

const NAV: { s: Section; label: string; group: string }[] = [
  { s: 'dashboard', label: 'Dashboard', group: 'General' },
  { s: 'commandes', label: 'Commandes', group: 'General' },
  { s: 'produits', label: 'Produits', group: 'General' },
  { s: 'temoignages', label: 'Temoignages', group: 'General' },
  { s: 'messages', label: 'Messages', group: 'General' },
  { s: 'utilisateurs', label: 'Utilisateurs', group: 'General' },
  { s: 'newsletter', label: 'Newsletter', group: 'General' },
  { s: 'hero', label: 'Hero', group: 'Site' },
  { s: 'arguments', label: '4 Arguments', group: 'Site' },
  { s: 'plante', label: 'La Plante', group: 'Site' },
  { s: 'bienfaits', label: 'Bienfaits', group: 'Site' },
  { s: 'tasse', label: 'Section Tasse', group: 'Site' },
  { s: 'fondateur', label: 'Fondateur', group: 'Site' },
  { s: 'stats', label: 'Chiffres', group: 'Site' },
  { s: 'histoire', label: 'Histoire', group: 'Site' },
  { s: 'blog', label: 'Blog', group: 'Site' },
  { s: 'partenaires', label: 'Partenaires', group: 'Site' },
  { s: 'annonces', label: 'Annonces', group: 'Site' },
  { s: 'footer', label: 'Footer', group: 'Site' },
  { s: 'contact', label: 'Contact & Prix', group: 'Site' },
  { s: 'accueilConfig', label: 'CTA & Accueil', group: 'Site' },
  { s: 'couleurs',   label: 'Couleurs',      group: 'Site' },
  { s: 'promo',      label: 'Codes promo',  group: 'Gestion' },
  { s: 'zones',      label: 'Livraison',     group: 'Gestion' },
  { s: 'blacklist',  label: 'Blacklist',      group: 'Gestion' },
  { s: 'alertes',    label: 'Alertes stock',  group: 'Gestion' },
  { s: 'rapport',    label: 'Rapport PDF',    group: 'Gestion' },
]

const TITLES: Record<Section, string> = {
  dashboard: 'Dashboard', commandes: 'Commandes', produits: 'Produits',
  temoignages: 'Temoignages', messages: 'Messages', utilisateurs: 'Utilisateurs',
  newsletter: 'Newsletter', hero: 'Hero et Accueil', arguments: 'Les 4 Arguments',
  plante: 'La Plante', bienfaits: 'Les Bienfaits', tasse: 'Section Tasse',
  fondateur: 'Bloc Fondateur', stats: 'Chiffres et Avis', histoire: 'Page Histoire',
  blog: 'Blog Articles', partenaires: 'Partenaires', annonces: 'Barre annonces',
  footer: 'Pied de page', contact: 'Contact & Prix', accueilConfig: 'CTA & Accueil', couleurs: 'Palette couleurs',
  promo: 'Codes Promo', zones: 'Zones Livraison', blacklist: 'Liste Noire',
  alertes: 'Alertes Stock', rapport: 'Rapport PDF',
}

const ah = (t: string) => ({ Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' })
const fd = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
const fm = (n: number | string) => Number(n).toLocaleString('fr-FR') + ' FCFA'
const uid = () => Math.random().toString(36).slice(2, 8)

const IS: React.CSSProperties = { width: '100%', border: '1.5px solid var(--admin-border)', borderRadius: 8, padding: '9px 12px', fontSize: 14, background: 'var(--admin-bg)', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
const CS: React.CSSProperties = { background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 16 }
const BG: React.CSSProperties = { background: 'var(--green-mid)', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }
const BR: React.CSSProperties = { background: '#FEF2F2', color: 'var(--admin-danger)', border: '1px solid #FECACA', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const BGR: React.CSSProperties = { background: 'var(--admin-bg-alt)', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }

function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12 }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: '3px solid var(--admin-border)', borderTopColor: 'var(--green-mid)', animation: 'spin .7s linear infinite' }} />
      <span style={{ color: 'var(--admin-text-muted)', fontSize: 14 }}>Chargement...</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function Empty({ msg }: { msg: string }) {
  return <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--admin-text-faint)', fontSize: 14 }}>{msg}</div>
}

function Badge({ statut }: { statut: string }) {
  const c = STATUT_COLORS[statut] || { bg: '#F3F4F6', color: '#374151' }
  return <span style={{ background: c.bg, color: c.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>{STATUT_LABELS[statut] || statut}</span>
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: ok ? 'var(--green-mid)' : 'var(--admin-danger)', color: 'var(--admin-card)', padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,.2)' }}>
      {msg}
    </div>
  )
}

function FL({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-muted)', display: 'block', marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  )
}

function Inp({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input style={IS} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
}

function Txta({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea style={{ ...IS, minHeight: rows * 28, resize: 'vertical' } as React.CSSProperties} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
}

function SaveBar({ onSave, saving, label = '' }: { onSave: () => void; saving: boolean; label?: string }) {
  return (
    <div style={{ position: 'sticky', bottom: 0, background: 'rgba(255,255,255,.95)', borderTop: '1px solid var(--admin-border)', padding: '14px 0', display: 'flex', justifyContent: 'flex-end', marginTop: 8, zIndex: 10 }}>
      <button onClick={onSave} style={{ ...BG, padding: '11px 28px', fontSize: 14 }} disabled={saving}>
        {saving ? 'Sauvegarde...' : 'Sauvegarder ' + label}
      </button>
    </div>
  )
}

function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErr('')
    try {
      const res = await fetch(`${API}/auth/connexion/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe: mdp }),
      })
      const data = await res.json()
      if (!res.ok || !data.utilisateur?.is_staff) {
        setErr(data.detail || 'Acces refuse - admin uniquement')
        setSubmitting(false)
        return
      }
      onLogin(data.access)
    } catch {
      setErr('Erreur reseau.')
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0D2318,#1A3C2E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--admin-card)', borderRadius: 20, padding: 40, width: '100%', maxWidth: 380, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8, color: 'var(--green-mid)', fontWeight: 900 }}>PIO</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--navbar-bg)', margin: '0 0 4px' }}>Admin Tropicana</h1>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', margin: 0 }}>Panneau administration</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Inp value={email} onChange={setEmail} placeholder="Email admin" type="email" />
          <Inp value={mdp} onChange={setMdp} placeholder="Mot de passe" type="password" />
          {err && <div style={{ background: '#FEF2F2', color: 'var(--admin-danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>{err}</div>}
          <button type="submit" style={{ ...BG, padding: '12px', fontSize: 15 }} disabled={submitting}>
            {submitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

function useConfig(token: string) {
  const [config, setConfig] = useState<Partial<SiteContent>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetch(`${API}/admin/config/`, { headers: ah(token) })
      .then(r => r.ok ? r.json() : {})
      .then(d => { setConfig(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const save = useCallback(async (patch: Partial<SiteContent>) => {
    setSaving(true)
    try {
      // Relit la config actuelle depuis le serveur avant de fusionner,
      // pour éviter d'écraser des changements faits depuis un autre onglet
      // avec une version périmée gardée en mémoire locale.
      const fresh = await fetch(`${API}/admin/config/`, { headers: ah(token) })
        .then(r => r.ok ? r.json() : config)
        .catch(() => config)
      const next = { ...fresh, ...patch }
      const res = await fetch(`${API}/admin/config/`, { method: 'POST', headers: ah(token), body: JSON.stringify(next) })
      setSaving(false)
      if (res.ok) {
        setConfig(next)
        showToast('Sauvegarde reussie !', true)
      } else {
        showToast('Erreur de sauvegarde', false)
      }
    } catch {
      setSaving(false)
      showToast('Erreur de sauvegarde', false)
    }
  }, [config, token])

  return { config, loading, saving, save, toast }
}

function SectionHero({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [f, setF] = useState<Partial<SiteContent>>({})
  useEffect(() => { if (!loading) setF(config) }, [loading, config])
  const upd = (k: keyof SiteContent, v: string) => setF(p => ({ ...p, [k]: v }))
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Textes principaux</h3>
          <FL label="Badge"><Inp value={f.hero_badge || ''} onChange={v => upd('hero_badge', v)} placeholder="100% Bio - Porto-Novo, Benin" /></FL>
          <FL label="Titre normal"><Inp value={f.hero_titre || ''} onChange={v => upd('hero_titre', v)} placeholder="La nature africaine" /></FL>
          <FL label="Titre italique dore"><Inp value={f.hero_titre_em || ''} onChange={v => upd('hero_titre_em', v)} placeholder="dans votre tasse" /></FL>
          <FL label="Sous-titre"><Txta value={f.hero_sous_titre || ''} onChange={v => upd('hero_sous_titre', v)} rows={2} /></FL>
          <FL label="Sous-titre dore"><Inp value={f.hero_sous_titre_em || ''} onChange={v => upd('hero_sous_titre_em', v)} /></FL>
        </div>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Boutons</h3>
          <FL label="Bouton 1 commander"><Inp value={f.hero_btn1 || ''} onChange={v => upd('hero_btn1', v)} placeholder="Commander des 1 000 FCFA" /></FL>
          <FL label="Bouton 2 histoire"><Inp value={f.hero_btn2 || ''} onChange={v => upd('hero_btn2', v)} placeholder="Notre histoire" /></FL>
          <div style={{ marginTop: 20, padding: 14, background: 'var(--admin-success-bg)', borderRadius: 8, fontSize: 12, color: '#166534' }}>
            Photo de fond : /public/images/hero-plantation.jpg
          </div>
        </div>
      </div>
      <SaveBar onSave={() => save(f)} saving={saving} label="le Hero" />
    </div>
  )
}

function SectionArguments({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [items, setItems] = useState<Argument[]>([])
  useEffect(() => {
    if (!loading) setItems(config.arguments || [
      { icon: '', title: '100% Bio', sub: 'Sans engrais' },
      { icon: '', title: 'Science', sub: 'Veterinaire' },
      { icon: '', title: 'Famille', sub: 'Des 2 ans' },
      { icon: '', title: 'Made in Benin', sub: 'Livraison nationale' },
    ])
  }, [loading, config])
  const upd = (i: number, k: keyof Argument, v: string) => setItems(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x))
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--admin-text)' }}>Les 4 arguments</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {items.map((item, i) => (
            <div key={i} style={{ border: '1px solid var(--admin-border)', borderRadius: 10, padding: 14, background: 'var(--admin-bg)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-muted)', marginBottom: 10 }}>ARGUMENT {i + 1}</div>
              <FL label="Emoji ou icone"><Inp value={item.icon} onChange={v => upd(i, 'icon', v)} placeholder="emoji" /></FL>
              <FL label="Titre"><Inp value={item.title} onChange={v => upd(i, 'title', v)} /></FL>
              <FL label="Sous-titre"><Inp value={item.sub} onChange={v => upd(i, 'sub', v)} /></FL>
            </div>
          ))}
        </div>
      </div>
      <SaveBar onSave={() => save({ arguments: items })} saving={saving} label="les arguments" />
    </div>
  )
}

function SectionPlante({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [f, setF] = useState<Partial<SiteContent>>({})
  const [points, setPoints] = useState<string[]>([])
  useEffect(() => {
    if (!loading) {
      setF(config)
      setPoints(config.plante_points || [])
    }
  }, [loading, config])
  const upd = (k: keyof SiteContent, v: string) => setF(p => ({ ...p, [k]: v }))
  const updP = (i: number, v: string) => setPoints(p => p.map((x, j) => j === i ? v : x))
  const addP = () => setPoints(p => [...p, ''])
  const delP = (i: number) => setPoints(p => p.filter((_, j) => j !== i))
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Textes section plante</h3>
          <FL label="Label"><Inp value={f.plante_label || ''} onChange={v => upd('plante_label', v)} /></FL>
          <FL label="Titre"><Inp value={f.plante_titre || ''} onChange={v => upd('plante_titre', v)} /></FL>
          <FL label="Titre italique"><Inp value={f.plante_titre_em || ''} onChange={v => upd('plante_titre_em', v)} /></FL>
          <FL label="Texte descriptif"><Txta value={f.plante_texte || ''} onChange={v => upd('plante_texte', v)} rows={5} /></FL>
        </div>
        <div style={CS}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--navbar-bg)' }}>Points forts</h3>
            <button onClick={addP} style={BG}>+ Ajouter</button>
          </div>
          {points.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--green-mid)', color: 'var(--admin-card)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
              <input style={{ ...IS, flex: 1 }} value={p} onChange={e => updP(i, e.target.value)} placeholder="Point fort..." />
              <button onClick={() => delP(i)} style={{ ...BR, padding: '8px 10px' }}>X</button>
            </div>
          ))}
        </div>
      </div>
      <SaveBar onSave={() => save({ ...f, plante_points: points })} saving={saving} label="La Plante" />
    </div>
  )
}

function SectionBienfaits({ token }: { token: string }) {
  type BItem = { id: number; icone: string; titre: string; description: string; ordre: number; actif: boolean }
  const [items, setItems] = useState<BItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const showToast = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }
  const h = useCallback((t: string) => ({ Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }), [])

  useEffect(() => {
    fetch(`${API}/admin/bienfaits/`, { headers: h(token) })
      .then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : d.results ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token, h])

  const add = () => setItems(p => [...p, { id: 0, icone: '', titre: '', description: '', ordre: p.length, actif: true }])
  const upd = (i: number, k: keyof BItem, v: any) => setItems(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x))

  const saveAll = async () => {
    setSaving(true)
    try {
      for (const item of items) {
        const body = { icone: item.icone, titre: item.titre, description: item.description, ordre: item.ordre, actif: item.actif }
        if (item.id === 0) {
          const r = await fetch(`${API}/admin/bienfaits/`, { method: 'POST', headers: h(token), body: JSON.stringify(body) })
          if (r.ok) { const d = await r.json(); setItems(p => p.map(x => x === item ? d : x)) }
        } else {
          await fetch(`${API}/admin/bienfaits/${item.id}/`, { method: 'PATCH', headers: h(token), body: JSON.stringify(body) })
        }
      }
      showToast('Bienfaits sauvegardés', true)
    } catch { showToast('Erreur de sauvegarde', false) }
    setSaving(false)
  }

  const del = async (item: BItem, i: number) => {
    if (item.id !== 0) await fetch(`${API}/admin/bienfaits/${item.id}/`, { method: 'DELETE', headers: h(token) })
    setItems(p => p.filter((_, j) => j !== i))
    showToast('Bienfait supprimé', true)
  }

  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={CS}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--navbar-bg)' }}>Bienfaits ({items.length}) — sauvegardés en base de données</h3>
          <button onClick={add} style={BG}>+ Ajouter</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <div key={item.id || i} style={{ display: 'grid', gridTemplateColumns: '40px 70px 1fr 2fr 60px auto', gap: 10, alignItems: 'center', padding: 12, background: 'var(--admin-bg)', borderRadius: 10, border: '1px solid var(--admin-border)' }}>
              <div style={{ width: 36, height: 36, background: 'var(--green-mid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-card)', fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
              <input style={{ ...IS, fontSize: 20, textAlign: 'center', padding: '6px' }} value={item.icone} onChange={e => upd(i, 'icone', e.target.value)} title="Emoji" placeholder="" />
              <input style={IS} placeholder="Titre" value={item.titre} onChange={e => upd(i, 'titre', e.target.value)} />
              <input style={IS} placeholder="Description" value={item.description} onChange={e => upd(i, 'description', e.target.value)} />
              <input style={{ ...IS, width: 50 }} type="number" value={item.ordre} onChange={e => upd(i, 'ordre', Number(e.target.value))} title="Ordre" />
              <button onClick={() => del(item, i)} style={{ ...BR, padding: '8px 12px' }}></button>
            </div>
          ))}
          {items.length === 0 && <Empty msg="Aucun bienfait — cliquez sur + pour ajouter" />}
        </div>
      </div>
      <SaveBar onSave={saveAll} saving={saving} label="les bienfaits" />
    </div>
  )
}

function SectionTasse({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [f, setF] = useState<Partial<SiteContent>>({})
  useEffect(() => { if (!loading) setF(config) }, [loading, config])
  const upd = (k: keyof SiteContent, v: string) => setF(p => ({ ...p, [k]: v }))
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Section Tasse - banniere immersive</h3>
        <FL label="Label"><Inp value={f.tasse_label || ''} onChange={v => upd('tasse_label', v)} placeholder="Un moment rien que pour vous" /></FL>
        <FL label="Citation partie normale"><Inp value={f.tasse_citation || ''} onChange={v => upd('tasse_citation', v)} /></FL>
        <FL label="Citation partie verte"><Inp value={f.tasse_citation_em || ''} onChange={v => upd('tasse_citation_em', v)} /></FL>
        <FL label="Bouton"><Inp value={f.tasse_btn || ''} onChange={v => upd('tasse_btn', v)} placeholder="Commander maintenant" /></FL>
      </div>
      <SaveBar onSave={() => save(f)} saving={saving} label="la section Tasse" />
    </div>
  )
}

function SectionFondateur({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [f, setF] = useState<Partial<SiteContent>>({})
  useEffect(() => { if (!loading) setF(config) }, [loading, config])
  const upd = (k: keyof SiteContent, v: string) => setF(p => ({ ...p, [k]: v }))
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Bloc Fondateur - section verte accueil</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FL label="Label"><Inp value={f.fondateur_label || ''} onChange={v => upd('fondateur_label', v)} placeholder="Notre fondateur" /></FL>
          <FL label="Titre"><Inp value={f.fondateur_titre || ''} onChange={v => upd('fondateur_titre', v)} /></FL>
        </div>
        <FL label="Citation"><Txta value={f.fondateur_citation || ''} onChange={v => upd('fondateur_citation', v)} rows={3} /></FL>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FL label="Nom"><Inp value={f.fondateur_nom || ''} onChange={v => upd('fondateur_nom', v)} placeholder="Felicien Prosper DURAND" /></FL>
          <FL label="Titre fonction"><Inp value={f.fondateur_sous || ''} onChange={v => upd('fondateur_sous', v)} /></FL>
          <FL label="Bouton"><Inp value={f.fondateur_btn || ''} onChange={v => upd('fondateur_btn', v)} /></FL>
        </div>
      </div>
      <SaveBar onSave={() => save(f)} saving={saving} label="le Fondateur" />
    </div>
  )
}

function SectionStats({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [bandeau, setBandeau] = useState('')
  const [stats, setStats] = useState<StatItem[]>([])
  const [temos, setTemos] = useState<TemoignageRapide[]>([])
  useEffect(() => {
    if (!loading) {
      setBandeau(config.stats_bandeau || '')
      setStats(config.stats || [])
      setTemos(config.temoignages_rapides || [])
    }
  }, [loading, config])
  const updS = (i: number, k: keyof StatItem, v: string) => setStats(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x))
  const updT = (i: number, k: keyof TemoignageRapide, v: string) => setTemos(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x))
  const addT = () => setTemos(p => [...p, { texte: '', nom: '', ville: '' }])
  const delT = (i: number) => setTemos(p => p.filter((_, j) => j !== i))
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Bandeau dore</h3>
        <FL label="Texte du bandeau"><Inp value={bandeau} onChange={setBandeau} /></FL>
      </div>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Les 4 chiffres cles</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ border: '1px solid var(--admin-border)', borderRadius: 10, padding: 14, background: 'var(--admin-bg)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-muted)', marginBottom: 10 }}>CHIFFRE {i + 1}</div>
              <FL label="Emoji"><Inp value={s.icon} onChange={v => updS(i, 'icon', v)} /></FL>
              <FL label="Grand nombre"><Inp value={s.num} onChange={v => updS(i, 'num', v)} placeholder="500+" /></FL>
              <FL label="Label"><Inp value={s.label} onChange={v => updS(i, 'label', v)} /></FL>
              <FL label="Description"><Inp value={s.desc} onChange={v => updS(i, 'desc', v)} /></FL>
            </div>
          ))}
        </div>
      </div>
      <div style={CS}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--navbar-bg)' }}>Avis rapides</h3>
          <button onClick={addT} style={BG}>+ Ajouter</button>
        </div>
        {temos.map((t, i) => (
          <div key={i} style={{ border: '1px solid var(--admin-border)', borderRadius: 10, padding: 14, background: 'var(--admin-bg)', marginBottom: 10 }}>
            <FL label="Texte de l avis"><Txta value={t.texte} onChange={v => updT(i, 'texte', v)} rows={2} /></FL>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
              <FL label="Nom"><Inp value={t.nom} onChange={v => updT(i, 'nom', v)} /></FL>
              <FL label="Ville"><Inp value={t.ville} onChange={v => updT(i, 'ville', v)} /></FL>
              <button onClick={() => delT(i)} style={{ ...BR, padding: '9px 12px' }}>X</button>
            </div>
          </div>
        ))}
      </div>
      <SaveBar onSave={() => save({ stats_bandeau: bandeau, stats, temoignages_rapides: temos })} saving={saving} label="les chiffres" />
    </div>
  )
}

function SectionHistoire({ token }: { token: string }) {
  type Chap = { id: number; numero: string; titre: string; texte: string; ordre: number; actif: boolean }
  const [items, setItems] = useState<Chap[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const showToast = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }
  const h = useCallback((t: string) => ({ Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }), [])

  useEffect(() => {
    fetch(`${API}/admin/histoire/`, { headers: h(token) })
      .then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : d.results ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token, h])

  const add = () => setItems(p => [...p, { id: 0, numero: String(p.length + 1).padStart(2, '0'), titre: '', texte: '', ordre: p.length, actif: true }])
  const upd = (i: number, k: keyof Chap, v: any) => setItems(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x))

  const saveAll = async () => {
    setSaving(true)
    try {
      for (const item of items) {
        const body = { numero: item.numero, titre: item.titre, texte: item.texte, ordre: item.ordre, actif: item.actif }
        if (item.id === 0) {
          const r = await fetch(`${API}/admin/histoire/`, { method: 'POST', headers: h(token), body: JSON.stringify(body) })
          if (r.ok) { const d = await r.json(); setItems(p => p.map(x => x === item ? d : x)) }
        } else {
          await fetch(`${API}/admin/histoire/${item.id}/`, { method: 'PATCH', headers: h(token), body: JSON.stringify(body) })
        }
      }
      showToast('Chapitres sauvegardés', true)
    } catch { showToast('Erreur de sauvegarde', false) }
    setSaving(false)
  }

  const del = async (item: Chap, i: number) => {
    if (item.id !== 0) await fetch(`${API}/admin/histoire/${item.id}/`, { method: 'DELETE', headers: h(token) })
    setItems(p => p.filter((_, j) => j !== i))
    showToast('Chapitre supprimé', true)
  }

  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={CS}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--navbar-bg)' }}>Chapitres ({items.length}) — sauvegardés en base de données</h3>
          <button onClick={add} style={BG}>+ Ajouter chapitre</button>
        </div>
        {items.map((item, i) => (
          <div key={item.id || i} style={{ border: '1px solid var(--admin-border)', borderRadius: 12, padding: 16, marginBottom: 14, background: 'var(--admin-bg)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 60px auto', gap: 10, marginBottom: 10, alignItems: 'end' }}>
              <FL label="Numéro"><Inp value={item.numero} onChange={v => upd(i, 'numero', v)} placeholder="01" /></FL>
              <FL label="Titre"><Inp value={item.titre} onChange={v => upd(i, 'titre', v)} /></FL>
              <FL label="Ordre"><input style={{ ...IS, width: 50 }} type="number" value={item.ordre} onChange={e => upd(i, 'ordre', Number(e.target.value))} /></FL>
              <button onClick={() => del(item, i)} style={{ ...BR, padding: '9px 12px', alignSelf: 'flex-end' }}></button>
            </div>
            <FL label="Texte du chapitre"><Txta value={item.texte} onChange={v => upd(i, 'texte', v)} rows={6} /></FL>
          </div>
        ))}
        {items.length === 0 && <Empty msg="Aucun chapitre — cliquez sur + pour ajouter" />}
      </div>
      <SaveBar onSave={saveAll} saving={saving} label="les chapitres" />
    </div>
  )
}

function SectionBlog({ token }: { token: string }) {
  type Art = { id: number; slug: string; categorie: string; date_publication: string; titre: string; extrait: string; contenu: string; temps_lecture: string; publie: boolean }
  const blank: Art = { id: 0, slug: '', categorie: 'Sante naturelle', date_publication: new Date().toISOString().slice(0, 10), titre: '', extrait: '', contenu: '', temps_lecture: '3 min', publie: true }
  const [articles, setArticles] = useState<Art[]>([])
  const [editing, setEditing] = useState<Art | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const showToast = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }
  const h = useCallback((t: string) => ({ Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }), [])

  useEffect(() => {
    fetch(`${API}/admin/blog/`, { headers: h(token) })
      .then(r => r.json()).then(d => { setArticles(Array.isArray(d) ? d : d.results ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token, h])

  const saveArt = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const body = { slug: editing.slug, titre: editing.titre, categorie: editing.categorie, extrait: editing.extrait, contenu: editing.contenu, temps_lecture: editing.temps_lecture, date_publication: editing.date_publication, publie: editing.publie }
      if (editing.id === 0) {
        const r = await fetch(`${API}/admin/blog/`, { method: 'POST', headers: h(token), body: JSON.stringify(body) })
        if (r.ok) { const d = await r.json(); setArticles(p => [d, ...p]); showToast('Article créé', true); setEditing(null) }
        else { const e = await r.json(); showToast(JSON.stringify(e), false) }
      } else {
        const r = await fetch(`${API}/admin/blog/${editing.id}/`, { method: 'PATCH', headers: h(token), body: JSON.stringify(body) })
        if (r.ok) { const d = await r.json(); setArticles(p => p.map(a => a.id === d.id ? d : a)); showToast('Article mis à jour', true); setEditing(null) }
        else showToast('Erreur de sauvegarde', false)
      }
    } catch { showToast('Erreur réseau', false) }
    setSaving(false)
  }

  const del = async (art: Art) => {
    if (!confirm(`Supprimer "${art.titre}" ?`)) return
    await fetch(`${API}/admin/blog/${art.id}/`, { method: 'DELETE', headers: h(token) })
    setArticles(p => p.filter(a => a.id !== art.id))
    showToast('Article supprimé', true)
  }

  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => setEditing({ ...blank })} style={BG}>+ Nouvel article</button>
      </div>
      {editing && (
        <div style={{ ...CS, border: '2px solid #2563EB', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>{editing.id === 0 ? 'Nouvel article' : 'Modifier l\'article'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <FL label="Titre"><Inp value={editing.titre} onChange={v => setEditing(p => p ? { ...p, titre: v } : p)} /></FL>
            <FL label="Slug URL (unique)"><Inp value={editing.slug} onChange={v => setEditing(p => p ? { ...p, slug: v } : p)} placeholder="bienfaits-verveine" /></FL>
            <FL label="Catégorie"><Inp value={editing.categorie} onChange={v => setEditing(p => p ? { ...p, categorie: v } : p)} /></FL>
            <FL label="Date publication"><Inp value={editing.date_publication} type="date" onChange={v => setEditing(p => p ? { ...p, date_publication: v } : p)} /></FL>
            <FL label="Temps lecture"><Inp value={editing.temps_lecture} onChange={v => setEditing(p => p ? { ...p, temps_lecture: v } : p)} /></FL>
            <FL label="Publié"><select style={IS} value={editing.publie ? 'oui' : 'non'} onChange={e => setEditing(p => p ? { ...p, publie: e.target.value === 'oui' } : p)}><option value="oui">Oui</option><option value="non">Non (brouillon)</option></select></FL>
          </div>
          <FL label="Résumé (2-3 phrases)"><Txta value={editing.extrait} onChange={v => setEditing(p => p ? { ...p, extrait: v } : p)} rows={3} /></FL>
          <FL label="Contenu complet"><Txta value={editing.contenu} onChange={v => setEditing(p => p ? { ...p, contenu: v } : p)} rows={12} /></FL>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={saveArt} style={BG} disabled={saving}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
            <button onClick={() => setEditing(null)} style={BGR}>Annuler</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {articles.length === 0 && <Empty msg="Aucun article — cliquez sur + pour créer" />}
        {articles.map(a => (
          <div key={a.id} style={CS}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, marginBottom: 4 }}>{a.categorie} · {a.date_publication} · {a.temps_lecture} · {a.publie ? 'Publié' : 'Brouillon'}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 4 }}>{a.titre}</div>
                <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>{a.extrait?.substring(0, 120)}...</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setEditing(a)} style={{ ...BG, fontSize: 12, padding: '7px 12px' }}>Modifier</button>
                <button onClick={() => del(a)} style={{ ...BR, fontSize: 12, padding: '7px 10px' }}>Suppr.</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionPartenaires({ token }: { token: string }) {
  type Part = { id: number; nom: string; lien: string; tag: string; ordre: number; actif: boolean }
  const [items, setItems] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const showToast = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }
  const h = useCallback((t: string) => ({ Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }), [])

  useEffect(() => {
    fetch(`${API}/admin/partenaires/`, { headers: h(token) })
      .then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : d.results ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token, h])

  const add = () => setItems(p => [...p, { id: 0, nom: '', lien: '', tag: 'Partenaire', ordre: p.length, actif: true }])
  const upd = (i: number, k: keyof Part, v: any) => setItems(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x))

  const saveAll = async () => {
    setSaving(true)
    try {
      for (const item of items) {
        const body = { nom: item.nom, lien: item.lien, tag: item.tag, ordre: item.ordre, actif: item.actif }
        if (item.id === 0) {
          const r = await fetch(`${API}/admin/partenaires/`, { method: 'POST', headers: h(token), body: JSON.stringify(body) })
          if (r.ok) { const d = await r.json(); setItems(p => p.map(x => x === item ? d : x)) }
        } else {
          await fetch(`${API}/admin/partenaires/${item.id}/`, { method: 'PATCH', headers: h(token), body: JSON.stringify(body) })
        }
      }
      showToast('Partenaires sauvegardés (logos via Django admin)', true)
    } catch { showToast('Erreur de sauvegarde', false) }
    setSaving(false)
  }

  const del = async (item: Part, i: number) => {
    if (item.id !== 0) await fetch(`${API}/admin/partenaires/${item.id}/`, { method: 'DELETE', headers: h(token) })
    setItems(p => p.filter((_, j) => j !== i))
    showToast('Partenaire supprimé', true)
  }

  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#92400E' }}>
        Les <strong>logos</strong> des partenaires s&apos;uploadent via l&apos;interface Django admin (<code>/django-admin/api/partenaire/</code>). Ici vous gérez les infos texte.
      </div>
      <div style={CS}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--navbar-bg)' }}>Partenaires ({items.length}) — base de données</h3>
          <button onClick={add} style={BG}>+ Ajouter</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
          {items.map((item, i) => (
            <div key={item.id || i} style={{ border: '1px solid var(--admin-border)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FL label="Nom du partenaire"><Inp value={item.nom} onChange={v => upd(i, 'nom', v)} placeholder="WPSA Bénin" /></FL>
              <FL label="Tag / Catégorie"><Inp value={item.tag} onChange={v => upd(i, 'tag', v)} placeholder="Partenaire scientifique" /></FL>
              <FL label="Lien (URL)"><Inp value={item.lien} onChange={v => upd(i, 'lien', v)} placeholder="https://..." /></FL>
              <FL label="Ordre"><input style={{ ...IS, width: 80 }} type="number" value={item.ordre} onChange={e => upd(i, 'ordre', Number(e.target.value))} /></FL>
              <button onClick={() => del(item, i)} style={{ ...BR, fontSize: 12 }}>Supprimer</button>
            </div>
          ))}
          {items.length === 0 && <div style={{ gridColumn: '1/-1' }}><Empty msg="Aucun partenaire — cliquez sur + pour ajouter" /></div>}
        </div>
      </div>
      <SaveBar onSave={saveAll} saving={saving} label="les partenaires" />
    </div>
  )
}

function SectionAnnonces({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [items, setItems] = useState<string[]>([])
  useEffect(() => { if (!loading) setItems(config.annonces || []) }, [loading, config])
  const upd = (i: number, v: string) => setItems(p => p.map((x, j) => j === i ? v : x))
  const add = () => setItems(p => [...p, ''])
  const del = (i: number) => setItems(p => p.filter((_, j) => j !== i))
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={CS}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--navbar-bg)' }}>Barre d annonces - haut de page</h3>
          <button onClick={add} style={BG}>+ Ajouter</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', color: 'var(--admin-card)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
              <input style={{ ...IS, flex: 1 }} value={item} onChange={e => upd(i, e.target.value)} placeholder="Livraison gratuite..." />
              <button onClick={() => del(i)} style={{ ...BR, padding: '8px 10px' }}>X</button>
            </div>
          ))}
        </div>
      </div>
      <SaveBar onSave={() => save({ annonces: items })} saving={saving} label="les annonces" />
    </div>
  )
}

function SectionAccueilConfig({ token }: { token: string }) {
  type AccueilCfg = {
    tasse_label: string; tasse_citation: string; tasse_bouton: string; tasse_lien: string
    cta_label: string; cta_texte: string; cta_bouton: string; cta_lien: string
    slogan: string; heures_ouverture: string
  }
  const empty: AccueilCfg = { tasse_label: '', tasse_citation: '', tasse_bouton: '', tasse_lien: '',
    cta_label: '', cta_texte: '', cta_bouton: '', cta_lien: '', slogan: '', heures_ouverture: '' }
  const [c, setC] = useState<AccueilCfg>(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    fetch(`${API}/admin/config-accueil/`, { headers: ah(token) })
      .then(r => r.ok ? r.json() : Promise.resolve({} as Partial<AccueilCfg>))
      .then((d: Partial<AccueilCfg>) => { setC({ ...empty, ...d }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const upd = (k: keyof AccueilCfg, v: string) => setC(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    const res = await fetch(`${API}/admin/config-accueil/`, { method: 'PATCH', headers: ah(token), body: JSON.stringify(c) })
    setSaving(false)
    setToast(res.ok ? { msg: 'Sauvegarde reussie !', ok: true } : { msg: 'Erreur de sauvegarde', ok: false })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: 'var(--navbar-bg)' }}>Section "Un moment pour vous" (tasse)</h3>
          <FL label="Label"><Inp value={c.tasse_label} onChange={v => upd('tasse_label', v)} placeholder="Un moment rien que pour vous" /></FL>
          <FL label="Citation"><Txta value={c.tasse_citation} onChange={v => upd('tasse_citation', v)} rows={2} /></FL>
          <FL label="Texte du bouton"><Inp value={c.tasse_bouton} onChange={v => upd('tasse_bouton', v)} placeholder="Commander maintenant" /></FL>
          <FL label="Lien du bouton"><Inp value={c.tasse_lien} onChange={v => upd('tasse_lien', v)} placeholder="/boutique" /></FL>
        </div>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: 'var(--navbar-bg)' }}>Bandeau CTA dore (bas de page / footer)</h3>
          <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>
            C'est ce bandeau qui affiche "Commander dès X FCFA" en bas de chaque page, y compris sur mobile.
          </p>
          <FL label="Titre"><Inp value={c.cta_label} onChange={v => upd('cta_label', v)} placeholder="Prêt à prendre soin de vous ?" /></FL>
          <FL label="Texte"><Txta value={c.cta_texte} onChange={v => upd('cta_texte', v)} rows={2} /></FL>
          <FL label="Texte du bouton"><Inp value={c.cta_bouton} onChange={v => upd('cta_bouton', v)} placeholder="Commander dès 2 500 FCFA" /></FL>
          <FL label="Lien du bouton"><Inp value={c.cta_lien} onChange={v => upd('cta_lien', v)} placeholder="/boutique" /></FL>
        </div>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Footer</h3>
          <FL label="Slogan (sous le logo)"><Inp value={c.slogan} onChange={v => upd('slogan', v)} placeholder="Un sang qui circule, une vie qui rayonne." /></FL>
          <FL label="Heures d'ouverture"><Inp value={c.heures_ouverture} onChange={v => upd('heures_ouverture', v)} placeholder="Lun – Sam : 8h00 – 18h00" /></FL>
        </div>
      </div>
      <SaveBar onSave={save} saving={saving} label="l'accueil" />
    </div>
  )
}

function SectionContactConfig({ token }: { token: string }) {
  type CfgSite = {
    telephone: string; telephone_raw: string; email: string; adresse: string
    tiktok_url: string; facebook_url: string; paiements: string
    prix_affiche: string; prix_mini: string
  }
  const empty: CfgSite = { telephone: '', telephone_raw: '', email: '', adresse: '', tiktok_url: '', facebook_url: '', paiements: '', prix_affiche: '', prix_mini: '' }
  const [c, setC] = useState<CfgSite>(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    fetch(`${API}/admin/config-site/`, { headers: ah(token) })
      .then(r => r.ok ? r.json() : Promise.resolve({} as Partial<CfgSite>))
      .then((d: Partial<CfgSite>) => { setC({ ...empty, ...d }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const upd = (k: keyof CfgSite, v: string) => setC(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    const res = await fetch(`${API}/admin/config-site/`, { method: 'PATCH', headers: ah(token), body: JSON.stringify(c) })
    setSaving(false)
    setToast(res.ok ? { msg: 'Sauvegarde reussie !', ok: true } : { msg: 'Erreur de sauvegarde', ok: false })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Coordonnees</h3>
          <FL label="Telephone affiche"><Inp value={c.telephone} onChange={v => upd('telephone', v)} placeholder="+229 01 95 96 77 62" /></FL>
          <FL label="Telephone brut (liens tel: / WhatsApp, sans espaces ni +)"><Inp value={c.telephone_raw} onChange={v => upd('telephone_raw', v)} placeholder="2290195967762" /></FL>
          <FL label="Email"><Inp value={c.email} onChange={v => upd('email', v)} placeholder="tropicanapiopio@gmail.com" /></FL>
          <FL label="Adresse"><Inp value={c.adresse} onChange={v => upd('adresse', v)} placeholder="Oganla Gare Nord, Porto-Novo, Benin" /></FL>
        </div>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Reseaux sociaux</h3>
          <FL label="TikTok (URL)"><Inp value={c.tiktok_url} onChange={v => upd('tiktok_url', v)} placeholder="https://www.tiktok.com/@..." /></FL>
          <FL label="Facebook (URL)"><Inp value={c.facebook_url} onChange={v => upd('facebook_url', v)} placeholder="https://facebook.com/..." /></FL>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '20px 0 16px', color: 'var(--navbar-bg)' }}>Paiements</h3>
          <FL label="Modes acceptes (separes par des virgules)"><Inp value={c.paiements} onChange={v => upd('paiements', v)} placeholder="MTN Money,Moov Money,Wave,Orange" /></FL>
        </div>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: 'var(--navbar-bg)' }}>Prix affiches sur le site</h3>
          <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>
            Apparaissent sur les boutons "Commander" (accueil, boutique, footer, WhatsApp).
          </p>
          <FL label="Prix affiche (bouton boutique / footer)"><Inp value={c.prix_affiche} onChange={v => upd('prix_affiche', v)} placeholder="des 2 500 FCFA" /></FL>
          <FL label="Prix minimum (bouton accueil)"><Inp value={c.prix_mini} onChange={v => upd('prix_mini', v)} placeholder="1 000 FCFA" /></FL>
        </div>
      </div>
      <SaveBar onSave={save} saving={saving} label="les infos de contact" />
    </div>
  )
}

function SectionFooter({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [f, setF] = useState<Partial<SiteContent>>({})
  useEffect(() => { if (!loading) setF(config) }, [loading, config])
  const upd = (k: keyof SiteContent, v: string) => setF(p => ({ ...p, [k]: v }))
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Bande CTA doree</h3>
          <FL label="Pre-titre"><Inp value={f.footer_cta_pre || ''} onChange={v => upd('footer_cta_pre', v)} /></FL>
          <FL label="Titre"><Inp value={f.footer_cta_titre || ''} onChange={v => upd('footer_cta_titre', v)} /></FL>
          <FL label="Bouton"><Inp value={f.footer_cta_btn || ''} onChange={v => upd('footer_cta_btn', v)} /></FL>
        </div>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--navbar-bg)' }}>Infos footer</h3>
          <FL label="Slogan"><Inp value={f.footer_slogan || ''} onChange={v => upd('footer_slogan', v)} /></FL>
          <FL label="Adresse"><Inp value={f.footer_adresse || ''} onChange={v => upd('footer_adresse', v)} /></FL>
          <FL label="Horaires"><Inp value={f.footer_horaires || ''} onChange={v => upd('footer_horaires', v)} /></FL>
          <FL label="Copyright"><Inp value={f.footer_copyright || ''} onChange={v => upd('footer_copyright', v)} /></FL>
        </div>
      </div>
      <SaveBar onSave={() => save(f)} saving={saving} label="le footer" />
    </div>
  )
}

function SectionCouleurs({ token }: { token: string }) {
  const { config, loading, saving, save, toast } = useConfig(token)
  const [cols, setCols] = useState({ couleur_vert: 'var(--green-mid)', couleur_or: 'var(--gold)', couleur_creme: 'var(--text-inverse)', couleur_fonce: 'var(--navbar-bg)' })
  useEffect(() => {
    if (!loading) setCols({ couleur_vert: config.couleur_vert || 'var(--green-mid)', couleur_or: config.couleur_or || 'var(--gold)', couleur_creme: config.couleur_creme || 'var(--text-inverse)', couleur_fonce: config.couleur_fonce || 'var(--navbar-bg)' })
  }, [loading, config])
  const colors = [
    { k: 'couleur_vert' as const, label: 'Vert principal', desc: 'Boutons, icones, accents verts' },
    { k: 'couleur_or' as const, label: 'Or / Dore', desc: 'CTA, prix, elements premium' },
    { k: 'couleur_creme' as const, label: 'Creme / Fond', desc: 'Arriere-plan des sections' },
    { k: 'couleur_fonce' as const, label: 'Vert fonce', desc: 'Navbar, footer, sections sombres' },
  ]
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={CS}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 20px' }}>Palette de couleurs du site</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
          {colors.map(c => (
            <div key={c.k} style={{ border: '1px solid var(--admin-border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 80, background: cols[c.k], position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <input type="color" value={cols[c.k]} onChange={e => setCols(p => ({ ...p, [c.k]: e.target.value }))} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                <span style={{ color: 'var(--admin-card)', fontSize: 12, fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,.5)', pointerEvents: 'none' }}>Cliquer pour changer</span>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginBottom: 8 }}>{c.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: cols[c.k], border: '2px solid var(--admin-border)', flexShrink: 0 }} />
                  <input style={{ ...IS, fontFamily: 'monospace', fontSize: 13 }} value={cols[c.k]} onChange={e => setCols(p => ({ ...p, [c.k]: e.target.value }))} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SaveBar onSave={() => save(cols)} saving={saving} label="les couleurs" />
    </div>
  )
}

function Commandes({ token }: { token: string }) {
  const [cmds, setCmds] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState<Commande | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const st = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreSearch, setFiltreSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const charger = (p = 1, statut = filtreStatut, search = filtreSearch) => {
    setLoading(true)
    let url = `${API}/admin/commandes/?page=${p}&per_page=20`
    if (statut) url += `&statut=${statut}`
    if (search) url += `&search=${encodeURIComponent(search)}`
    fetch(url, { headers: ah(token) })
      .then(r => r.json())
      .then(d => {
        setCmds(Array.isArray(d) ? d : d.results ?? [])
        if (d.pages) setTotalPages(d.pages)
        setLoading(false)
      })
  }

  useEffect(() => { charger() }, [token])

  const chg = async (id: number, statut: string) => {
    const res = await fetch(`${API}/admin/commandes/${id}/`, { method: 'PATCH', headers: ah(token), body: JSON.stringify({ statut }) })
    if (res.ok) { setCmds(p => p.map(c => c.id === id ? { ...c, statut } : c)); setSel(p => p ? { ...p, statut } : null); st('Statut mis a jour', true) } else st('Erreur', false)
  }
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      {sel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: 'var(--admin-card)', width: '100%', maxWidth: 440, height: '100vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Commande #{sel.id}</h2>
              <button onClick={() => setSel(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>X</button>
            </div>
            <div style={{ background: 'var(--admin-bg)', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 13 }}>
              <div><strong>{sel.nom_client}</strong></div>
              <div>{sel.email_client}</div>
              <div>{sel.telephone_client} - {sel.ville_livraison}</div>
            </div>
            <div style={{ background: 'var(--admin-bg)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
              {sel.lignes?.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span>{l.produit_nom} x{l.quantite}</span>
                  <span style={{ fontWeight: 700 }}>{fm(l.sous_total)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--admin-border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
                <span>Total</span>
                <span style={{ color: 'var(--gold)' }}>{fm(sel.total)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {Object.entries(STATUT_LABELS).map(([k, v]) => (
                <button key={k} onClick={() => chg(sel.id, k)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: sel.statut === k ? 'var(--navbar-bg)' : 'var(--admin-bg-alt)', color: sel.statut === k ? 'var(--admin-card)' : 'var(--admin-text-muted)', border: 'none' }}>{v}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${API}/admin/commandes/${sel.id}/bon/`, { headers: ah(token) })
                    if (!res.ok) { st('Erreur lors de la génération du bon.', false); return }
                    const html = await res.text()
                    const blob = new Blob([html], { type: 'text/html' })
                    const url = URL.createObjectURL(blob)
                    window.open(url, '_blank')
                  } catch {
                    st('Erreur réseau lors de la génération du bon.', false)
                  }
                }}
                style={{ flex: 1, background: 'var(--green-mid)', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >Imprimer le bon</button>
              <button
                onClick={async () => {
                  if (!confirm(
                    "FedaPay ne propose pas de remboursement automatique par API.\n\n" +
                    "Ce bouton ne fait QUE : marquer la commande comme remboursée dans ce système, " +
                    "et envoyer un email au client pour le prévenir.\n\n" +
                    "Si l'argent n'a pas encore été rendu, fais-le D'ABORD manuellement depuis ton " +
                    "dashboard FedaPay (Remboursements), puis clique OK pour continuer ici."
                  )) return
                  const note = prompt('Motif du remboursement :') || ''
                  const res = await fetch(`${API}/admin/commandes/${sel.id}/rembourser/`, { method: 'POST', headers: ah(token), body: JSON.stringify({ note }) })
                  const d = await res.json()
                  st(d.detail || 'Erreur', res.ok)
                  if (res.ok) { setSel(null); charger() }
                }}
                style={{ flex: 1, background: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >Marquer remboursé</button>
            </div>
          </div>
        </div>
      )}
      <div style={CS}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Commandes</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              placeholder="Rechercher..."
              value={filtreSearch}
              onChange={e => { setFiltreSearch(e.target.value); charger(1, filtreStatut, e.target.value) }}
              style={{ border: '1.5px solid var(--admin-border)', borderRadius: 8, padding: '6px 12px', fontSize: 13 }}
            />
            <select
              value={filtreStatut}
              onChange={e => { setFiltreStatut(e.target.value); charger(1, e.target.value, filtreSearch) }}
              style={{ border: '1.5px solid var(--admin-border)', borderRadius: 8, padding: '6px 12px', fontSize: 13 }}
            >
              <option value="">Tous les statuts</option>
              {Object.entries(STATUT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button
              onClick={() => window.open(`${API}/admin/commandes/?format=excel`, '_blank')}
              style={{ background: '#1D6F42', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >Excel</button>
            <button
              onClick={() => window.open(`${API}/admin/commandes/?format=csv`, '_blank')}
              style={{ background: '#457B9D', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >CSV</button>
          </div>
        </div>
        {cmds.length === 0 ? <Empty msg="Aucune commande" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--admin-bg)' }}>
                  {['#', 'Client', 'Ville', 'Total', 'Statut', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: 'var(--admin-text-muted)', textAlign: 'left', textTransform: 'uppercase' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cmds.map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid var(--admin-bg-alt)' }}>
                    <td style={{ padding: '11px 12px', fontWeight: 700, color: 'var(--admin-text-muted)', fontSize: 13 }}>#{c.id}</td>
                    <td style={{ padding: '11px 12px', fontSize: 13, fontWeight: 600 }}>{c.nom_client}</td>
                    <td style={{ padding: '11px 12px', fontSize: 13, color: 'var(--admin-text-muted)' }}>{c.ville_livraison}</td>
                    <td style={{ padding: '11px 12px', fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>{fm(c.total)}</td>
                    <td style={{ padding: '11px 12px' }}><Badge statut={c.statut} /></td>
                    <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--admin-text-faint)' }}>{fd(c.date_commande)}</td>
                    <td style={{ padding: '11px 12px' }}>
                      <button onClick={() => setSel(c)} style={{ fontSize: 12, color: 'var(--green-mid)', background: 'none', border: '1px solid var(--admin-success-bg)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <button onClick={() => { const p = Math.max(1, page-1); setPage(p); charger(p) }} disabled={page === 1} style={{ border: '1px solid var(--admin-border)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer', background: page===1?'var(--admin-bg)':'var(--admin-card)' }}>Préc.</button>
              <span style={{ padding: '6px 14px', fontSize: 13, color: 'var(--text-muted)' }}>Page {page}/{totalPages}</span>
              <button onClick={() => { const p = Math.min(totalPages, page+1); setPage(p); charger(p) }} disabled={page===totalPages} style={{ border: '1px solid var(--admin-border)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer', background: page===totalPages?'var(--admin-bg)':'var(--admin-card)' }}>Suiv.</button>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  )
}

function Produits({ token }: { token: string }) {
  const [prods, setProds] = useState<Produit[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Produit>>({})
  const [editing, setEditing] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const st = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }
  const load = useCallback(() => {
    fetch(`${API}/admin/produits/`, { headers: ah(token) }).then(r => r.json()).then(d => { setProds(Array.isArray(d) ? d : d.results ?? []); setLoading(false) })
  }, [token])
  useEffect(() => { load() }, [load])
  const saveProd = async () => {
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `${API}/admin/produits/${editing}/` : `${API}/admin/produits/`
    const res = await fetch(url, { method, headers: ah(token), body: JSON.stringify(form) })
    if (res.ok) { st(editing ? 'Modifie' : 'Cree', true); setShowForm(false); load() } else st('Erreur', false)
  }
  const del = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    const res = await fetch(`${API}/admin/produits/${id}/`, { method: 'DELETE', headers: ah(token) })
    if (res.ok) { st('Supprime', true); load() } else st('Erreur', false)
  }
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => { setForm({ disponible: true, unite: 'boite' }); setEditing(null); setShowForm(true) }} style={BG}>+ Nouveau produit</button>
      </div>
      {showForm && (
        <div style={{ ...CS, border: '2px solid #2D6A4F' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>{editing ? 'Modifier' : 'Nouveau produit'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FL label="Nom"><Inp value={form.nom || ''} onChange={v => setForm(p => ({ ...p, nom: v }))} /></FL>
            <FL label="Slug"><Inp value={form.slug || ''} onChange={v => setForm(p => ({ ...p, slug: v }))} placeholder="the-sachet-25g" /></FL>
            <FL label="Prix FCFA"><Inp value={String(form.prix || '')} onChange={v => setForm(p => ({ ...p, prix: Number(v) }))} type="number" /></FL>
            <FL label="Unite"><Inp value={form.unite || ''} onChange={v => setForm(p => ({ ...p, unite: v }))} /></FL>
            <FL label="Badge"><Inp value={form.badge || ''} onChange={v => setForm(p => ({ ...p, badge: v }))} placeholder="Populaire" /></FL>
            <FL label="Qté min. commande"><Inp value={String(form.quantite_min || 1)} onChange={v => setForm(p => ({ ...p, quantite_min: Math.max(1, Number(v)) }))} type="number" /></FL>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 20 }}>
              <input type="checkbox" id="dispo" checked={form.disponible ?? true} onChange={e => setForm(p => ({ ...p, disponible: e.target.checked }))} />
              <label htmlFor="dispo" style={{ fontSize: 14, fontWeight: 600 }}>Disponible</label>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <FL label="Description"><Txta value={form.description || ''} onChange={v => setForm(p => ({ ...p, description: v }))} rows={3} /></FL>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={saveProd} style={BG}>Sauvegarder</button>
            <button onClick={() => setShowForm(false)} style={BR}>Annuler</button>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {prods.map(p => (
          <div key={p.id} style={CS}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.nom}</div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{p.slug}</div>
              </div>
              <span style={{ background: p.disponible ? 'var(--admin-success-bg)' : 'var(--admin-danger-bg)', color: p.disponible ? 'var(--admin-success-text)' : '#991B1B', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{p.disponible ? 'En vente' : 'Hors stock'}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', marginBottom: 6 }}>{fm(p.prix)} / {p.unite}</div>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: '0 0 14px' }}>{p.description?.substring(0, 80)}...</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setForm(p); setEditing(p.id); setShowForm(true) }} style={{ ...BG, flex: 1, fontSize: 12, padding: '7px' }}>Modifier</button>
              <button onClick={() => del(p.id)} style={{ ...BR, fontSize: 12, padding: '7px 10px' }}>Suppr.</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Temoignages({ token }: { token: string }) {
  const [temos, setTemos] = useState<Temoignage[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const st = (msg: string, ok: boolean) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }
  useEffect(() => {
    fetch(`${API}/admin/temoignages/`, { headers: ah(token) }).then(r => r.json()).then(d => { setTemos(Array.isArray(d) ? d : d.resultats ?? d.results ?? []); setLoading(false) })
  }, [token])
  const toggle = async (t: Temoignage) => {
    const res = await fetch(`${API}/admin/temoignages/${t.id}/`, { method: 'PATCH', headers: ah(token), body: JSON.stringify({ approuve: !t.approuve }) })
    if (res.ok) { setTemos(p => p.map(x => x.id === t.id ? { ...x, approuve: !x.approuve } : x)); st(t.approuve ? 'Masque' : 'Publie', true) }
  }
  const del = async (id: number) => {
    if (!confirm('Supprimer ?')) return
    const res = await fetch(`${API}/admin/temoignages/${id}/`, { method: 'DELETE', headers: ah(token) })
    if (res.ok) { setTemos(p => p.filter(t => t.id !== id)); st('Supprime', true) }
  }
  if (loading) return <Loader />
  return (
    <div>
      {toast && <Toast {...toast} />}
      {temos.length === 0 ? <Empty msg="Aucun temoignage" /> : temos.map(t => (
        <div key={t.id} style={{ ...CS, display: 'flex', gap: 16 }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: t.approuve ? 'var(--admin-success-bg)' : 'var(--admin-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, color: t.approuve ? 'var(--admin-success-text)' : '#991B1B' }}>{t.approuve ? 'OK' : '?'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div><span style={{ fontSize: 14, fontWeight: 700 }}>{t.nom}</span><span style={{ fontSize: 12, color: 'var(--admin-text-faint)', marginLeft: 8 }}>{t.ville}</span></div>
              <div style={{ color: '#F59E0B' }}>{'*'.repeat(t.note)}</div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', margin: '0 0 10px', lineHeight: 1.6 }}>{t.texte}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggle(t)} style={{ ...BG, fontSize: 12, padding: '6px 14px', background: t.approuve ? 'var(--admin-text-muted)' : 'var(--green-mid)' }}>{t.approuve ? 'Masquer' : 'Publier'}</button>
              <button onClick={() => del(t.id)} style={{ ...BR, fontSize: 12, padding: '6px 10px' }}>Supprimer</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Messages({ token }: { token: string }) {
  const [msgs, setMsgs] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState<Message | null>(null)
  useEffect(() => {
    fetch(`${API}/admin/messages/`, { headers: ah(token) }).then(r => r.json()).then(d => { setMsgs(Array.isArray(d) ? d : d.results ?? []); setLoading(false) })
  }, [token])
  const marquerLu = async (id: number) => {
    await fetch(`${API}/admin/messages/${id}/`, { method: 'PATCH', headers: ah(token), body: JSON.stringify({ lu: true }) })
    setMsgs(p => p.map(m => m.id === id ? { ...m, lu: true } : m))
  }
  if (loading) return <Loader />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: sel ? '1fr 1fr' : '1fr', gap: 16 }}>
      <div style={CS}>
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>{msgs.length} messages</h2>
        {msgs.length === 0 ? <Empty msg="Aucun message" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {msgs.map(m => (
              <button key={m.id} onClick={() => { setSel(m); marquerLu(m.id) }} style={{ background: m.lu ? 'var(--admin-bg)' : '#EFF6FF', border: `1px solid ${m.lu ? 'var(--admin-border)' : '#BFDBFE'}`, borderRadius: 10, padding: 14, cursor: 'pointer', textAlign: 'left' as const }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: m.lu ? 500 : 700 }}>{m.nom}</span>
                  {!m.lu && <span style={{ background: '#2563EB', color: 'var(--admin-card)', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>NOUVEAU</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{m.email} - {m.objet}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      {sel && (
        <div style={CS}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Message de {sel.nom}</h3>
            <button onClick={() => setSel(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--admin-text-faint)' }}>X</button>
          </div>
          <div style={{ background: 'var(--admin-bg)', borderRadius: 8, padding: 12, fontSize: 13, marginBottom: 10 }}>
            <div>Email : <a href={`mailto:${sel.email}`} style={{ color: 'var(--green-mid)' }}>{sel.email}</a></div>
            {sel.telephone && <div>Tel : {sel.telephone}</div>}
            <div>Objet : {sel.objet || '-'}</div>
          </div>
          <div style={{ background: 'var(--admin-bg)', borderRadius: 8, padding: 14, fontSize: 14, lineHeight: 1.7, color: 'var(--admin-text)', marginBottom: 10 }}>{sel.message}</div>
          <a href={`mailto:${sel.email}?subject=Re: ${sel.objet || 'Votre message'}`} style={{ ...BG, textDecoration: 'none', textAlign: 'center' as const, display: 'block' }}>Repondre par email</a>
        </div>
      )}
    </div>
  )
}

function Utilisateurs({ token }: { token: string }) {
  const [users, setUsers] = useState<Utilisateur[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  useEffect(() => {
    fetch(`${API}/admin/utilisateurs/`, { headers: ah(token) }).then(r => r.json()).then(d => { setUsers(Array.isArray(d) ? d : d.results ?? []); setLoading(false) })
  }, [token])
  const filtered = users.filter(u => `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
  if (loading) return <Loader />
  return (
    <div style={CS}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{users.length} membres</h2>
        <input style={{ ...IS, width: 240 }} placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--admin-bg)' }}>
              {['Nom', 'Email', 'Telephone', 'Ville', 'Inscription', 'Role'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: 'var(--admin-text-muted)', textAlign: 'left', textTransform: 'uppercase' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--admin-bg-alt)' }}>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>{u.prenom} {u.nom}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--admin-text-muted)' }}>{u.email}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--admin-text-muted)' }}>{u.telephone || '-'}</td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--admin-text-muted)' }}>{u.ville || '-'}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--admin-text-faint)' }}>{fd(u.date_inscription)}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ background: u.is_staff ? '#FEF3C7' : 'var(--admin-bg-alt)', color: u.is_staff ? '#92400E' : 'var(--admin-text-muted)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{u.is_staff ? 'Admin' : 'Client'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Newsletter({ token }: { token: string }) {
  const [data, setData] = useState<{ email: string; date_inscription: string }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(`${API}/admin/newsletter/`, { headers: ah(token) }).then(r => r.json()).then(d => { setData(d.abonnes ?? []); setLoading(false) })
  }, [token])
  if (loading) return <Loader />
  return (
    <div style={CS}>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>{data.length} abonnes newsletter</h2>
      {data.length === 0 ? <Empty msg="Aucun abonne" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.map(a => (
            <div key={a.email} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--admin-bg)', borderRadius: 8, fontSize: 13 }}>
              <span>{a.email}</span>
              <span style={{ color: 'var(--admin-text-faint)' }}>{fd(a.date_inscription)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const ICON_USERS = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const ICON_BOX = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
const ICON_BAG = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const ICON_COIN = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2.2 3 2.5c1.7.3 3 1.1 3 2.5s-1.3 2.5-3 2.5-3-1.1-3-2.5"/></svg>

function WeeklySalesChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 4)
  const yMax = Math.ceil(max / 5) * 5 || 5
  const w = 560, h = 200, padL = 32, padB = 24, padT = 12
  const plotW = w - padL - 10, plotH = h - padB - padT
  const stepX = plotW / (data.length - 1 || 1)
  const points = data.map((v, i) => [padL + i * stepX, padT + plotH - (v / yMax) * plotH])
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1][0]},${padT + plotH} L ${points[0][0]},${padT + plotH} Z`
  const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const ySteps = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(yMax * f))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--green-mid)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--green-mid)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {ySteps.map((v, i) => {
        const y = padT + plotH - (v / yMax) * plotH
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={w - 10} y2={y} stroke="var(--admin-border)" strokeDasharray="3,3" strokeWidth="1" />
            <text x={padL - 8} y={y + 4} fontSize="10" fill="var(--admin-text-faint)" textAnchor="end">{v}</text>
          </g>
        )
      })}
      <path d={areaPath} fill="url(#salesGradient)" />
      <path d={linePath} fill="none" stroke="var(--green-mid)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--admin-card)" stroke="var(--green-mid)" strokeWidth="2" />
      ))}
      {jours.map((j, i) => (
        <text key={j} x={padL + i * stepX} y={h - 6} fontSize="10" fill="var(--admin-text-faint)" textAnchor="middle">{j}</text>
      ))}
    </svg>
  )
}

function StatutDonut({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((s, v) => s + v, 0)
  const order = ['en_attente', 'confirmee', 'en_livraison', 'livree', 'annulee']
  let cumul = 0
  const R = 46, C = 2 * Math.PI * R

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} fill="none" stroke="var(--admin-border)" strokeWidth="14" />
        {total > 0 && order.filter(k => counts[k] > 0).map(k => {
          const frac = counts[k] / total
          const dash = frac * C
          const el = (
            <circle key={k} cx="60" cy="60" r={R} fill="none" stroke={STATUT_COLORS[k]?.color || '#999'} strokeWidth="14"
              strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-cumul} transform="rotate(-90 60 60)" strokeLinecap="butt" />
          )
          cumul += dash
          return el
        })}
        <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--admin-text)">{total}</text>
        <text x="60" y="72" textAnchor="middle" fontSize="10" fill="var(--admin-text-faint)">commandes</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 140 }}>
        {order.filter(k => counts[k] > 0).map(k => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: STATUT_COLORS[k]?.color || '#999', flexShrink: 0 }} />
            <span style={{ color: 'var(--admin-text)', flex: 1 }}>{STATUT_LABELS[k]}</span>
            <span style={{ fontWeight: 700, color: 'var(--admin-text)' }}>{counts[k]}</span>
          </div>
        ))}
        {total === 0 && <div style={{ fontSize: 12.5, color: 'var(--admin-text-faint)' }}>Aucune commande pour le moment</div>}
      </div>
    </div>
  )
}

function Dashboard({ token, setSection }: { token: string; setSection: (s: Section) => void }) {
  const [stats, setStats] = useState({ commandes: 0, attente: 0, ca: 0, produits: 0, messages: 0, nonLus: 0, temos: 0, users: 0 })
  const [statutCounts, setStatutCounts] = useState<Record<string, number>>({})
  const [weekly, setWeekly] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const h = ah(token)
    Promise.all([
      fetch(`${API}/admin/commandes/`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/admin/messages/`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/admin/temoignages/`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/admin/produits/`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/admin/utilisateurs/`, { headers: h }).then(r => r.json()).catch(() => []),
    ]).then(([c, m, t, p, u]) => {
      const cmdArr = Array.isArray(c) ? c : c.results ?? []
      const ca = cmdArr.filter((x: Commande) => x.statut === 'livree').reduce((s: number, x: Commande) => s + Number(x.total), 0)
      setStats({
        commandes: cmdArr.length,
        attente: cmdArr.filter((x: Commande) => x.statut === 'en_attente').length,
        ca,
        produits: (Array.isArray(p) ? p : p.results ?? []).length,
        messages: (Array.isArray(m) ? m : m.results ?? []).length,
        nonLus: (Array.isArray(m) ? m : m.results ?? []).filter((x: Message) => !x.lu).length,
        temos: (Array.isArray(t) ? t : t.resultats ?? t.results ?? []).filter((x: Temoignage) => !x.approuve).length,
        users: (Array.isArray(u) ? u : u.results ?? []).length,
      })

      const counts: Record<string, number> = {}
      cmdArr.forEach((x: Commande) => { counts[x.statut] = (counts[x.statut] || 0) + 1 })
      setStatutCounts(counts)

      const today = new Date()
      const days: number[] = []
      for (let i = 6; i >= 0; i--) {
        const day = new Date(today)
        day.setDate(today.getDate() - i)
        const key = day.toDateString()
        const count = cmdArr.filter((x: Commande) => x.date_commande && new Date(x.date_commande).toDateString() === key).length
        days.push(count)
      }
      setWeekly(days)

      setLoading(false)
    })
  }, [token])

  if (loading) return <Loader />

  const cards = [
    { label: 'Utilisateurs', val: stats.users, icon: ICON_USERS, bg: 'var(--admin-success-bg)', color: 'var(--green-mid)', s: 'utilisateurs' as Section },
    { label: 'Produits', val: stats.produits, icon: ICON_BOX, bg: '#EFF6FF', color: '#1D4ED8', s: 'produits' as Section },
    { label: 'Commandes', val: stats.commandes, icon: ICON_BAG, bg: '#F3E8FF', color: '#7E22CE', s: 'commandes' as Section },
    { label: 'Revenus', val: fm(stats.ca), icon: ICON_COIN, bg: '#FFF7ED', color: '#C2410C', s: 'commandes' as Section },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: 'var(--admin-text)' }}>Tableau de bord</h2>
        <p style={{ fontSize: 13.5, color: 'var(--admin-text-muted)', margin: 0 }}>Vue d&apos;ensemble de votre boutique</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 20 }}>
        {cards.map(c => (
          <button key={c.label} onClick={() => setSection(c.s)} style={{ ...CS, cursor: 'pointer', textAlign: 'left' as const, marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-faint)', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)' }}>{c.val}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {c.icon}
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1fr) minmax(280px,1.6fr)', gap: 16, marginBottom: 16 }}>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--admin-text)' }}>Statut des commandes</h3>
          <StatutDonut counts={statutCounts} />
        </div>
        <div style={CS}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px', color: 'var(--admin-text)' }}>Ventes de la semaine</h3>
          <WeeklySalesChart data={weekly} />
        </div>
      </div>

      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: 'var(--admin-text)' }}>Modifier le contenu du site</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['hero', 'arguments', 'bienfaits', 'plante', 'blog', 'histoire', 'partenaires', 'annonces', 'footer', 'contact', 'accueilConfig', 'couleurs'] as Section[]).map(s => (
            <button key={s} onClick={() => setSection(s)} style={{ background: 'var(--admin-success-bg)', color: 'var(--green-mid)', border: '1px solid var(--admin-success-bg)', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{TITLES[s]}</button>
          ))}
        </div>
      </div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// NOUVELLES SECTIONS
// ══════════════════════════════════════════════════════════════════════════════

// API déjà défini plus haut
const hdrs = (token: string) => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })

function SectionPromo({ token }: { token: string }) {
  const [promos, setPromos] = React.useState<any[]>([])
  const [form, setForm]     = React.useState({ code: '', type_reduction: 'pourcentage', valeur: 10, limite_utilisations: '', date_expiration: '' })
  const [msg, setMsg]       = React.useState('')

  React.useEffect(() => {
    fetch(`${API}/admin/promo/`, { headers: hdrs(token) })
      .then(r => r.json()).then(setPromos).catch(() => {})
  }, [token])

  const creer = async () => {
    const res = await fetch(`${API}/admin/promo/`, { method: 'POST', headers: hdrs(token), body: JSON.stringify(form) })
    const d   = await res.json()
    setMsg(d.detail || 'Erreur')
    if (res.ok) fetch(`${API}/admin/promo/`, { headers: hdrs(token) }).then(r => r.json()).then(setPromos)
  }

  const toggle = async (id: number, actif: boolean) => {
    await fetch(`${API}/admin/promo/${id}/`, { method: 'PATCH', headers: hdrs(token), body: JSON.stringify({ actif: !actif }) })
    fetch(`${API}/admin/promo/`, { headers: hdrs(token) }).then(r => r.json()).then(setPromos)
  }

  const supprimer = async (id: number) => {
    if (!confirm('Supprimer ce code promo ?')) return
    await fetch(`${API}/admin/promo/${id}/`, { method: 'DELETE', headers: hdrs(token) })
    setPromos(p => p.filter(x => x.id !== id))
  }

  const CS: React.CSSProperties = { background: 'var(--admin-card)', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }
  const IS: React.CSSProperties = { border: '1.5px solid var(--admin-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, width: '100%', boxSizing: 'border-box' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Créer un code promo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Code</label><input style={IS} placeholder="BIENVENUE10" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Type</label>
            <select style={IS} value={form.type_reduction} onChange={e => setForm(f => ({ ...f, type_reduction: e.target.value }))}>
              <option value="pourcentage">Pourcentage (%)</option>
              <option value="fixe">Montant fixe (FCFA)</option>
            </select>
          </div>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Valeur ({form.type_reduction === 'pourcentage' ? '%' : 'FCFA'})</label><input style={IS} type="number" value={form.valeur} onChange={e => setForm(f => ({ ...f, valeur: +e.target.value }))} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Limite (laisser vide = illimité)</label><input style={IS} type="number" placeholder="Ex: 50" value={form.limite_utilisations} onChange={e => setForm(f => ({ ...f, limite_utilisations: e.target.value }))} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Date expiration (optionnel)</label><input style={IS} type="datetime-local" value={form.date_expiration} onChange={e => setForm(f => ({ ...f, date_expiration: e.target.value }))} /></div>
        </div>
        <button onClick={creer} style={{ background: 'var(--green-mid)', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>+ Créer le code</button>
        {msg && <p style={{ marginTop: 8, fontSize: 13, color: 'var(--green-mid)' }}>{msg}</p>}
      </div>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Codes existants ({promos.length})</h3>
        {promos.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bg-section)' }}>
            <div>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 14 }}>{p.code}</span>
              <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text-muted)' }}>{p.valeur}{p.type_reduction === 'pourcentage' ? '%' : ' FCFA'} — {p.nb_utilisations}/{p.limite_utilisations || '∞'} utilisations</span>
              {!p.valide && <span style={{ marginLeft: 8, background: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', borderRadius: 4, padding: '2px 6px', fontSize: 11 }}>Expiré</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggle(p.id, p.actif)} style={{ background: p.actif ? 'var(--admin-success-bg)' : 'var(--admin-danger-bg)', color: p.actif ? 'var(--admin-success-text)' : 'var(--admin-danger)', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>{p.actif ? 'Actif' : 'Inactif'}</button>
              <button onClick={() => supprimer(p.id)} style={{ background: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Suppr.</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionZones({ token }: { token: string }) {
  const [zones, setZones] = React.useState<any[]>([])
  const [form, setForm]   = React.useState({ ville: '', prix: 1000, delai: '24-48h', disponible: true })
  const [msg, setMsg]     = React.useState('')

  React.useEffect(() => {
    fetch(`${API}/admin/zones-livraison/`, { headers: hdrs(token) })
      .then(r => r.json()).then(setZones).catch(() => {})
  }, [token])

  const creer = async () => {
    const res = await fetch(`${API}/admin/zones-livraison/`, { method: 'POST', headers: hdrs(token), body: JSON.stringify(form) })
    const d = await res.json(); setMsg(d.detail || 'Erreur')
    if (res.ok) fetch(`${API}/admin/zones-livraison/`, { headers: hdrs(token) }).then(r => r.json()).then(setZones)
  }

  const toggle = async (id: number, dispo: boolean) => {
    await fetch(`${API}/admin/zones-livraison/${id}/`, { method: 'PATCH', headers: hdrs(token), body: JSON.stringify({ disponible: !dispo }) })
    fetch(`${API}/admin/zones-livraison/`, { headers: hdrs(token) }).then(r => r.json()).then(setZones)
  }

  const CS: React.CSSProperties = { background: 'var(--admin-card)', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }
  const IS: React.CSSProperties = { border: '1.5px solid var(--admin-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, width: '100%', boxSizing: 'border-box' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Ajouter une ville</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Ville</label><input style={IS} placeholder="Cotonou" value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Prix (FCFA)</label><input style={IS} type="number" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: +e.target.value }))} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Délai</label><input style={IS} placeholder="24-48h" value={form.delai} onChange={e => setForm(f => ({ ...f, delai: e.target.value }))} /></div>
        </div>
        <button onClick={creer} style={{ background: 'var(--green-mid)', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>+ Ajouter</button>
        {msg && <p style={{ marginTop: 8, fontSize: 13, color: 'var(--green-mid)' }}>{msg}</p>}
      </div>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Villes configurées ({zones.length})</h3>
        {zones.map(z => (
          <div key={z.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bg-section)' }}>
            <div>
              <span style={{ fontWeight: 700 }}>{z.ville}</span>
              <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text-muted)' }}>{z.prix.toLocaleString()} FCFA — {z.delai}</span>
            </div>
            <button onClick={() => toggle(z.id, z.disponible)} style={{ background: z.disponible ? 'var(--admin-success-bg)' : 'var(--admin-danger-bg)', color: z.disponible ? 'var(--admin-success-text)' : 'var(--admin-danger)', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>{z.disponible ? 'Active' : 'Inactive'}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionBlacklist({ token }: { token: string }) {
  const [liste, setListe] = React.useState<any[]>([])
  const [form, setForm]   = React.useState({ valeur: '', type_blacklist: 'email', raison: '' })
  const [msg, setMsg]     = React.useState('')

  React.useEffect(() => {
    fetch(`${API}/admin/blacklist/`, { headers: hdrs(token) })
      .then(r => r.json()).then(d => setListe(d.results || [])).catch(() => {})
  }, [token])

  const ajouter = async () => {
    const res = await fetch(`${API}/admin/blacklist/`, { method: 'POST', headers: hdrs(token), body: JSON.stringify(form) })
    const d = await res.json(); setMsg(d.detail || 'Erreur')
    if (res.ok) fetch(`${API}/admin/blacklist/`, { headers: hdrs(token) }).then(r => r.json()).then(d => setListe(d.results || []))
  }

  const retirer = async (id: number) => {
    await fetch(`${API}/admin/blacklist/${id}/`, { method: 'DELETE', headers: hdrs(token) })
    setListe(l => l.filter(x => x.id !== id))
  }

  const CS: React.CSSProperties = { background: 'var(--admin-card)', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }
  const IS: React.CSSProperties = { border: '1.5px solid var(--admin-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, width: '100%', boxSizing: 'border-box' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Bloquer un email ou une IP</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Type</label>
            <select style={IS} value={form.type_blacklist} onChange={e => setForm(f => ({ ...f, type_blacklist: e.target.value }))}>
              <option value="email">Email</option>
              <option value="ip">Adresse IP</option>
            </select>
          </div>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Valeur</label><input style={IS} placeholder="email@spam.com ou 1.2.3.4" value={form.valeur} onChange={e => setForm(f => ({ ...f, valeur: e.target.value }))} /></div>
          <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Raison</label><input style={IS} placeholder="Spam, tentatives multiples..." value={form.raison} onChange={e => setForm(f => ({ ...f, raison: e.target.value }))} /></div>
        </div>
        <button onClick={ajouter} style={{ background: 'var(--admin-danger)', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Bloquer</button>
        {msg && <p style={{ marginTop: 8, fontSize: 13, color: 'var(--green-mid)' }}>{msg}</p>}
      </div>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Éléments bloqués ({liste.length})</h3>
        {liste.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Aucun élément bloqué.</p>}
        {liste.map(b => (
          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bg-section)' }}>
            <div>
              <span style={{ background: 'var(--admin-danger-bg)', color: 'var(--admin-danger)', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 700, marginRight: 8 }}>{b.type}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{b.valeur}</span>
              {b.raison && <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: 12 }}>— {b.raison}</span>}
            </div>
            <button onClick={() => retirer(b.id)} style={{ background: 'var(--admin-bg-alt)', color: 'var(--admin-text-muted)', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Retirer</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionAlertes({ token }: { token: string }) {
  const [alertes, setAlertes] = React.useState<any[]>([])
  const [produits, setProduits] = React.useState<any[]>([])
  const [form, setForm] = React.useState({ produit_id: '', seuil: 5, email_alerte: '' })
  const [msg, setMsg]   = React.useState('')

  React.useEffect(() => {
    fetch(`${API}/admin/alertes-stock/`, { headers: hdrs(token) }).then(r => r.json()).then(setAlertes).catch(() => {})
    fetch(`${API}/admin/produits/`, { headers: hdrs(token) }).then(r => r.json()).then(d => setProduits(Array.isArray(d) ? d : d.results || [])).catch(() => {})
  }, [token])

  const sauvegarder = async () => {
    const res = await fetch(`${API}/admin/alertes-stock/`, { method: 'POST', headers: hdrs(token), body: JSON.stringify(form) })
    const d = await res.json(); setMsg(d.detail || 'Erreur')
    if (res.ok) fetch(`${API}/admin/alertes-stock/`, { headers: hdrs(token) }).then(r => r.json()).then(setAlertes)
  }

  const CS: React.CSSProperties = { background: 'var(--admin-card)', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }
  const IS: React.CSSProperties = { border: '1.5px solid var(--admin-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, width: '100%', boxSizing: 'border-box' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Configurer une alerte stock</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Produit</label>
            <select style={IS} value={form.produit_id} onChange={e => setForm(f => ({ ...f, produit_id: e.target.value }))}>
              <option value="">-- Choisir un produit --</option>
              {produits.map((p: any) => <option key={p.id} value={p.id}>{p.nom} (stock: {p.stock})</option>)}
            </select>
          </div>
          <div><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Seuil d'alerte</label><input style={IS} type="number" value={form.seuil} onChange={e => setForm(f => ({ ...f, seuil: +e.target.value }))} /></div>
          <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email alerte (vide = admin par défaut)</label><input style={IS} type="email" placeholder="email@exemple.com" value={form.email_alerte} onChange={e => setForm(f => ({ ...f, email_alerte: e.target.value }))} /></div>
        </div>
        <button onClick={sauvegarder} style={{ background: '#F59E0B', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Configurer l'alerte</button>
        {msg && <p style={{ marginTop: 8, fontSize: 13, color: 'var(--green-mid)' }}>{msg}</p>}
      </div>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Alertes configurées</h3>
        {alertes.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Aucune alerte configurée.</p>}
        {alertes.map((a: any) => (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bg-section)' }}>
            <div>
              <span style={{ fontWeight: 700 }}>{a.produit_nom}</span>
              <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)' }}>Seuil: {a.seuil} — Stock actuel: {a.stock_actuel}</span>
              {a.en_alerte && <span style={{ marginLeft: 8, background: '#FEF3C7', color: '#D97706', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 700 }}>EN ALERTE</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionRapport({ token }: { token: string }) {
  const now     = new Date()
  const [mois, setMois]   = React.useState(now.getMonth() + 1)
  const [annee, setAnnee] = React.useState(now.getFullYear())

  const telecharger = () => {
    window.open(`${API}/admin/rapport-pdf/?mois=${mois}&annee=${annee}`, '_blank')
  }

  const exportExcel = () => window.open(`${API}/admin/commandes/?format=excel`, '_blank')
  const exportCsv   = () => window.open(`${API}/admin/commandes/?format=csv`, '_blank')

  const CS: React.CSSProperties = { background: 'var(--admin-card)', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }
  const IS: React.CSSProperties = { border: '1.5px solid var(--admin-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13 }

  const moisFr = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Rapport mensuel PDF</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Générez un rapport complet des ventes (commandes, CA, détail) pour le mois de votre choix.</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Mois</label>
            <select style={IS} value={mois} onChange={e => setMois(+e.target.value)}>
              {moisFr.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Année</label>
            <input style={IS} type="number" value={annee} onChange={e => setAnnee(+e.target.value)} />
          </div>
          <button onClick={telecharger} style={{ background: 'var(--green-mid)', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
            Télécharger le rapport PDF
          </button>
        </div>
      </div>
      <div style={CS}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Export des commandes</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Exportez toutes les commandes en Excel ou CSV pour analyse.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={exportExcel} style={{ background: '#1D6F42', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Export Excel (.xlsx)</button>
          <button onClick={exportCsv}   style={{ background: '#457B9D', color: 'var(--admin-card)', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Export CSV</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const [token, setToken] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [section, setSection] = useState<Section>('dashboard')
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('pio_access')
    if (t) { setToken(t); setLoggedIn(true) }
  }, [])

  const logout = () => { localStorage.removeItem('pio_access'); setToken(''); setLoggedIn(false) }

  if (!loggedIn) return <LoginScreen onLogin={t => { setToken(t); setLoggedIn(true); localStorage.setItem('pio_access', t) }} />

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg-alt)', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <aside style={{ width: open ? 220 : 60, flexShrink: 0, background: 'var(--navbar-bg)', display: 'flex', flexDirection: 'column', transition: 'width .22s ease', overflow: 'hidden', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '16px 12px 12px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'var(--gold)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-card)', fontWeight: 900, fontSize: 13, flexShrink: 0 }}>PP</div>
            {open && <div><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bg-section)' }}>Pio Pio</div><div style={{ fontSize: 10, color: '#6B9E7A' }}>Administration</div></div>}
          </div>
        </div>
        <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
          {['General', 'Site', 'Gestion'].map(g => (
            <div key={g}>
              {open && <div style={{ fontSize: 9, fontWeight: 700, color: '#4D7A5E', letterSpacing: '1.5px', textTransform: 'uppercase' as const, padding: '10px 14px 3px' }}>{g === 'Site' ? 'MODIFIER LE SITE' : g === 'Gestion' ? 'OUTILS' : g.toUpperCase()}</div>}
              {NAV.filter(n => n.group === g).map(({ s, label }) => (
                <button key={s} onClick={() => setSection(s)} title={!open ? label : undefined} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', background: section === s ? 'rgba(201,151,58,.15)' : 'transparent', borderLeft: `3px solid ${section === s ? 'var(--gold)' : 'transparent'}`, border: 'none', borderTop: 'none', borderRight: 'none', borderBottom: 'none', cursor: 'pointer', color: section === s ? 'var(--bg-section)' : 'var(--green-light)', fontSize: 12, fontWeight: section === s ? 700 : 400, whiteSpace: 'nowrap' as const, overflow: 'hidden' }}
                  onMouseEnter={e => { if (section !== s) e.currentTarget.style.background = 'rgba(255,255,255,.06)' }}
                  onMouseLeave={e => { if (section !== s) e.currentTarget.style.background = 'transparent' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: section === s ? 'var(--gold)' : 'rgba(255,255,255,.2)', flexShrink: 0 }} />
                  {open && <span>{label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '10px 10px', display: 'flex', gap: 6, flexDirection: open ? 'row' : 'column' as const, alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ flex: open ? 1 : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '7px 10px', fontSize: 12, color: 'var(--green-light)', textDecoration: 'none', fontWeight: 600 }}>{open ? 'Voir le site' : 'V'}</a>
          <button onClick={logout} style={{ flex: open ? 1 : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 6, padding: '7px 10px', fontSize: 12, color: '#FCA5A5', cursor: 'pointer', fontWeight: 600 }}>{open ? 'Deconnexion' : 'X'}</button>
        </div>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: 'var(--admin-card)', borderBottom: '1px solid var(--admin-border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setOpen(!open)} style={{ background: 'var(--admin-bg-alt)', border: '1px solid var(--admin-border)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 13, color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{open ? '<' : '>'}</button>
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--admin-text)' }}>{TITLES[section]}</h1>
          </div>
          <div style={{ fontSize: 12, color: 'var(--admin-text-faint)' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </header>
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {section === 'dashboard' && <Dashboard token={token} setSection={setSection} />}
          {section === 'commandes' && <Commandes token={token} />}
          {section === 'produits' && <Produits token={token} />}
          {section === 'temoignages' && <Temoignages token={token} />}
          {section === 'messages' && <Messages token={token} />}
          {section === 'utilisateurs' && <Utilisateurs token={token} />}
          {section === 'newsletter' && <Newsletter token={token} />}
          {section === 'hero' && <SectionHero token={token} />}
          {section === 'arguments' && <SectionArguments token={token} />}
          {section === 'plante' && <SectionPlante token={token} />}
          {section === 'bienfaits' && <SectionBienfaits token={token} />}
          {section === 'tasse' && <SectionTasse token={token} />}
          {section === 'fondateur' && <SectionFondateur token={token} />}
          {section === 'stats' && <SectionStats token={token} />}
          {section === 'histoire' && <SectionHistoire token={token} />}
          {section === 'blog' && <SectionBlog token={token} />}
          {section === 'partenaires' && <SectionPartenaires token={token} />}
          {section === 'annonces' && <SectionAnnonces token={token} />}
          {section === 'footer' && <SectionFooter token={token} />}
          {section === 'contact' && <SectionContactConfig token={token} />}
          {section === 'accueilConfig' && <SectionAccueilConfig token={token} />}
          {section === 'couleurs' && <SectionCouleurs token={token} />}
          {section === 'promo' && <SectionPromo token={token} />}
          {section === 'zones' && <SectionZones token={token} />}
          {section === 'blacklist' && <SectionBlacklist token={token} />}
          {section === 'alertes' && <SectionAlertes token={token} />}
          {section === 'rapport' && <SectionRapport token={token} />}
        </main>
      </div>
    </div>
  )
}
