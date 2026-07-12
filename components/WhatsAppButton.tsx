'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WHATSAPP_URL } from '@/lib/constants'
import { useLang } from '@/context/LanguageContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function WhatsAppButton() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [ctaBouton, setCtaBouton] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/config-accueil/`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.cta_bouton) setCtaBouton(data.cta_bouton) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(true), 4000)
    const t2 = setTimeout(() => setShowTooltip(false), 8000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  return (
    <>
      {/* ===== BOUTON WHATSAPP FLOTTANT (desktop + mobile) ===== */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Commander par WhatsApp"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 24,
          zIndex: 999,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
          textDecoration: 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(.34,1.56,.64,1)',
          pointerEvents: visible ? 'auto' : 'none',
          animation: visible ? 'wobble 0.6s ease 0.3s' : 'none',
        }}
      >
        {/* Icône WhatsApp SVG */}
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 2C8.37 2 3 7.37 3 14c0 2.18.6 4.22 1.63 5.97L3 27l7.23-1.6C11.88 26.43 13.4 27 15 27c6.63 0 12-5.37 12-12S21.63 2 15 2z" fill="white"/>
          <path d="M21.5 18.5c-.3.85-1.47 1.55-2.45 1.75-.65.13-1.5.24-4.35-1.05-3.65-1.6-6-5.3-6.17-5.55-.17-.25-1.4-1.86-1.4-3.55 0-1.68.87-2.5 1.18-2.84.3-.33.65-.42.87-.42.22 0 .44 0 .63.01.2.01.48-.08.75.57.28.65.95 2.33 1.04 2.5.08.17.14.37.03.6-.11.22-.17.37-.33.57-.17.2-.35.45-.5.6-.17.17-.34.35-.15.68.2.33.87 1.43 1.87 2.32 1.28 1.14 2.37 1.5 2.7 1.67.33.17.53.14.72-.08.2-.22.85-.98 1.07-1.32.22-.33.43-.27.73-.16.3.11 1.88.88 2.2 1.05.32.17.53.25.6.38.08.13.08.77-.22 1.62z" fill="#25D366"/>
        </svg>

        {/* Bulle de notification */}
        <span style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: 14,
          height: 14,
          background: '#C9973A',
          borderRadius: '50%',
          border: '2px solid #fff',
          animation: 'pulse 2s infinite',
        }} />
      </a>

      {/* Tooltip "Commander maintenant !" */}
      {showTooltip && (
        <div style={{
          position: 'fixed',
          bottom: 40,
          right: 92,
          zIndex: 998,
          background: '#1A3C2E',
          color: '#F0EBE0',
          fontSize: 14,
          fontFamily: 'Arial, sans-serif',
          padding: '10px 16px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          border: '1px solid #2D6A4F',
          animation: 'fadeIn 0.3s ease',
        }}>
          Commander par WhatsApp
          <div style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid #2D6A4F' }} />
        </div>
      )}

      {/* ===== STICKY CTA MOBILE (barre fixe en bas) ===== */}
      <div className="mobile-sticky-cta" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 990,
        background: '#1A3C2E',
        borderTop: '2px solid #C9973A',
        padding: '12px 16px',
        display: 'none',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
      }}>
        <Link
          href="/boutique"
          className="btn-gold"
          style={{ flex: 1, textAlign: 'center', padding: '13px 10px', fontSize: 15 }}
        >
          {ctaBouton || t('footer.ctaBouton')}
        </Link>
        <Link
          href="/contact"
          className="btn-ghost"
          style={{ flex: 1, textAlign: 'center', padding: '13px 10px', fontSize: 15 }}
        >
          {t('nav.contact')}
        </Link>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes wobble {
          0% { transform: scale(0); }
          50% { transform: scale(1.15); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        a[aria-label="Commander par WhatsApp"]:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 6px 28px rgba(37,211,102,0.55) !important;
        }
        @media (max-width: 768px) {
          .mobile-sticky-cta { display: flex !important; }
          /* Décaler le bouton WhatsApp au-dessus de la barre sticky */
          a[aria-label="Commander par WhatsApp"] {
            bottom: 82px !important;
          }
        }
      `}</style>
    </>
  )
}
