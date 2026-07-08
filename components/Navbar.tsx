'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, deconnecter } = useAuth()
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [menuUser, setMenuUser] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  const links = [
    { href: '/',             label: t('nav.accueil') },
    { href: '/boutique',     label: t('nav.boutique') },
    { href: '/histoire',     label: t('nav.histoire') },
    { href: '/temoignages',  label: t('nav.temoignages') },
    { href: '/contact',      label: t('nav.contact') },
    { href: '/suivi-commande', label: 'Suivi commande' },
  ]

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      // Auto-hide mobile : on cache en descendant, on reaffiche en remontant.
      // On ignore les tout petits deplacements et on ne cache jamais tout en haut,
      // ni quand le menu mobile est ouvert.
      if (!open) {
        if (y > lastY + 5 && y > 120) setHidden(true)
        else if (y < lastY - 5 || y < 120) setHidden(false)
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  const handleDeconnexion = () => {
    deconnecter()
    setMenuUser(false)
    setOpen(false)
    router.push('/')
  }

  const initiales = user
    ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase()
    : ''

  const headerStyle: React.CSSProperties = scrolled
    ? {
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        transition: 'all 0.4s ease',
      }
    : {
        background: '#ffffff',
        backdropFilter: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        boxShadow: 'none',
        transition: 'all 0.4s ease',
      }

  // ── Bouton icône partagé ────────────────────────────────
  const iconBtnStyle: React.CSSProperties = {
    width: 38, height: 38, borderRadius: 10,
    background: 'rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
    transition: 'all 0.25s',
  }
  const iconBtnHover = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? 'rgba(201,151,58,0.12)' : 'rgba(0,0,0,0.03)'
    e.currentTarget.style.borderColor = enter ? 'rgba(201,151,58,0.4)' : 'rgba(0,0,0,0.08)'
  }

  return (
    <>
      <header
        className={hidden ? 'header-hidden' : ''}
        style={{ position: 'sticky', top: 0, zIndex: 100, transform: 'translateY(0)', transition: 'transform 0.3s ease, background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease', ...headerStyle }}
      >
        <div className="navbar-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }} onClick={() => setOpen(false)}>
            <div className="navbar-logo" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 66, height: 66,
            }}>
              <Image src="/images/logo-pio-pio.jpg" alt="Tropicana Pio Pio" width={62} height={62} style={{ objectFit: 'contain', display: 'block' }} priority />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {links.map(l => {
              const active = pathname === l.href
              return (
                <Link key={l.href} href={l.href} style={{
                  color: active ? '#1A3C2E' : '#4A6B5A',
                  fontSize: 13,
                  fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
                  fontWeight: active ? 600 : 400,
                  textDecoration: 'none',
                  letterSpacing: '0.3px',
                  padding: '6px 10px',
                  borderRadius: 8,
                  background: active ? 'rgba(201,151,58,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(201,151,58,0.2)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.04)'
                    e.currentTarget.style.color = '#1A3C2E'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#4A6B5A'
                  }
                }}>
                  {l.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop droite */}
          <div className="desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

            {/* ── Bouton Langue FR / EN ── */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
              style={{
                ...iconBtnStyle,
                width: 'auto', padding: '0 10px',
                gap: 4, fontSize: 12,
                fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
                fontWeight: 700,
                color: '#E8B84B',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={e => iconBtnHover(e, true)}
              onMouseLeave={e => iconBtnHover(e, false)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>{lang === 'fr' ? 'FR' : 'EN'}</span>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style={{ color: 'rgba(201,151,58,0.5)' }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            {/* ── Panier ── */}
            <Link href="/boutique" aria-label={t('nav.boutique')} style={{ ...iconBtnStyle, textDecoration: 'none' }}
              onMouseEnter={e => iconBtnHover(e, true)}
              onMouseLeave={e => iconBtnHover(e, false)}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C9973A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>

            {/* ── Utilisateur ── */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuUser(!menuUser)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: menuUser ? 'rgba(201,151,58,0.12)' : 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 20, padding: '5px 10px 5px 5px', cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                >
                  <div style={{ width: 26, height: 26, background: '#C9973A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1A3C2E', fontFamily: 'var(--font-dm-sans), Arial, sans-serif' }}>
                    {initiales}
                  </div>
                  <span style={{ color: '#1A3C2E', fontSize: 13, fontFamily: 'var(--font-dm-sans), Arial, sans-serif' }}>{user.prenom}</span>
                  <span style={{ color: '#4A6B5A', fontSize: 9, transition: 'transform 0.2s', transform: menuUser ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                </button>

                {menuUser && (
                  <div style={{ position: 'absolute', right: 0, top: 46, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.25)', minWidth: 200, zIndex: 200, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #0D1F15, #061008)', borderBottom: '1px solid rgba(201,151,58,0.2)' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#F2EEE6', fontFamily: 'var(--font-dm-sans), Arial, sans-serif' }}>{user.prenom} {user.nom}</p>
                      <p style={{ fontSize: 11, color: '#8FC9A8', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', marginTop: 2 }}>{user.email}</p>
                    </div>
                    {[
                      { href: '/espace-client', label: `${t('nav.monEspace')}` },
                      { href: '/boutique',      label: `${t('nav.commander')}` },
                      ...(user.is_staff ? [{ href: '/admin-panel', label: `${t('nav.admin')}` }] : []),
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setMenuUser(false)} style={{ display: 'block', padding: '11px 16px', fontSize: 14, color: item.href === '/admin-panel' ? '#C9973A' : 'var(--text-primary)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-overlay)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >{item.label}</Link>
                    ))}
                    <button onClick={handleDeconnexion} style={{ display: 'block', width: '100%', padding: '11px 16px', fontSize: 14, color: '#EF4444', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >{t('nav.deconnexion')}</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/connexion" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4A6B5A', fontSize: 13, fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', padding: '6px 10px', borderRadius: 8, border: '1px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#1A3C2E'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A6B5A'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  {t('nav.connexion')}
                </Link>

                <Link href="/inscription" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#C9973A', fontSize: 13, fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(201,151,58,0.35)', background: 'rgba(201,151,58,0.07)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,151,58,0.15)'; e.currentTarget.style.borderColor = 'rgba(201,151,58,0.6)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,151,58,0.07)'; e.currentTarget.style.borderColor = 'rgba(201,151,58,0.35)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  {t('nav.inscrire')}
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="hamburger-btn" onClick={() => { setOpen(!open); setHidden(false) }} aria-label={open ? t('nav.fermer') : t('nav.menu')}
            style={{ display: 'none', background: open ? 'rgba(201,151,58,0.12)' : 'none', border: open ? '1px solid rgba(201,151,58,0.3)' : '1px solid transparent', borderRadius: 8, cursor: 'pointer', padding: '8px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, width: 42, height: 42, transition: 'all 0.25s' }}>
            <span style={{ display: 'block', width: 22, height: 2, background: open ? '#C9973A' : '#1A3C2E', borderRadius: 2, transition: 'transform 0.25s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: open ? '#C9973A' : '#1A3C2E', borderRadius: 2, opacity: open ? 0 : 1, transition: 'opacity 0.25s' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: open ? '#C9973A' : '#1A3C2E', borderRadius: 2, transition: 'transform 0.25s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>

        {/* Menu mobile */}
        <div className="mobile-menu" style={{ display: 'none', flexDirection: 'column', background: 'rgba(6,16,10,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(201,151,58,0.15)', overflow: 'hidden', maxHeight: open ? 640 : 0, transition: 'max-height 0.35s ease' }}>
          <nav style={{ padding: '12px 24px 0', display: 'flex', flexDirection: 'column' }}>
            {links.map(l => {
              const active = pathname === l.href
              return (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                  color: active ? '#F2EEE6' : '#8FC9A8',
                  fontSize: 15,
                  fontFamily: 'var(--font-dm-sans), Arial, sans-serif',
                  fontWeight: active ? 700 : 400,
                  textDecoration: 'none',
                  padding: '13px 12px',
                  borderBottom: '1px solid rgba(45,106,79,0.2)',
                  borderLeft: active ? '3px solid #C9973A' : '3px solid transparent',
                  background: active ? 'rgba(201,151,58,0.06)' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  {l.label}
                </Link>
              )
            })}
            {user ? (
              <>
                <Link href="/espace-client" onClick={() => setOpen(false)} style={{ color: '#C9973A', fontSize: 15, fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', padding: '13px 12px', borderBottom: '1px solid rgba(45,106,79,0.2)', fontWeight: 700 }}>
                  {t('nav.monEspace')} — {user.prenom}
                </Link>
                {user.is_staff && (
                  <Link href="/admin-panel" onClick={() => setOpen(false)} style={{ color: '#C9973A', fontSize: 15, fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', padding: '13px 12px', borderBottom: '1px solid rgba(45,106,79,0.2)', fontWeight: 700, opacity: 0.8 }}>
                    {t('nav.admin')}
                  </Link>
                )}
                <button onClick={handleDeconnexion} style={{ color: '#EF4444', fontSize: 15, fontFamily: 'var(--font-dm-sans), Arial, sans-serif', background: 'none', border: 'none', padding: '13px 12px', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid rgba(45,106,79,0.2)' }}>
                  {t('nav.deconnexion')}
                </button>
              </>
            ) : (
              <Link href="/connexion" onClick={() => setOpen(false)} style={{ color: '#C9973A', fontSize: 15, fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', padding: '13px 12px', borderBottom: '1px solid rgba(45,106,79,0.2)', fontWeight: 700 }}>
                {t('nav.connexion')} / {t('nav.inscrire')}
              </Link>
            )}
          </nav>

          {/* Langue dans le menu mobile */}
          <div style={{ padding: '12px 24px', display: 'flex', gap: 10, borderBottom: '1px solid rgba(45,106,79,0.2)' }}>
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(201,151,58,0.08)', border: '1px solid rgba(201,151,58,0.25)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: '#E8B84B', fontSize: 13, fontFamily: 'var(--font-dm-sans), Arial, sans-serif', fontWeight: 700 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>{lang === 'fr' ? 'FR EN' : 'EN FR'}</span>
            </button>
          </div>

          <div style={{ padding: '16px 24px 24px' }}>
            <Link href="/boutique" className="btn-gold" onClick={() => setOpen(false)} style={{ textAlign: 'center', padding: '13px', fontSize: 14, display: 'block', borderRadius: 10 }}>
              {t('nav.commanderMobile')}
            </Link>
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .mobile-menu { display: flex !important; }

          /* Header plus compact sur mobile pour liberer de l'espace ecran */
          .navbar-inner { height: 58px !important; padding: 0 14px !important; }
          .navbar-logo { width: 46px !important; height: 46px !important; }
          .navbar-logo img { width: 42px !important; height: 42px !important; }

          /* Auto-hide : on cache le header en scrollant vers le bas,
             il revient instantanement en scrollant vers le haut. */
          .header-hidden { transform: translateY(-100%) !important; }
        }
      `}</style>
    </>
  )
}
