'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/context/LanguageContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

type Slide = {
  id: number
  titre: string
  sous_titre: string
  image: string
  lien: string
  texte_bouton: string
  actif: boolean
  ordre: number
}

const FALLBACK: Slide[] = [
  {
    id: 0,
    titre: 'La nature africaine',
    sous_titre: "dans votre tasse",
    image: '/images/hero-tasse.jpg',
    lien: '/boutique',
    texte_bouton: 'Commander dès 1 000 FCFA',
    actif: true,
    ordre: 0,
  },
]

export default function HeroSlider({ heroSousTitre, heroSousTitreEm, heroBtn1, heroBtn2 }: { heroSousTitre?: string; heroSousTitreEm?: string; heroBtn1?: string; heroBtn2?: string } = {}) {
  const { t } = useLang()
  const [slides, setSlides] = useState<Slide[]>(FALLBACK)
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/sliders/`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data)
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length])
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [slides.length, next])

  const slide = slides[current]

  return (
    <>
      <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'flex-start', overflow: 'hidden' }}>

        {/* Images de fond */}
        {slides.map((s, i) => (
          <div
            key={s.id}
            style={{
              position: 'absolute', inset: 0,
              opacity: i === current ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: 0,
            }}
          >
            <Image
              src={s.image || '/images/hero-tasse.jpg'}
              alt={s.titre}
              fill
              priority={i === 0}
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
              unoptimized={!!s.image && s.image.startsWith('http')}
            />
          </div>
        ))}

        {/* Overlay — plus sombre sur mobile pour lisibilité */}
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

        {/* Contenu */}
        <div className="hero-content" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <div className="hero-text-block">
            <h1 className="hero-title">
              {slide.titre}<br />
              {slide.sous_titre && (
                <em style={{ color: '#C9973A', fontStyle: 'italic' }}>{slide.sous_titre}</em>
              )}
            </h1>
            <p className="hero-sub">
              {heroSousTitre || t('hero.sousTitreDefaut')}{' '}
              {heroSousTitreEm && <span style={{ color: '#C9973A', fontStyle: 'italic' }}>{heroSousTitreEm}</span>}
            </p>
            <div className="hero-cta-row">
              <Link
                href={slide.lien || '/boutique'}
                className="btn-gold"
                style={{ fontSize: 15, padding: '14px 28px', borderRadius: 50 }}
              >
                {slide.texte_bouton || 'Commander dès 1 000 FCFA'}
              </Link>
              <Link
                href="/histoire"
                className="btn-ghost"
                style={{ fontSize: 15, padding: '14px 28px', borderRadius: 50, color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}
              >
                Notre histoire
              </Link>
            </div>

            {/* Badge confiance — visible sur mobile comme CEVADEL */}
            <div className="hero-badges">
              <span className="hero-badge">✅ 100% Bio</span>
              <span className="hero-badge">🌿 Made in Bénin</span>
              <span className="hero-badge">⭐ 500+ familles</span>
            </div>
          </div>
        </div>

        {/* Boutons précédent / suivant */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
              aria-label="Slide précédent"
            >
              ‹
            </button>
            <button
              onClick={next}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
              aria-label="Slide suivant"
            >
              ›
            </button>
          </>
        )}

        {/* Indicateurs */}
        {slides.length > 1 && (
          <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 20, alignItems: 'center' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? '#C9973A' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
                aria-label={`Aller au slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <style>{`
        /* ── Hero overlay ── */
        .hero-overlay {
          background: linear-gradient(to right, rgba(10,30,20,0.88) 0%, rgba(10,30,20,0.55) 45%, rgba(10,30,20,0.10) 100%);
        }

        /* ── Hero content wrapper ── */
        .hero-content {
          padding: 140px 28px 60px;
        }

        /* ── Bloc texte ── */
        .hero-text-block {
          max-width: 620px;
        }

        /* ── Titre principal ── */
        .hero-title {
          font-size: clamp(38px, 7vw, 64px);
          font-weight: 700;
          color: #F0EBE0;
          line-height: 1.1;
          margin-bottom: 20px;
          margin-top: 0;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }

        /* ── Sous-titre ── */
        .hero-sub {
          color: rgba(240,235,224,0.88);
          font-size: clamp(15px, 2.5vw, 18px);
          font-family: Arial, sans-serif;
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 480px;
          text-shadow: 0 1px 8px rgba(0,0,0,0.5);
        }

        /* ── Boutons CTA ── */
        .hero-cta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        /* ── Badges confiance ── */
        .hero-badges {
          display: none; /* caché desktop, visible mobile */
          margin-top: 24px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .hero-badge {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(201,151,58,0.35);
          color: #F0EBE0;
          font-size: 12px;
          font-family: Arial, sans-serif;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
          white-space: nowrap;
        }

        /* ════════════════════════════════════════
           MOBILE — ≤ 768px
           Objectif: rendu proche de CEVADEL
        ════════════════════════════════════════ */
        @media (max-width: 768px) {

          /* Overlay plus sombre sur mobile pour lisibilité */
          .hero-overlay {
            background: linear-gradient(
              180deg,
              rgba(10,30,20,0.60) 0%,
              rgba(10,30,20,0.82) 55%,
              rgba(10,30,20,0.92) 100%
            );
          }

          /* Contenu centré sur mobile comme CEVADEL */
          .hero-content {
            padding: 100px 20px 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-text-block {
            max-width: 100%;
            text-align: center;
          }

          /* Titre plus compact mais impactant */
          .hero-title {
            font-size: clamp(30px, 8vw, 42px);
            margin-bottom: 14px;
          }

          /* Sous-titre centré */
          .hero-sub {
            font-size: 15px;
            margin-bottom: 28px;
            max-width: 100%;
          }

          /* CTA centrés et plein-largeur sur très petit écran */
          .hero-cta-row {
            justify-content: center;
            gap: 10px;
          }

          .hero-cta-row a {
            flex: 1;
            min-width: 140px;
            text-align: center !important;
            padding: 13px 16px !important;
            font-size: 14px !important;
          }

          /* Badges visibles sur mobile */
          .hero-badges {
            display: flex;
            justify-content: center;
          }
        }

        /* ── Très petit écran ≤ 380px ── */
        @media (max-width: 380px) {
          .hero-content {
            padding: 90px 16px 70px;
          }
          .hero-title {
            font-size: 28px;
          }
          .hero-cta-row {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-cta-row a {
            text-align: center !important;
          }
        }
      `}</style>
    </>
  )
}
