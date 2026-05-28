'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

// Slide de secours si l'API ne répond pas
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

export default function HeroSlider() {
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

  // Défilement automatique toutes les 5 secondes
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [slides.length, next])

  const slide = slides[current]

  return (
    <section style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'flex-start', overflow: 'hidden' }}>

      {/* Images de fond — une par slide */}
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
            style={{ objectFit: 'cover', objectPosition: '60% center' }}
            unoptimized={!!s.image && s.image.startsWith('http')}
          />
        </div>
      ))}

      {/* Overlay dégradé */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,30,20,0.88) 0%, rgba(10,30,20,0.55) 45%, rgba(10,30,20,0.10) 100%)', zIndex: 1 }} />

      {/* Contenu du slide actif */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '140px 28px 60px' }}>
        <div style={{ maxWidth: 620 }}>
          <h1 style={{ fontSize: 'clamp(38px, 7vw, 64px)', fontWeight: 700, color: '#F0EBE0', lineHeight: 1.1, marginBottom: 20, marginTop: 0, textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            {slide.titre}<br />
            {slide.sous_titre && (
              <em style={{ color: '#C9973A', fontStyle: 'italic' }}>{slide.sous_titre}</em>
            )}
          </h1>
          <p style={{ color: 'rgba(240,235,224,0.88)', fontSize: 'clamp(15px, 2.5vw, 18px)', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 36, maxWidth: 480, textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            Apaise ton stress, naturellement{' '}
            <span style={{ color: '#C9973A', fontStyle: 'italic' }}>| Mį sȩ sīn Bōwā sīn</span>
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
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
        </div>
      </div>

      {/* Boutons précédent / suivant — seulement si plusieurs slides */}
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

      {/* Indicateurs points en bas */}
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
  )
}
