'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useSiteConfig } from '@/lib/useSiteConfig'
import { useLang } from '@/context/LanguageContext'
import { fetchAvecAuth } from '@/context/AuthContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const PRODUITS_FALLBACK = [
  {
    id: 'f1', nom: 'Sachet unitaire Thé Pio Pio', slug: 'the-pio-pio-sachet-unitaire',
    description: 'Découvrez le Thé Pio Pio — votre allié bien-être au quotidien. Ingrédient phare : la verveine blanche citronnée, reconnue pour ses vertus relaxantes, nettoyante naturelle des artères, riche en vitamine K essentielle pour votre équilibre interne. Commande minimale : 6 sachets.',
    prix: 100, unite: 'sachet', badge: '🌿 Nouveau produit',
    image: '', disponible: true, en_stock: true, stock: 0, quantite_min: 6,
  },
  {
    id: 'f2', nom: 'Thé Pio Pio — Sachet verveine citronnelle', slug: 'the-pio-pio-sachet-verveine',
    description: 'Le Thé Pio Pio fait à base de verveine à la citronnelle, 100% Bio. Cultivé naturellement à Porto-Novo, Bénin. Reconnu pour ses vertus relaxantes, nettoyantes des artères et riche en vitamine K. Votre allié bien-être au quotidien.',
    prix: 1000, unite: 'sachet', badge: '🌿 100% Bio',
    image: '', disponible: true, en_stock: true, stock: 0, quantite_min: 1,
  },
]
const MEDIA_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'

// ── Types ──────────────────────────────────────────────────────────────────
type Produit = {
  id: number
  nom: string
  slug: string
  description: string
  prix: number
  unite: string
  badge: string
  image: string | null
  disponible: boolean
  stock: number
  en_stock: boolean
  quantite_min: number
}

type LignePanier = { produit: Produit; quantite: number }

// ── Lecture sûre du localStorage (SSR-safe) ────────────────────────────────
function lireStorage(cle: string): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(cle) } catch { return null }
}

// ── Composant PanierMini ──────────────────────────────────────────────────
function PanierMini({ panier, onClose, onCommander, onSupprimer }: {
  panier: LignePanier[]
  onClose: () => void
  onCommander: () => void
  onSupprimer: (id: number) => void
}) {
  const { lang, t } = useLang()
  const total = panier.filter(l => l?.produit?.id).reduce((s, l) => s + l.produit.prix * l.quantite, 0)

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 200, display: 'flex', justifyContent: 'flex-end'
    }}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: 400,
        padding: 28, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A3C2E' }}>{t('boutique.panierTitre')}</h2>
          <button onClick={onClose} style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>

        {panier.length === 0 ? (
          <p style={{ color: '#888', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>{t('boutique.panierVide')}</p>
        ) : panier.map(l => (
          <div key={l.produit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#1A3C2E' }}>{l.produit.nom}</p>
              <p style={{ fontSize: 13, color: '#666' }}>{`${t('boutique.qty')} ${l.quantite}`}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <p style={{ fontWeight: 700, color: '#C9973A' }}>{(l.produit.prix * l.quantite).toLocaleString()} FCFA</p>
              <button
                onClick={() => onSupprimer(l.produit.id)}
                style={{ fontSize: 11, color: '#e53935', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Arial, sans-serif', padding: 0 }}
              >
                ✕ Supprimer
              </button>
            </div>
          </div>
        ))}

        <div style={{ borderTop: '2px solid #1A3C2E', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1A3C2E' }}>Total</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#C9973A' }}>{total.toLocaleString()} FCFA</span>
        </div>

        <button
          onClick={onCommander}
          disabled={panier.length === 0}
          className="btn-gold"
          style={{ width: '100%', textAlign: 'center', opacity: panier.length === 0 ? 0.5 : 1 }}
        >
          Passer la commande →
        </button>
      </div>
    </div>
  )
}

// ── Composant Modal Commande ────────────────────────────────────────────────
function ModalCommande({ panier, onClose, onSuccess }: {
  panier: LignePanier[]
  onClose: () => void
  onSuccess: (id: number, mode?: string) => void
}) {
  const { lang, t } = useLang()
  const total = panier.filter(l => l?.produit?.id).reduce((s, l) => s + l.produit.prix * l.quantite, 0)

  // Pré-remplir depuis le profil stocké
  const utilisateur = (() => {
    try {
      const raw = lireStorage('pio_user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })()

  const [codePromo, setCodePromo]         = useState('');
  const [promoApplique, setPromoApplique] = useState<any>(null);
  const [promoErreur, setPromoErreur]     = useState('');
  const [promoLoading, setPromoLoading]   = useState(false);
  const [zones, setZones]                 = useState<{ville: string; prix: number; delai: string}[]>([]);
  const [fraisLivraison, setFraisLivraison] = useState(0);

  // Charger les zones de livraison
  useEffect(() => {
    fetch(`${API_BASE}/zones-livraison/`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setZones(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);


  const validerCodePromo = async () => {
    if (!codePromo.trim()) return;
    setPromoLoading(true);
    setPromoErreur('');
    try {
      const res = await fetch(`${API_BASE}/promo/valider/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codePromo.toUpperCase(), total }),
      });
      const data = await res.json();
      if (res.ok) { setPromoApplique(data); }
      else { setPromoErreur(data.detail || 'Code invalide.'); }
    } catch { setPromoErreur('Erreur réseau.'); }
    finally { setPromoLoading(false); }
  };

  const [form, setForm] = useState({
    nom_client: utilisateur?.nom_complet || utilisateur?.nom || '',
    email_client: utilisateur?.email || '',
    telephone_client: utilisateur?.telephone || '',
    ville_livraison: utilisateur?.ville || '',
    adresse_livraison: '',
    mode_paiement: 'mtn_money',
    notes: ''
  })
  // Mettre à jour les frais selon la ville
  useEffect(() => {
    const zone = zones.find(z => z.ville.toLowerCase() === form.ville_livraison.toLowerCase());
    setFraisLivraison(zone ? zone.prix : 0);
  }, [form.ville_livraison, zones]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetchAvecAuth(`${API_BASE}/commandes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          code_promo: codePromo.toUpperCase(),
          lignes: panier.map(l => ({ produit_id: l.produit.id, quantite: l.quantite }))
        })
      })

      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          setError(t('boutique.errSession'))
        } else {
          setError(data.detail || t('boutique.errGenerale'))
        }
        return
      }

      // ── Fedapay : redirection vers la page de paiement ──
      if (data.fedapay_url) {
        window.location.href = data.fedapay_url
        return
      }

      // ── Virement bancaire : afficher les instructions ──
      if (form.mode_paiement === 'virement') {
        setError('')
        onSuccess(data.commande_id, 'virement')
        return
      }

      onSuccess(data.commande_id, form.mode_paiement)
    } catch {
      setError(t('boutique.errReseau'))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid #D4C9B0',
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 14,
    fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#FAFAF7',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A3C2E' }}>{t('boutique.finaliser')}</h2>
          <button onClick={onClose} style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>

        {/* Récap */}
        <div style={{ background: '#F5F0E8', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          {panier.map(l => (
            <div key={l.produit.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>{l.produit.nom} ×{l.quantite}</span>
              <span style={{ fontWeight: 600 }}>{(l.produit.prix * l.quantite).toLocaleString()} FCFA</span>
            </div>
          ))}
          {fraisLivraison > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginTop: 4 }}>
              <span>🚚 Livraison ({zones.find(z=>z.ville.toLowerCase()===form.ville_livraison.toLowerCase())?.delai || ''})</span>
              <span>+{fraisLivraison.toLocaleString()} FCFA</span>
            </div>
          )}
          {promoApplique && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#2D6A4F', marginTop: 4 }}>
              <span>🎟️ Code promo ({codePromo.toUpperCase()})</span>
              <span>-{promoApplique.reduction.toLocaleString()} FCFA</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid #D4C9B0', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1A3C2E' }}>
            <span>Total TTC</span>
            <span style={{ color: '#C9973A' }}>
              {Math.max(0, total + fraisLivraison - (promoApplique?.reduction || 0)).toLocaleString()} FCFA
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{t('boutique.nomComplet')}</label>
              <input name="nom_client" required value={form.nom_client} onChange={handleChange} style={inputStyle} placeholder={t('boutique.votreNom')} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{t('boutique.telMM')}</label>
              <input name="telephone_client" required value={form.telephone_client} onChange={handleChange} style={inputStyle} placeholder="+229 01 XX XX XX XX ou +33 6 XX XX XX XX" pattern="^\+?[\d\s\-\.\(\)]{6,20}$" title="Numéro de téléphone valide (international accepté)" />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Email *</label>
            <input name="email_client" type="email" required value={form.email_client} onChange={handleChange} style={inputStyle} placeholder="email@exemple.com" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{t('boutique.ville')}</label>
              <input name="ville_livraison" required value={form.ville_livraison} onChange={handleChange} style={inputStyle} placeholder={t('boutique.villePh')} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{t('boutique.modePaiement')}</label>
              <select name="mode_paiement" value={form.mode_paiement} onChange={handleChange} style={inputStyle}>
                <option value="fedapay">💳 Carte / Mobile Money (Fedapay)</option>
                <option value="mtn_money">📱 MTN Money (manuel)</option>
                <option value="moov_money">📲 Moov Money (manuel)</option>
                <option value="wave">🌊 Wave (manuel)</option>
                <option value="orange_money">🟠 Orange Money (manuel)</option>
                <option value="virement">🏦 Virement bancaire</option>
                <option value="livraison">🚚 Paiement à la livraison</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{t('boutique.adresse')}</label>
            <input name="adresse_livraison" value={form.adresse_livraison} onChange={handleChange} style={inputStyle} placeholder={t('boutique.adressePh')} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{t('boutique.notes')}</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} style={{ ...inputStyle, height: 70, resize: 'none' }} placeholder={t('boutique.notesPh')} />
          </div>

          {/* ── Code promo ── */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>
              🎟️ Code promo (optionnel)
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={codePromo}
                onChange={e => { setCodePromo(e.target.value.toUpperCase()); setPromoApplique(null); setPromoErreur(''); }}
                style={{ ...inputStyle, flex: 1, textTransform: 'uppercase' }}
                placeholder="EX: BIENVENUE10"
              />
              <button
                type="button"
                onClick={validerCodePromo}
                disabled={promoLoading || !codePromo.trim()}
                style={{ padding: '10px 14px', background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13 }}
              >
                {promoLoading ? '...' : 'Appliquer'}
              </button>
            </div>
            {promoApplique && (
              <p style={{ color: '#2D6A4F', fontSize: 12, marginTop: 4 }}>
                ✅ Code valide — réduction de {promoApplique.reduction.toLocaleString()} FCFA
              </p>
            )}
            {promoErreur && <p style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>⚠️ {promoErreur}</p>}
          </div>

          {error && <p style={{ color: '#dc3545', fontSize: 13, background: '#fff0f0', padding: '8px 12px', borderRadius: 6 }}>{error}</p>}

          {/* Instructions virement bancaire */}
          {form.mode_paiement === 'virement' && (
            <div style={{ background: '#F0F8FF', border: '1px solid #B0D4F0', borderRadius: 10, padding: '12px 16px', fontSize: 13 }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: '#0A3D62' }}>Coordonnées bancaires</div>
              <div style={{ color: '#1A3C2E', lineHeight: 1.8 }}>
                <strong>Banque :</strong> NSIA Banque Bénin<br/>
                <strong>Titulaire :</strong> Tropicana Pio Pio SARL<br/>
                <strong>IBAN/RIB :</strong> BJ0601234567890123456<br/>
                <strong>Référence :</strong> CMD-[votre numéro de commande]
              </div>
              <div style={{ marginTop: 8, color: '#555', fontSize: 12 }}>
                Votre commande sera confirmée dès réception du virement (1–2 jours ouvrés).
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? t('boutique.envoi')
              : form.mode_paiement === 'fedapay'
                ? `💳 Payer ${total.toLocaleString()} FCFA en ligne`
                : `✅ Confirmer — ${total.toLocaleString()} FCFA`}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Page principale Boutique ────────────────────────────────────────────────
export default function Boutique() {
  const site = useSiteConfig()
  const { lang, t } = useLang()
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading]   = useState(true)
  const [estConnecte, setEstConnecte] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [panier, setPanier] = useState<LignePanier[]>([])
  const [panierCharge, setPanierCharge] = useState(false)
  const [quantities, setQty] = useState<Record<number, number>>({})
  const [panierOpen, setPanierOpen] = useState(false)
  const [commandeOpen, setCommandeOpen] = useState(false)
  const [confirmation, setConfirmation] = useState<number | null>(null)

  // ── Vérification connexion (réactive aux changements d'onglet) ────────────
  const verifierConnexion = useCallback(() => {
    const token = lireStorage('pio_access')
    setEstConnecte(!!token)
  }, [])

  useEffect(() => {
    verifierConnexion()
    window.addEventListener('storage', verifierConnexion)
    window.addEventListener('focus', verifierConnexion)
    return () => {
      window.removeEventListener('storage', verifierConnexion)
      window.removeEventListener('focus', verifierConnexion)
    }
  }, [verifierConnexion])

  // ── Chargement panier : localStorage d'abord, puis fusion avec backend ─────
  useEffect(() => {
    try {
      const saved = lireStorage('pio_panier')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const valid = parsed.filter((l: any) => l && l.produit && l.produit.id)
          setPanier(valid)
        } catch {}
      }
    } catch {}
    setPanierCharge(true)
  }, [])

  // ── Sauvegarde panier localStorage (toujours) ─────────────────────────────
  useEffect(() => {
    if (!panierCharge) return
    try { localStorage.setItem('pio_panier', JSON.stringify(panier)) } catch {}
  }, [panier, panierCharge])

  // ✅ Sauvegarde panier backend quand l'utilisateur est connecté
  useEffect(() => {
    if (!panierCharge || !estConnecte || panier.length === 0) return
    const token = lireStorage('pio_access')
    if (!token) return
    // Sauvegarder dans un endpoint dédié (clé simple user-panier)
    fetch(`${API_BASE}/auth/panier/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ lignes: panier.map(l => ({ produit_id: l.produit.id, quantite: l.quantite })) }),
    }).catch(() => {}) // Silencieux — localStorage reste la source principale
  }, [panier, panierCharge, estConnecte])

  // ✅ Restaurer le panier depuis le backend à la connexion
  useEffect(() => {
    if (!estConnecte || !panierCharge) return
    const token = lireStorage('pio_access')
    if (!token) return
    fetch(`${API_BASE}/auth/panier/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.lignes?.length) return
        // Fusionner avec le panier local existant (les articles locaux ont priorité)
        setPanier(prev => {
          const fusionné = [...prev]
          for (const ligne of data.lignes) {
            const existe = fusionné.find(l => l.produit.id === ligne.produit.id)
            if (!existe && ligne.produit) fusionné.push({ produit: ligne.produit, quantite: ligne.quantite })
          }
          return fusionné
        })
      })
      .catch(() => {})
  }, [estConnecte, panierCharge])

  // ── Chargement produits ───────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/produits/`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const liste: Produit[] = Array.isArray(data) ? data : data?.results ?? []
        const final = liste.length > 0 ? liste : (PRODUITS_FALLBACK as any)
        setProduits(final)
        setQty(Object.fromEntries(final.map((p: any) => [p.id, p.quantite_min || 1])))
      })
      .catch(() => {
        setProduits(PRODUITS_FALLBACK as any)
        setQty(Object.fromEntries(PRODUITS_FALLBACK.map(p => [p.id, 1])))
      })
      .finally(() => setLoading(false))
  }, [])

  const ajouterAuPanier = (produit: Produit) => {
    if (!estConnecte) { setShowAuthModal(true); return }
    const q = quantities[produit.id] || 1
    setPanier(prev => {
      const ex = prev.find(l => l.produit.id === produit.id)
      if (ex) return prev.map(l => l.produit.id === produit.id ? { ...l, quantite: l.quantite + q } : l)
      return [...prev, { produit, quantite: q }]
    })
    setPanierOpen(true)
  }

  const supprimerDuPanier = (id: number) => {
    setPanier(prev => prev.filter(l => l.produit.id !== id))
  }

  const totalPanier = panier.reduce((s, l) => s + l.quantite, 0)

  if (confirmation) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <div style={{ fontSize: 64 }}>✅</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A3C2E', textAlign: 'center' }}>{`${t('boutique.cmdNum')}${confirmation} ${t('boutique.cmdConfirmee')}`}</h1>
        <p style={{ color: '#555', fontSize: 16, textAlign: 'center', maxWidth: 440 }}>
          {t('boutique.merciCmd')}
        </p>
        <p style={{ color: '#1A3C2E', fontWeight: 600 }}>📞 {site.telephone}</p>
        <Link href="/" className="btn-gold">← Retour à l&apos;accueil</Link>
      </div>
    )
  }

  return (
    <>
      {/* Modal connexion requise */}
      {showAuthModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 32px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A3C2E', marginBottom: 12 }}>{t('boutique.cnxRequise')}</h2>
            <p style={{ fontSize: 15, color: '#666', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 28 }}>
              Pour passer une commande, vous devez être connecté à votre compte. C&apos;est rapide et gratuit !
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="/connexion" className="btn-gold" style={{ display: 'block', textAlign: 'center', padding: '14px 24px', fontSize: 15 }}>
                → Se connecter
              </Link>
              <Link href="/inscription" style={{ display: 'block', textAlign: 'center', padding: '14px 24px', fontSize: 15, background: '#EAF4EE', color: '#1A3C2E', borderRadius: 50, fontWeight: 700, fontFamily: 'Arial, sans-serif', textDecoration: 'none' }}>
                Créer un compte gratuit
              </Link>
              <button onClick={() => setShowAuthModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#999', fontFamily: 'Arial, sans-serif', marginTop: 4 }}>
                Continuer à parcourir la boutique
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panier flottant */}
      {totalPanier > 0 && !panierOpen && (
        <button
          onClick={() => setPanierOpen(true)}
          style={{
            position: 'fixed', bottom: 110, right: 20, zIndex: 150,
            background: '#1A3C2E', color: '#fff', border: 'none',
            borderRadius: 30, padding: '12px 20px', cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'Arial, sans-serif',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          {`🛒 ${totalPanier} ${lang === 'en' ? `item${totalPanier > 1 ? 's' : ''}` : `article${totalPanier > 1 ? 's' : ''}`} ${t('boutique.voirPanier')}`}
        </button>
      )}

      {panierOpen && (
        <PanierMini
          panier={panier}
          onClose={() => setPanierOpen(false)}
          onSupprimer={supprimerDuPanier}
          onCommander={() => {
            if (!estConnecte) { setPanierOpen(false); setShowAuthModal(true); return }
            setPanierOpen(false); setCommandeOpen(true)
          }}
        />
      )}

      {commandeOpen && (
        <ModalCommande
          panier={panier}
          onClose={() => setCommandeOpen(false)}
          onSuccess={(id) => { setCommandeOpen(false); setPanier([]); setConfirmation(id) }}
        />
      )}

      {/* Hero boutique */}
      <section style={{ position: 'relative', height: 340, overflow: 'hidden' }}>
        <Image src="/images/tasse-dessus.jpg" alt="Boutique Thé Pio Pio" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,20,0.72)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 40 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <span style={{ fontSize: 11, letterSpacing: '3.5px', color: '#C9973A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{t('boutique.label')}</span>
            <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, color: '#F0EBE0', marginTop: 12, fontFamily: 'var(--font-cormorant), Georgia, serif', letterSpacing: '-0.5px' }}>
              Commandez votre <em style={{ color: '#C9973A' }}>Thé Pio Pio</em>
            </h1>
            <p style={{ color: '#95D5B2', fontSize: 15, fontFamily: 'Arial, sans-serif', marginTop: 10, maxWidth: 480, fontWeight: 300 }}>
              {t('boutique.labelSub')}
            </p>
          </div>
        </div>
      </section>

      {/* Bande réassurance */}
      <div style={{ background: '#1A3C2E', borderBottom: '1px solid rgba(201,151,58,0.2)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '🚚', text: t('boutique.liv2472') },
            { icon: '✅', text: t('boutique.naturelBio') },
            { icon: '💳', text: t('boutique.mobileMoney') },
            { icon: '🔄', text: t('boutique.satisfait') },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: '#95D5B2', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Produits */}
      <section style={{ background: '#FAFAF7', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 13, letterSpacing: '2.5px', color: '#C9973A', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{t('boutique.nosProds')}</span>
            <h2 style={{ fontSize: 30, fontWeight: 400, color: '#1A3C2E', marginTop: 8 }}>{t('boutique.cmderEnLigne')}</h2>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#eee', borderRadius: 16, height: 380, width: 320, animation: 'pulse 1.5s infinite' }} />
            </div>
          ) : produits.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', fontSize: 16 }}>
              Aucun produit disponible pour le moment. Revenez bientôt !
            </p>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
              {produits.map(produit => (
                <div key={produit.id} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.09)', display: 'flex', flexDirection: 'column', border: '1px solid #EDE6D9', transition: 'transform 0.3s ease, box-shadow 0.3s ease', width: '100%', maxWidth: 360 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.14)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.09)' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: 260, background: '#F5F0E8' }}>
                    {produit.image ? (
                      <Image
                        src={produit.image.startsWith('http') ? produit.image : `${MEDIA_BASE}${produit.image}`}
                        alt={produit.nom}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>🌿</div>
                    )}
                    {produit.badge && (
                      <span style={{ position: 'absolute', top: 12, right: 12, background: '#C9973A', color: '#1A3C2E', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 4, fontFamily: 'Arial, sans-serif' }}>
                        {produit.badge}
                      </span>
                    )}
                    {/* ✅ Badge épuisé */}
                    {!produit.en_stock && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#EF4444', color: '#fff', fontSize: 14, fontWeight: 700, padding: '8px 18px', borderRadius: 8, fontFamily: 'Arial, sans-serif', letterSpacing: 1 }}>
                          ÉPUISÉ
                        </span>
                      </div>
                    )}
                    {/* Badge stock faible */}
                    {produit.en_stock && produit.stock > 0 && produit.stock <= 5 && (
                      <span style={{ position: 'absolute', bottom: 10, left: 10, background: '#F97316', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, fontFamily: 'Arial, sans-serif' }}>
                        ⚡ Plus que {produit.stock} en stock !
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 400, color: '#1A3C2E', margin: 0, fontFamily: 'var(--font-cormorant), Georgia, serif', letterSpacing: '-0.3px' }}>{produit.nom}</h3>
                    <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, flex: 1 }}>
                      {produit.description.slice(0, 120)}{produit.description.length > 120 ? '…' : ''}
                    </p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: '#C9973A', margin: '4px 0', fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                      {produit.prix.toLocaleString()} FCFA <span style={{ fontSize: 13, color: '#999', fontWeight: 400 }}>/ {produit.unite}</span>
                    </p>

                    {/* Zone commande selon statut connexion */}
                    {estConnecte ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: '#555', fontFamily: 'Arial, sans-serif' }}>{lang === 'en' ? 'Qty:' : 'Quantité :'}</span>
                          <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                            <button
                              onClick={() => setQty(q => ({ ...q, [produit.id]: Math.max(produit.quantite_min || 1, (q[produit.id] || produit.quantite_min || 1) - 1) }))}
                              style={{ width: 34, height: 34, border: 'none', background: '#1A3C2E', cursor: 'pointer', fontSize: 18, color: '#F0EBE0', borderRadius: '8px 0 0 8px', fontWeight: 700 }}
                            >−</button>
                            <span style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#1A3C2E', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', background: '#F5F0E8' }}>
                              {quantities[produit.id] || produit.quantite_min || 1}
                            </span>
                            <button
                              onClick={() => setQty(q => ({ ...q, [produit.id]: (q[produit.id] || produit.quantite_min || 1) + 1 }))}
                              style={{ width: 34, height: 34, border: 'none', background: '#1A3C2E', cursor: 'pointer', fontSize: 18, color: '#F0EBE0', borderRadius: '0 8px 8px 0', fontWeight: 700 }}
                            >+</button>
                          </div>
                          <span style={{ fontSize: 13, color: '#C9973A', fontWeight: 600 }}>
                            = {((quantities[produit.id] || produit.quantite_min || 1) * produit.prix).toLocaleString()} FCFA
                          </span>
                        </div>
                        {(produit.quantite_min || 1) > 1 && (
                          <p style={{ fontSize: 11, color: '#888', fontFamily: 'Arial, sans-serif', margin: '0 0 8px', textAlign: 'center' }}>
                            {lang === 'en' ? `Min. order: ${produit.quantite_min} units` : `Commande min. : ${produit.quantite_min} unités`}
                          </p>
                        )}
                        <button onClick={() => ajouterAuPanier(produit)} className="btn-gold" style={{ width: '100%', textAlign: 'center', opacity: produit.en_stock ? 1 : 0.5, cursor: produit.en_stock ? 'pointer' : 'not-allowed' }} disabled={!produit.en_stock}>
                          {produit.en_stock ? `🛒 ${t('boutique.ajouter')}` : `❌ ${t('boutique.enRupture')}`}
                        </button>
                      </>
                    ) : (
                      <div style={{ background: '#F5F0E8', borderRadius: 12, padding: '14px 16px', textAlign: 'center', border: '1px dashed #C9973A' }}>
                        <p style={{ fontSize: 13, color: '#555', margin: '0 0 10px', fontFamily: 'Arial, sans-serif' }}>
                          🔒 Connectez-vous pour commander
                        </p>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <Link href="/connexion" style={{ background: '#1A3C2E', color: '#F0EBE0', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontFamily: 'Arial, sans-serif' }}>
                            Se connecter
                          </Link>
                          <Link href="/inscription" style={{ background: '#C9973A', color: '#1A3C2E', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontFamily: 'Arial, sans-serif' }}>
                            S&apos;inscrire
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comment commander */}
      <section style={{ background: '#1A3C2E', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 13, letterSpacing: '2.5px', color: '#C9973A', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{lang === 'en' ? 'Simple & Fast' : 'Simple & Rapide'}</span>
            <h2 style={{ fontSize: 26, fontWeight: 400, color: '#F0EBE0', marginTop: 8 }}>{lang === 'en' ? 'How to place your order?' : 'Comment passer votre commande ?'}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { num: '1', icon: '🔐', titre: t('boutique.comment1'), desc: t('boutique.comment1d') },
              { num: '2', icon: '🛒', titre: t('boutique.comment2'), desc: t('boutique.comment2d') },
              { num: '3', icon: '💳', titre: t('boutique.comment3'), desc: t('boutique.comment3d') },
              { num: '4', icon: '📦', titre: t('boutique.comment4'), desc: t('boutique.comment4d') },
            ].map(e => (
              <div key={e.num} style={{ background: '#0D2318', border: '1px solid #2D6A4F', borderRadius: 12, padding: '24px 20px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -14, left: 20, background: '#C9973A', color: '#1A3C2E', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, fontFamily: 'Arial, sans-serif' }}>{e.num}</div>
                <div style={{ fontSize: 28, marginBottom: 12, marginTop: 6 }}>{e.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F0EBE0', fontFamily: 'Arial, sans-serif', marginBottom: 8 }}>{e.titre}</h3>
                <p style={{ fontSize: 13, color: '#95D5B2', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
