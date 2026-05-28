'use client'
import { useLang } from '@/context/LanguageContext'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSiteConfig } from '@/lib/useSiteConfig'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/histoire', label: 'Notre Histoire' },
  { href: '/bienfaits', label: 'Bienfaits' },
  { href: '/blog', label: 'Blog' },
  { href: '/temoignages', label: 'Avis clients' },
  { href: '/contact', label: 'Contact' },
]

const legalLinks = [
  { href: '/conditions', label: 'CGV' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/suivi-commande',  label: '📦 Suivi commande' },
  { href: '/faq', label: 'FAQ' },
]

const TIKTOK_SVG = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.98a8.2 8.2 0 004.78 1.52V7.06a4.85 4.85 0 01-1.01-.37z"/></svg>
const FACEBOOK_SVG = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const WHATSAPP_SVG = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>


function NewsletterForm() {
  const { lang } = useLang()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { setErrMsg('Adresse email invalide.'); setStatus('err'); return }
    setStatus('loading')
    setErrMsg('')
    try {
      const res = await fetch(`${API_BASE}/newsletter/inscription/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (res.ok || res.status === 201 || res.status === 200) {
        setStatus('ok')
        setEmail('')
      } else {
        const data = await res.json()
        setErrMsg(data.detail || 'Une erreur est survenue.')
        setStatus('err')
      }
    } catch {
      setErrMsg('Erreur réseau. Vérifiez votre connexion.')
      setStatus('err')
    }
  }

  return (
    <div>
      <h4 style={{ fontSize: 11, fontWeight: 700, color: '#C9973A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 10 }}>
        Newsletter
      </h4>
      <p style={{ fontSize: 13, color: 'rgba(107,158,122,0.8)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', lineHeight: 1.6, marginBottom: 14 }}>
        {lang === 'en' ? 'Get our health tips and exclusive offers.' : 'Recevez nos conseils santé et offres exclusives.'}
      </p>
      {status === 'ok' ? (
        <div style={{ background: 'rgba(45,106,79,0.2)', border: '1px solid rgba(45,106,79,0.4)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#95D5B2', fontFamily: 'var(--font-dm-sans), Arial, sans-serif' }}>
          {lang === 'en' ? '✅ Thank you! Check your inbox.' : '✅ Merci ! Vérifiez votre boîte email.'}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 0 }}>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus('idle') }}
              placeholder="votre@email.com"
              disabled={status === 'loading'}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${status === 'err' ? 'rgba(239,68,68,0.5)' : 'rgba(201,151,58,0.25)'}`,
                borderRight: 'none',
                borderRadius: '8px 0 0 8px',
                padding: '10px 14px',
                fontSize: 13,
                color: '#F0EBE0',
                fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              style={{
                background: status === 'loading' ? 'rgba(201,151,58,0.5)' : 'linear-gradient(135deg, #C9973A, #E0B055)',
                border: 'none',
                borderRadius: '0 8px 8px 0',
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 700,
                color: '#1A3C2E',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
                whiteSpace: 'nowrap',
                minWidth: 90,
              }}
            >
              {status === 'loading' ? '...' : "S'inscrire →"}
            </button>
          </div>
          {status === 'err' && errMsg && (
            <p style={{ fontSize: 12, color: 'rgba(239,68,68,0.8)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', marginTop: 6 }}>
              ⚠ {errMsg}
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default function Footer() {
  const site = useSiteConfig()
  const { lang } = useLang()
  const [cfg, setCfg] = useState<any>(null)

  useEffect(() => {
    fetch(`${API_BASE}/config-accueil/`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setCfg(data) })
      .catch(() => {})
  }, [])

  const whatsappUrl = `https://wa.me/${site.telephone_raw}?text=${encodeURIComponent('Bonjour, je souhaite commander le Thé Pio Pio.')}`

  const socials = [
    { href: site.tiktok_url,   label: 'TikTok',    icon: TIKTOK_SVG },
    { href: site.facebook_url, label: 'Facebook',  icon: FACEBOOK_SVG },
    { href: whatsappUrl,       label: 'WhatsApp',  icon: WHATSAPP_SVG },
  ].filter(s => s.href)

  return (
    <footer>

      {/* CTA Band premium */}
      <div style={{
        background: 'linear-gradient(135deg, #C9973A 0%, #E0B055 50%, #C9973A 100%)',
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div>
          <p style={{ fontSize: 11, letterSpacing: '2.5px', fontWeight: 700, color: 'rgba(26,60,46,0.7)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textTransform: 'uppercase', marginBottom: 6 }}>
            {cfg?.cta_label || 'Prêt à prendre soin de vous ?'}
          </p>
          <p style={{ fontSize: 'clamp(16px,2.5vw,20px)', fontFamily: 'var(--font-cormorant), Georgia, serif', fontWeight: 500, color: '#1A3C2E', lineHeight: 1.3 }}>
            {cfg?.cta_texte || "Commandez votre Thé Pio Pio dès aujourd'hui."}
          </p>
        </div>
        <Link href={cfg?.cta_lien || '/boutique'} style={{
          background: '#1A3C2E',
          color: '#F0EBE0',
          padding: '13px 26px',
          fontSize: 14,
          fontWeight: 700,
          borderRadius: 10,
          cursor: 'pointer',
          fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
          letterSpacing: '0.5px',
          textDecoration: 'none',
          boxShadow: '0 6px 24px rgba(13,35,24,0.25)',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          🛒 {cfg?.cta_bouton || 'Commander dès 1 000 FCFA'}
        </Link>
      </div>

      {/* Main footer */}
      <div style={{ background: '#0A1E12', padding: '56px 24px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 40, marginBottom: 48, alignItems: 'start' }}>

            {/* Brand column */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ background: '#0D2318', borderRadius: 10, padding: '8px 14px', display: 'inline-flex', marginBottom: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                <Image src="/images/logo-pio-pio.jpg" alt="Tropicana Pio Pio" width={130} height={52} style={{ objectFit: 'contain' }} />
              </div>
              <p style={{ fontSize: 13.5, color: 'rgba(107,158,122,0.85)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', lineHeight: 1.8, maxWidth: 230, marginBottom: 14 }}>
                {site.description_footer}
              </p>
              <p style={{ fontSize: 13, color: '#C9973A', fontFamily: 'var(--font-cormorant), Georgia, serif', fontStyle: 'italic', lineHeight: 1.6, maxWidth: 230, borderLeft: '2px solid rgba(201,151,58,0.3)', paddingLeft: 12 }}>
                &quot;{cfg?.slogan || 'Un sang qui circule, une vie qui rayonne.'}&quot;
              </p>
              {/* Réseaux sociaux */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                {socials.map(s => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{
                      width: 36, height: 36,
                      background: 'rgba(45,106,79,0.25)',
                      border: '1px solid rgba(45,106,79,0.4)',
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#6B9E7A',
                      textDecoration: 'none',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(201,151,58,0.15)'
                      e.currentTarget.style.borderColor = 'rgba(201,151,58,0.4)'
                      e.currentTarget.style.color = '#C9973A'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(45,106,79,0.25)'
                      e.currentTarget.style.borderColor = 'rgba(45,106,79,0.4)'
                      e.currentTarget.style.color = '#6B9E7A'
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: '#C9973A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 16 }}>
                Navigation
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={href} style={{
                    color: 'rgba(107,158,122,0.8)',
                    fontSize: 14,
                    fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
                    textDecoration: 'none',
                    padding: '6px 8px',
                    borderRadius: 6,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#F0EBE0'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.paddingLeft = '12px' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(107,158,122,0.8)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '8px' }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(201,151,58,0.4)', flexShrink: 0 }} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: '#C9973A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 16 }}>
                Contact
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '📍', text: site.adresse },
                  { icon: '📞', text: site.telephone, href: `tel:${site.telephone_raw}` },
                  { icon: '📧', text: site.email, href: `mailto:${site.email}` },
                  { icon: '🕐', text: cfg?.heures_ouverture || 'Lun – Sam : 8h00 – 18h00' },
                ].map(({ icon, text, href }) => (
                  <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    {href ? (
                      <a href={href} style={{ fontSize: 13.5, color: 'rgba(107,158,122,0.85)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', lineHeight: 1.6, transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C9973A')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(107,158,122,0.85)')}
                      >{text}</a>
                    ) : (
                      <span style={{ fontSize: 13.5, color: 'rgba(107,158,122,0.85)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', lineHeight: 1.6 }}>{text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Money */}
              <div style={{ marginTop: 18, background: 'rgba(26,60,46,0.6)', border: '1px solid rgba(45,106,79,0.4)', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#C9973A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                  💳 Paiement accepté
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(site.paiements_liste).map(m => (
                    <span key={m} style={{ fontSize: 11, color: '#95D5B2', background: 'rgba(45,106,79,0.3)', padding: '3px 8px', borderRadius: 4, fontFamily: 'var(--font-dm-sans), Arial, sans-serif', fontWeight: 600 }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <NewsletterForm />

              {/* Badge fondateur */}
              <div style={{ marginTop: 28, display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(26,60,46,0.5)', border: '1px solid rgba(45,106,79,0.35)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(201,151,58,0.5)', position: 'relative' }}>
                  <Image src="/images/fondateur-durand.jpg" alt="Felicien Prosper Durand" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#C9973A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif' }}>Felicien Prosper DURAND</p>
                  <p style={{ fontSize: 11, color: 'rgba(107,158,122,0.7)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', marginTop: 2 }}>{lang === 'en' ? 'Founder · Veterinarian · Cuba' : 'Fondateur · Vétérinaire · Cuba'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Ligne séparatrice */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(45,106,79,0.4), transparent)', margin: '0 0 20px' }} />

          {/* Bottom bar */}
          <div style={{ paddingBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(45,106,79,0.7)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif' }}>
              {lang === 'en' ? '© 2026 tropicanapiopio.com — All rights reserved 🇧🇯' : '© 2026 tropicanapiopio.com — Tous droits réservés 🇧🇯'}
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {legalLinks.map(({ href, label }) => (
                <Link key={href} href={href} style={{ fontSize: 12.5, color: 'rgba(45,106,79,0.6)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9973A')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(45,106,79,0.6)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
