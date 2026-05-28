'use client'
import { useState, useEffect } from 'react'
import { useSiteConfig } from '@/lib/useSiteConfig'
import { useLang } from '@/context/LanguageContext'

export default function AnnouncementBar() {
  const cfg = useSiteConfig()
  const { t } = useLang()
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  const messages = [
    t('annonce.livraison'),
    t('annonce.delai'),
    `${t('annonce.whatsapp')} : ${cfg.telephone}`,
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % messages.length)
        setFading(false)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
  }, [messages.length])

  if (!visible) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0D2318 0%, #1A3C2E 50%, #0D2318 100%)',
      borderBottom: '1px solid rgba(201,151,58,0.25)',
      padding: '9px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      position: 'relative',
      zIndex: 101,
    }}>
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        {messages.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 16 : 5, height: 5, borderRadius: 3,
            background: i === current ? '#C9973A' : 'rgba(201,151,58,0.3)',
            border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.35s ease',
          }} />
        ))}
      </div>
      <p style={{
        margin: 0, fontSize: 12.5, fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
        fontWeight: 500, color: '#F0EBE0', letterSpacing: '0.3px', textAlign: 'center',
        opacity: fading ? 0 : 1, transform: fading ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        {messages[current]}
      </p>
      <button onClick={() => setVisible(false)} aria-label="Fermer" style={{
        position: 'absolute', right: 16, background: 'none', border: 'none',
        cursor: 'pointer', color: 'rgba(201,151,58,0.5)', fontSize: 16, lineHeight: 1,
        padding: '2px 6px', transition: 'color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = '#C9973A')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,151,58,0.5)')}
      >✕</button>
    </div>
  )
}
