'use client'
import { useLang } from '@/context/LanguageContext'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// ─── Types ────────────────────────────────────────────────────────────────────

type TypeVideo = 'aucune' | 'upload' | 'lien'

type Temoignage = {
  id?: number
  nom: string
  ville: string
  note: number
  texte: string
  date: string
  type_video: TypeVideo
  video_fichier?: string | null
  video_lien?: string | null
  embed_url?: string | null
  a_video?: boolean
  isNew?: boolean
}

// ─── Données initiales ────────────────────────────────────────────────────────

const temoignagesInitiaux: Temoignage[] = [
  { nom: 'Agnès M.', ville: 'Cotonou', note: 5, texte: 'Depuis que je bois le Thé Pio Pio chaque soir, je dors beaucoup mieux. Je le recommande à toute ma famille.', date: 'Mars 2026', type_video: 'aucune' },
  { nom: 'Kofi D.', ville: 'Porto-Novo', note: 5, texte: 'Mes douleurs aux articulations ont vraiment diminué après 3 semaines. Produit naturel et vraiment efficace.', date: 'Février 2026', type_video: 'aucune' },
  { nom: 'Rachel B.', ville: 'Parakou', note: 5, texte: "Je l'ai commandé pour ma mère âgée. Elle dit que son énergie est revenue. Merci Tropicana Pio Pio !", date: 'Janvier 2026', type_video: 'aucune' },
  { nom: 'Mariam K.', ville: 'Cotonou', note: 5, texte: "Un thé exceptionnel ! Mon transit intestinal s'est amélioré dès la première semaine.", date: 'Mars 2026', type_video: 'aucune' },
  { nom: 'Faustin D.', ville: 'Porto-Novo', note: 5, texte: 'Je le donne à mes enfants depuis 3 mois. Moins de maladies fréquentes, ils sont en pleine forme !', date: 'Avril 2026', type_video: 'aucune' },
  { nom: 'Rachelle A.', ville: 'Parakou', note: 5, texte: 'Je revends le Thé Pio Pio dans ma boutique. Mes clients adorent et reviennent toujours commander.', date: 'Avril 2026', type_video: 'aucune' },
]

// ─── Composant carte témoignage ───────────────────────────────────────────────

function CarteVideo({ t }: { t: Temoignage }) {
  const [playing, setPlaying] = useState(false)

  if (t.type_video === 'lien' && t.embed_url) {
    const isYoutube = t.embed_url.includes('youtube.com/embed')
    return (
      <div style={{ marginTop: 14, borderRadius: 10, overflow: 'hidden', background: '#000', aspectRatio: '16/9', position: 'relative' }}>
        {!playing && isYoutube ? (
          <button
            onClick={() => setPlaying(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <div style={{ width: 56, height: 56, background: '#C9973A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
            <span style={{ color: '#F0EBE0', fontSize: 13, fontFamily: 'Arial, sans-serif' }}>Voir la vidéo</span>
          </button>
        ) : isYoutube ? (
          <iframe
            src={`${t.embed_url}?autoplay=1`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // TikTok ou autre — lien externe
          <a
            href={t.video_lien || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, textDecoration: 'none' }}
          >
            <div style={{ width: 56, height: 56, background: '#C9973A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
            <span style={{ color: '#F0EBE0', fontSize: 13, fontFamily: 'Arial, sans-serif' }}>Voir sur TikTok / Instagram</span>
          </a>
        )}
      </div>
    )
  }

  if (t.type_video === 'upload' && t.video_fichier) {
    return (
      <div style={{ marginTop: 14, borderRadius: 10, overflow: 'hidden', background: '#000' }}>
        <video
          src={t.video_fichier}
          controls
          style={{ width: '100%', display: 'block', maxHeight: 300 }}
          preload="metadata"
        />
      </div>
    )
  }

  return null
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function Temoignages() {
  const { lang } = useLang()
  const [temoignages, setTemoignages] = useState<Temoignage[]>(temoignagesInitiaux)
  const [form, setForm] = useState({ nom: '', ville: '', note: 5, texte: '' })
  const [typeVideo, setTypeVideo] = useState<TypeVideo>('aucune')
  const [videoFichier, setVideoFichier] = useState<File | null>(null)
  const [videoLien, setVideoLien] = useState('')
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Charger les témoignages approuvés depuis l'API au montage
  useEffect(() => {
    fetch(`${API_BASE}/temoignages/`)
      .then(r => r.json())
      .then(data => {
        const liste: Temoignage[] = Array.isArray(data) ? data : data.resultats ?? data.results ?? []
        if (liste.length > 0) setTemoignages(liste)
      })
      .catch(() => {}) // garder les données initiales en fallback si réseau indisponible
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.name === 'note' ? Number(e.target.value) : e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifications côté client
    const types = ['video/mp4', 'video/quicktime', 'video/webm', 'video/ogg']
    if (!types.includes(file.type)) {
      setErrors({ ...errors, video: 'Format non supporté. Utilisez MP4, MOV ou WEBM.' })
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      setErrors({ ...errors, video: 'Fichier trop lourd (max 100 Mo).' })
      return
    }

    setVideoFichier(file)
    setVideoPreview(URL.createObjectURL(file))
    setErrors({ ...errors, video: '' })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nom.trim()) e.nom = 'Veuillez entrer votre prénom.'
    if (!form.ville.trim()) e.ville = 'Veuillez entrer votre ville.'
    if (!form.texte.trim() && typeVideo === 'aucune') e.texte = 'Rédigez un témoignage ou joignez une vidéo.'
    if (form.texte.trim() && form.texte.trim().length < 20) e.texte = 'Le témoignage doit faire au moins 20 caractères.'
    if (typeVideo === 'upload' && !videoFichier) e.video = 'Sélectionnez un fichier vidéo.'
    if (typeVideo === 'lien' && !videoLien.trim()) e.video = 'Entrez un lien YouTube ou TikTok.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      // Construire FormData pour supporter l'upload de fichier
      const formData = new FormData()
      formData.append('nom', form.nom.trim())
      formData.append('ville', form.ville.trim())
      formData.append('note', String(form.note))
      formData.append('texte', form.texte.trim())
      formData.append('type_video', typeVideo)

      if (typeVideo === 'upload' && videoFichier) {
        formData.append('video_fichier', videoFichier)
      }
      if (typeVideo === 'lien' && videoLien.trim()) {
        formData.append('video_lien', videoLien.trim())
      }

      const res = await fetch(`${API_BASE}/temoignages/`, {
        method: 'POST',
        body: formData,
        // Ne pas définir Content-Type — le navigateur le fait automatiquement avec le boundary
      })

      if (res.ok) {
        // Succès API : ajouter localement pour feedback immédiat
        const nouveau: Temoignage = {
          nom: form.nom.trim(),
          ville: form.ville.trim(),
          note: form.note,
          texte: form.texte.trim(),
          date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
          type_video: typeVideo,
          video_fichier: videoPreview,
          video_lien: typeVideo === 'lien' ? videoLien.trim() : null,
          embed_url: typeVideo === 'lien' ? getEmbedUrl(videoLien.trim()) : null,
          isNew: true,
        }
        setTemoignages([nouveau, ...temoignages])
      } else {
        // Fallback local si API non disponible
        const nouveau: Temoignage = {
          nom: form.nom.trim(),
          ville: form.ville.trim(),
          note: form.note,
          texte: form.texte.trim(),
          date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
          type_video: typeVideo,
          video_fichier: videoPreview,
          video_lien: typeVideo === 'lien' ? videoLien.trim() : null,
          embed_url: typeVideo === 'lien' ? getEmbedUrl(videoLien.trim()) : null,
          isNew: true,
        }
        setTemoignages([nouveau, ...temoignages])
      }

      // Réinitialiser
      setForm({ nom: '', ville: '', note: 5, texte: '' })
      setTypeVideo('aucune')
      setVideoFichier(null)
      setVideoLien('')
      setVideoPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      // Fallback silencieux en mode hors-ligne
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 6000)
    } finally {
      setLoading(false)
    }
  }

  function getEmbedUrl(url: string): string | null {
    if (!url) return null
    if (url.includes('youtube.com/watch')) {
      const vid = url.split('v=')[1]?.split('&')[0]
      return vid ? `https://www.youtube.com/embed/${vid}` : null
    }
    if (url.includes('youtu.be/')) {
      const vid = url.split('youtu.be/')[1]?.split('?')[0]
      return vid ? `https://www.youtube.com/embed/${vid}` : null
    }
    return url // TikTok / autre
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', border: '1.5px solid #D4C9B0',
    borderRadius: 6, fontSize: 15, fontFamily: 'Arial, sans-serif',
    color: '#2C1A0E', background: '#fff', outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 14, fontWeight: 700, color: '#1A3C2E',
    fontFamily: 'Arial, sans-serif', marginBottom: 6,
  }
  const errStyle: React.CSSProperties = {
    fontSize: 13, color: '#B91C1C', fontFamily: 'Arial, sans-serif', marginTop: 4,
  }
  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px 8px', border: `1.5px solid ${active ? '#C9973A' : '#D4C9B0'}`,
    borderRadius: 6, background: active ? '#FEF9F0' : '#fff',
    color: active ? '#8A5A00' : '#5A4A3A', fontSize: 13,
    fontFamily: 'Arial, sans-serif', fontWeight: active ? 700 : 400,
    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' as const,
  })

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        <Image src="/images/produit-tasse.jpg" alt="Témoignages clients Thé Pio Pio" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,20,0.78)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <span style={{ fontSize: 13, letterSpacing: '2.5px', color: '#C9973A', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{lang === 'en' ? 'Customer Reviews' : 'Avis clients'}</span>
            <h1 style={{ fontSize: 34, fontWeight: 400, color: '#F0EBE0', marginTop: 8, lineHeight: 1.3 }}>
              {lang === 'en' ? 'What our customers say' : 'Ce que disent nos clients'}<br /><em style={{ color: '#C9973A' }}>{lang === 'en' ? 'Share your experience' : 'Partagez votre expérience'}</em>
            </h1>
          </div>
        </div>
      </section>

      {/* Stat rapide */}
      <div style={{ background: '#C9973A', padding: '14px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1A3C2E', fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }}>
          ⭐⭐⭐⭐⭐ &nbsp;·&nbsp; {temoignages.length} {lang === 'en' ? 'customer reviews' : 'avis clients'} &nbsp;·&nbsp; {lang === 'en' ? '100% recommend Thé Pio Pio' : '100% recommandent le Thé Pio Pio'}
        </p>
      </div>

      <section style={{ background: '#F5F0E8', padding: '60px 24px' }}>
        <div className="temoignages-layout" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 48, alignItems: 'start' }}>

          {/* ===== FORMULAIRE ===== */}
          <div>
            <div style={{ background: '#1A3C2E', borderRadius: 14, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: 13, letterSpacing: '2px', color: '#C9973A', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{lang === 'en' ? 'Your review matters' : 'Votre avis compte'}</span>
              <h2 style={{ fontSize: 22, fontWeight: 400, color: '#F0EBE0', marginTop: 8, marginBottom: 6 }}>{lang === 'en' ? 'Leave your testimonial' : 'Laissez votre témoignage'}</h2>
              <p style={{ fontSize: 14, color: '#95D5B2', fontFamily: 'Arial, sans-serif', marginBottom: 24, lineHeight: 1.7 }}>
                {lang === 'en' ? t('temo.sousTitreForme')}
              </p>

              {submitted && (
                <div style={{ background: '#0D2318', border: '1px solid #2D6A4F', borderRadius: 8, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>✅</span>
                  <p style={{ fontSize: 14, color: '#95D5B2', fontFamily: 'Arial, sans-serif' }}>
                    {lang === 'en' ? t('temo.merciDetail')}
                  </p>
                </div>
              )}

              {/* Note étoiles */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ ...labelStyle, color: '#C9973A' }}>{lang === 'en' ? 'Your rating *' : 'Votre note *'}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setForm({ ...form, note: n })}
                      style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', opacity: n <= form.note ? 1 : 0.3, transition: 'opacity 0.15s, transform 0.15s', transform: n <= form.note ? 'scale(1.1)' : 'scale(1)', padding: '2px' }}
                    >⭐</button>
                  ))}
                </div>
              </div>

              {/* Nom + Ville */}
              <div className="form-row-2" style={{ display: 'grid', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ ...labelStyle, color: '#95D5B2' }}>{lang === 'en' ? 'First name *' : 'Prénom *'}</label>
                  <input name="nom" value={form.nom} onChange={handleChange} placeholder={lang === 'en' ? 'Your first name' : 'Votre prénom'} style={inputStyle} />
                  {errors.nom && <p style={errStyle}>{errors.nom}</p>}
                </div>
                <div>
                  <label style={{ ...labelStyle, color: '#95D5B2' }}>{lang === 'en' ? 'City *' : 'Ville *'}</label>
                  <input name="ville" value={form.ville} onChange={handleChange} placeholder={lang === 'en' ? 'e.g. Cotonou' : 'ex: Cotonou'} style={inputStyle} />
                  {errors.ville && <p style={errStyle}>{errors.ville}</p>}
                </div>
              </div>

              {/* Texte */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...labelStyle, color: '#95D5B2' }}>{lang === 'en' ? 'Your testimonial' : 'Votre témoignage'} <span style={{ fontWeight: 400, color: '#6B9E7A' }}>{lang === 'en' ? '(optional if you add a video)' : '(optionnel si vous ajoutez une vidéo)'}</span></label>
                <textarea
                  name="texte"
                  value={form.texte}
                  onChange={handleChange}
                  placeholder={t('temo.textePh')}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {errors.texte ? <p style={errStyle}>{errors.texte}</p> : <span />}
                  <span style={{ fontSize: 13, color: '#6B9E7A', fontFamily: 'Arial, sans-serif' }}>{form.texte.length} car.</span>
                </div>
              </div>

              {/* ── Section Vidéo ── */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ ...labelStyle, color: '#95D5B2' }}>{lang === 'en' ? 'Add a video' : 'Ajouter une vidéo'} <span style={{ fontWeight: 400, color: '#6B9E7A' }}>{lang === 'en' ? '(optional)' : '(optionnel)'}</span></label>

                {/* Onglets type vidéo */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <button style={tabStyle(typeVideo === 'aucune')} onClick={() => setTypeVideo('aucune')}>{lang === 'en' ? 'No video' : 'Pas de vidéo'}</button>
                  <button style={tabStyle(typeVideo === 'upload')} onClick={() => setTypeVideo('upload')}>{lang === 'en' ? '📁 Upload a file' : '📁 Importer un fichier'}</button>
                  <button style={tabStyle(typeVideo === 'lien')} onClick={() => setTypeVideo('lien')}>{lang === 'en' ? '🔗 YouTube/TikTok link' : '🔗 Lien YouTube/TikTok'}</button>
                </div>

                {/* Upload fichier */}
                {typeVideo === 'upload' && (
                  <div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{ border: '2px dashed #4A8C6A', borderRadius: 8, padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#0D2318', transition: 'border-color 0.2s' }}
                    >
                      {videoPreview ? (
                        <div>
                          <video src={videoPreview} style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 6 }} controls />
                          <p style={{ fontSize: 13, color: '#95D5B2', fontFamily: 'Arial, sans-serif', marginTop: 8 }}>
                            {videoFichier?.name} — {((videoFichier?.size || 0) / 1024 / 1024).toFixed(1)} Mo
                          </p>
                          <p style={{ fontSize: 12, color: '#6B9E7A', fontFamily: 'Arial, sans-serif' }}>{lang === 'en' ? 'Click to change' : 'Cliquer pour changer'}</p>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div>
                          <p style={{ fontSize: 14, color: '#95D5B2', fontFamily: 'Arial, sans-serif', marginBottom: 4 }}>Cliquer pour sélectionner une vidéo</p>
                          <p style={{ fontSize: 12, color: '#6B9E7A', fontFamily: 'Arial, sans-serif' }}>MP4, MOV, WEBM — max 100 Mo</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/ogg"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    {errors.video && <p style={errStyle}>{errors.video}</p>}
                  </div>
                )}

                {/* Lien externe */}
                {typeVideo === 'lien' && (
                  <div>
                    <input
                      type="url"
                      value={videoLien}
                      onChange={e => { setVideoLien(e.target.value); setErrors({ ...errors, video: '' }) }}
                      placeholder="https://youtube.com/watch?v=... ou https://tiktok.com/..."
                      style={inputStyle}
                    />
                    {videoLien && getEmbedUrl(videoLien)?.includes('youtube') && (
                      <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9' }}>
                        <iframe
                          src={getEmbedUrl(videoLien) || ''}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {errors.video && <p style={errStyle}>{errors.video}</p>}
                    <p style={{ fontSize: 12, color: '#6B9E7A', fontFamily: 'Arial, sans-serif', marginTop: 6 }}>
                      Supports : YouTube, TikTok, Instagram Reels, Facebook Video
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-gold"
                style={{ width: '100%', textAlign: 'center', padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
              >
                {loading ? t('temo.envoiCours') : t('temo.publier')}
              </button>

              <p style={{ fontSize: 13, color: '#6B9E7A', fontFamily: 'Arial, sans-serif', textAlign: 'center', marginTop: 12 }}>
                🔒 Votre témoignage est soumis à validation avant publication.
              </p>
            </div>

            {/* CTA boutique */}
            <div style={{ background: '#fff', border: '1px solid #D4C9B0', borderRadius: 10, padding: '20px 22px', marginTop: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 15, color: '#1A3C2E', fontFamily: 'Georgia, serif', marginBottom: 12 }}>
                Pas encore client ? Découvrez le Thé Pio Pio.
              </p>
              <Link href="/boutique" className="btn-gold" style={{ fontSize: 14 }}>Commander — 1 000 FCFA</Link>
            </div>
          </div>

          {/* ===== LISTE DES TÉMOIGNAGES ===== */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 400, color: '#1A3C2E', marginBottom: 20 }}>
              {temoignages.length} témoignages clients
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {temoignages.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    border: '0.5px solid #D4C9B0',
                    borderRadius: 10,
                    padding: '20px',
                    borderLeft: `4px solid ${t.a_video || t.type_video !== 'aucune' ? '#2D6A4F' : '#C9973A'}`,
                  }}
                >
                  {/* Badge vidéo */}
                  {(t.a_video || t.type_video !== 'aucune') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EAF4EE', color: '#1A5C3E', fontSize: 12, fontFamily: 'Arial, sans-serif', fontWeight: 700, padding: '3px 10px', borderRadius: 20, marginBottom: 10 }}>
                      🎬 Témoignage vidéo
                    </div>
                  )}

                  {/* Étoiles */}
                  <div style={{ color: '#C9973A', fontSize: 14, letterSpacing: 2, marginBottom: 10 }}>
                    {'★'.repeat(t.note)}{'☆'.repeat(5 - t.note)}
                  </div>

                  {/* Texte */}
                  {t.texte && (
                    <p style={{ fontSize: 15, color: '#5A4A3A', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.8, marginBottom: 12 }}>
                      "{t.texte}"
                    </p>
                  )}

                  {/* Vidéo */}
                  <CarteVideo t={t} />

                  {/* Auteur */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                    <div style={{ width: 36, height: 36, background: '#1A3C2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#C9973A', fontFamily: 'Arial, sans-serif', flexShrink: 0 }}>
                      {t.nom.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1A3C2E', fontFamily: 'Arial, sans-serif', marginBottom: 2 }}>{t.nom}</p>
                      <p style={{ fontSize: 13, color: '#7A6A5A', fontFamily: 'Arial, sans-serif' }}>{t.ville} · {t.date}</p>
                    </div>
                    {t.isNew && (
                      <span style={{ marginLeft: 'auto', background: '#EAF4EE', color: '#2D6A4F', fontSize: 12, fontFamily: 'Arial, sans-serif', fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        ✓ Nouveau
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .temoignages-layout { grid-template-columns: 420px 1fr; }
        .form-row-2 { grid-template-columns: 1fr 1fr; }
        @media (max-width: 960px) { .temoignages-layout { grid-template-columns: 1fr; } }
        @media (max-width: 500px) { .form-row-2 { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
