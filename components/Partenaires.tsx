'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

type Partner = {
  id: number
  nom: string
  logo: string | null
  lien: string
  tag: string
  actif: boolean
  ordre: number
}

const FALLBACK: Partner[] = [
  { id: 1, nom: "World's Poultry Science Association", logo: '/images/partenaire-wpsa.jpg', lien: 'https://wpsa.com/', tag: 'Partenaire scientifique', actif: true, ordre: 0 },
  { id: 2, nom: 'Wangnigni 229', logo: '/images/partenaire-wangnigni.jpg', lien: 'https://wangnigni229.com/', tag: 'Partenaire local', actif: true, ordre: 1 },
  { id: 3, nom: 'ONG Rail Bénin', logo: '/images/partenaire-ongrail.jpg', lien: 'https://ongrail.com/', tag: 'Partenaire social', actif: true, ordre: 2 },
  { id: 4, nom: 'Artisan Nomade', logo: '/images/partenaire-artisan-nomade.jpg', lien: '#', tag: 'Partenaire artisanat', actif: true, ordre: 3 },
]

export default function Partenaires() {
  const [partners, setPartners] = useState<Partner[]>(FALLBACK)

  useEffect(() => {
    fetch(`${API_BASE}/partenaires/`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setPartners(data)
      })
      .catch(() => {})
  }, [])

  return (
    <section style={{ padding: '80px 24px', background: '#FAFAF7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(201,168,76,0.12)',
            color: '#8B6914',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '6px 18px',
            borderRadius: 20,
            marginBottom: 16,
            fontFamily: 'Arial, sans-serif',
          }}>
            Ils nous font confiance
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 400,
            color: '#1A3020',
            margin: 0,
            fontFamily: 'Georgia, serif',
          }}>
            Nos <em style={{ color: '#C9973A', fontStyle: 'italic' }}>partenaires</em>
          </h2>
        </div>

        {/* Grille 4 colonnes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {partners.map(p => (
            <a
              key={p.id}
              href={p.lien || '#'}
              target={p.lien && p.lien !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                padding: '32px 24px',
                background: '#fff',
                borderRadius: 18,
                border: '1px solid #EAE4D8',
                textDecoration: 'none',
                transition: 'transform .2s, box-shadow .2s',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
              }}
            >
              {/* Logo */}
              <div style={{
                width: 100,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flexShrink: 0,
              }}>
                {p.logo ? (
                  <Image
                    src={p.logo}
                    alt={p.nom}
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized={p.logo.startsWith('http')}
                  />
                ) : (
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1A3C2E, #2D6A4F)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: '#fff',
                    fontWeight: 700,
                    fontFamily: 'Arial, sans-serif',
                  }}>
                    {p.nom.charAt(0)}
                  </div>
                )}
              </div>

              {/* Séparateur */}
              <div style={{ width: 32, height: 1, background: '#EAE4D8' }} />

              {/* Nom */}
              <span style={{
                fontSize: 13,
                color: '#3A2D1E',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.5,
                fontFamily: 'Arial, sans-serif',
              }}>
                {p.nom}
              </span>

              {/* Tag */}
              <span style={{
                fontSize: 11,
                background: '#EAF4EE',
                color: '#1A4A2E',
                padding: '4px 12px',
                borderRadius: 10,
                fontWeight: 700,
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '0.03em',
              }}>
                {p.tag}
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
