'use client'
import { useLang } from '@/context/LanguageContext'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// ─── Types ────────────────────────────────────────────────────────────────────

type Temoignage = {
  id?: number
  nom: string
  ville: string
  note: number
  texte: string
  date: string
  isNew?: boolean
}

// ─── Données initiales ────────────────────────────────────────────────────────

const temoignagesInitiaux: Temoignage[] = [
  { nom: 'Agnès M.', ville: 'Cotonou', note: 5, texte: 'Depuis que je bois le Thé Pio Pio chaque soir, je dors beaucoup mieux. Je le recommande à toute ma famille.', date: 'Mars 2026' },
  { nom: 'Kofi D.', ville: 'Porto-Novo', note: 5, texte: 'Mes douleurs aux articulations ont vraiment diminué après 3 semaines. Produit naturel et vraiment efficace.', date: 'Février 2026' },
  { nom: 'Rachel B.', ville: 'Parakou', note: 5, texte: "Je l'ai commandé pour ma mère âgée. Elle dit que son énergie est revenue. Merci Tropicana Pio Pio !", date: 'Janvier 2026' },
]

// ─── Page principale ──────────────────────────────────────────────────────────

export default function Temoignages() {
  const { lang, t } = useLang()
  const [temoignages, setTemoignages] = useState<Temoignage[]>(temoignagesInitiaux)
  const [form, setForm] = useState({ nom: '', ville: '', note: 5, texte: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nom.trim()) e.nom = t('temoignage.errPrenom')
    if (!form.ville.trim()) e.ville = t('temoignage.errVille')
    if (!form.texte.trim()) e.texte = t('temoignage.errTexteVide')
    if (form.texte.trim() && form.texte.trim().length < 20) e.texte = t('temoignage.errTexteCourt')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/temoignages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom.trim(),
          ville: form.ville.trim(),
          note: form.note,
          texte: form.texte.trim(),
        }),
      })

      if (res.ok) {
        const nouveau: Temoignage = {
          nom: form.nom.trim(),
          ville: form.ville.trim(),
          note: form.note,
          texte: form.texte.trim(),
          date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
          isNew: true,
        }
        setTemoignages([nouveau, ...temoignages])
      }

      setForm({ nom: '', ville: '', note: 5, texte: '' })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 6000)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', border: '1.5px solid var(--border-color)',
    borderRadius: 6, fontSize: 15, fontFamily: 'Arial, sans-serif',
    color: 'var(--text-primary)', background: 'var(--bg-card)', outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)',
    fontFamily: 'Arial, sans-serif', marginBottom: 6,
  }
  const errStyle: React.CSSProperties = {
    fontSize: 13, color: 'var(--text-error)', fontFamily: 'Arial, sans-serif', marginTop: 4,
  }
  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        <Image src="/images/produit-tasse.jpg" alt="Témoignages clients Thé Pio Pio" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,20,0.78)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
            <span style={{ fontSize: 13, letterSpacing: '2.5px', color: 'var(--gold)', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{t('temo.titre')}</span>
            <h1 style={{ fontSize: 34, fontWeight: 400, color: 'var(--text-inverse)', marginTop: 8, lineHeight: 1.3 }}>
              {t('home.temoTitre')}<br /><em style={{ color: 'var(--gold)' }}>{t('temo.partager')}</em>
            </h1>
          </div>
        </div>
      </section>

      {/* Stat rapide */}
      <div style={{ background: 'var(--gold)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }}>
            ⭐⭐⭐⭐⭐ &nbsp;·&nbsp; {temoignages.length} {t('temo.avisClients')} &nbsp;·&nbsp; {t('temo.100pct')}
          </p>
        </div>
      </div>

      <section style={{ background: 'var(--bg-page)' }}>
        <div className="temoignages-layout" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', display: 'grid', gap: 48, alignItems: 'start' }}>

          {/* ===== FORMULAIRE ===== */}
          <div>
            <div style={{ background: 'var(--green-deep)', borderRadius: 14, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: 13, letterSpacing: '2px', color: 'var(--gold)', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{t('temo.avisCompte')}</span>
              <h2 style={{ fontSize: 22, fontWeight: 400, color: 'var(--text-inverse)', marginTop: 8, marginBottom: 6 }}>{t('temo.laissezTemo')}</h2>
              <p style={{ fontSize: 14, color: 'var(--green-light)', fontFamily: 'Arial, sans-serif', marginBottom: 24, lineHeight: 1.7 }}>
                {t('temo.partagezExp')}
              </p>

              {submitted && (
                <div style={{ background: 'var(--green-deep)', border: '1px solid var(--green-mid)', borderRadius: 8, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}></span>
                  <p style={{ fontSize: 14, color: 'var(--green-light)', fontFamily: 'Arial, sans-serif' }}>
                    {t('temo.merciDetail')}
                  </p>
                </div>
              )}

              {/* Note étoiles */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ ...labelStyle, color: 'var(--gold)' }}>{t('temo.votreNote')}</label>
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
                  <label style={{ ...labelStyle, color: 'var(--green-light)' }}>{t('temo.prenom')}</label>
                  <input name="nom" value={form.nom} onChange={handleChange} placeholder={t('temo.votrePrenom')} style={inputStyle} />
                  {errors.nom && <p style={errStyle}>{errors.nom}</p>}
                </div>
                <div>
                  <label style={{ ...labelStyle, color: 'var(--green-light)' }}>{t('temo.ville')}</label>
                  <input name="ville" value={form.ville} onChange={handleChange} placeholder={t('temo.exVille')} style={inputStyle} />
                  {errors.ville && <p style={errStyle}>{errors.ville}</p>}
                </div>
              </div>

              {/* Texte */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...labelStyle, color: 'var(--green-light)' }}>{t('temo.votreTemo')}</label>
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
                  <span style={{ fontSize: 13, color: 'var(--green-light)', fontFamily: 'Arial, sans-serif' }}>{form.texte.length} car.</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-gold"
                style={{ width: '100%', textAlign: 'center', padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
              >
                {loading ? t('temo.envoiCours') : t('temo.publier')}
              </button>

              <p style={{ fontSize: 13, color: 'var(--green-light)', fontFamily: 'Arial, sans-serif', textAlign: 'center', marginTop: 12 }}>
                {t('temo.validation')}
              </p>
            </div>

            {/* CTA boutique */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '20px 22px', marginTop: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 15, color: 'var(--text-primary)', fontFamily: 'Georgia, serif', marginBottom: 12 }}>
                {t('temo.pasClient')}
              </p>
              <Link href="/boutique" className="btn-gold" style={{ fontSize: 14 }}>{t('temo.commander')}</Link>
            </div>
          </div>

          {/* ===== LISTE DES TÉMOIGNAGES ===== */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 20 }}>
              {temoignages.length} {t('temo.nbTemo')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {temoignages.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-card)',
                    border: '0.5px solid var(--border-color)',
                    borderRadius: 10,
                    padding: '20px',
                    borderLeft: `4px solid var(--gold)`,
                  }}
                >
                  {/* Étoiles */}
                  <div style={{ color: 'var(--gold)', fontSize: 14, letterSpacing: 2, marginBottom: 10 }}>
                    {'★'.repeat(t.note)}{'☆'.repeat(5 - t.note)}
                  </div>

                  {/* Texte */}
                  {t.texte && (
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.8, marginBottom: 12 }}>
                      "{t.texte}"
                    </p>
                  )}

                  {/* Auteur */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                    <div style={{ width: 36, height: 36, background: 'var(--green-deep)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Arial, sans-serif', flexShrink: 0 }}>
                      {t.nom.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', marginBottom: 2 }}>{t.nom}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif' }}>{t.ville} · {t.date}</p>
                    </div>
                    {t.isNew && (
                      <span style={{ marginLeft: 'auto', background: 'var(--green-pale)', color: 'var(--green-mid)', fontSize: 12, fontFamily: 'Arial, sans-serif', fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        {t('temo.nouveau')}
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
