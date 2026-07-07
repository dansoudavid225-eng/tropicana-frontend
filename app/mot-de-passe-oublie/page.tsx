'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function MotDePasseOublie() {
  const { lang, t } = useLang()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'sent'|'error'>('idle')

  const handleSubmit = async () => {
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch(`${API_BASE}/auth/reset-mot-de-passe/`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email })
      })
      // Toujours afficher succès (sécurité: ne pas révéler si email existe)
      if (res.status !== 500) setStatus('sent')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inp: React.CSSProperties = { width:'100%', padding:'13px 15px', border:'1.5px solid #D4C9B0', borderRadius:6, fontSize:15, fontFamily:'Arial, sans-serif', outline:'none', boxSizing:'border-box', color:'#2C1A0E', background:'#fff' }

  return (
    <>
      <section style={{ position:'relative', height:180, overflow:'hidden' }}>
        <Image src="/images/tasse-dessus.jpg" alt={t('auth.mdpOublie')} fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.82)', display:'flex', alignItems:'flex-end' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', padding:'28px 24px' }}>
            <span style={{ fontSize:13, letterSpacing:'2.5px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{t('auth.mdpOublie')}</span>
            <h1 style={{ fontSize:28, fontWeight:400, color:'#F0EBE0', marginTop:6 }}>
              {lang === 'en' ? <>Reset your <em style={{ color:'#C9973A' }}>password</em></> : <>Réinitialiser votre <em style={{ color:'#C9973A' }}>mot de passe</em></>}
            </h1>
          </div>
        </div>
      </section>

      <section style={{ background:'var(--bg-section)', padding:'60px 24px', minHeight:'60vh' }}>
        <div style={{ maxWidth:420, margin:'0 auto', background:'var(--bg-card)', borderRadius:16, padding:'40px 36px', border:'0.5px solid var(--border-color)', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>

          {status === 'sent' ? (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <h3 style={{ fontSize:22, fontWeight:400, color:'var(--text-primary)', marginBottom:10 }}>
                {lang === 'en' ? 'Check your inbox!' : 'Vérifiez votre boîte mail !'}
              </h3>
              <p style={{ fontSize:15, color:'var(--text-muted)', fontFamily:'Arial, sans-serif', lineHeight:1.7, marginBottom:24 }}>{t('auth.lienEnvoye')}</p>
              <Link href="/connexion" className="btn-gold">{t('auth.seConnecter')}</Link>
            </div>
          ) : (
            <>
              <p style={{ fontSize:15, color:'var(--text-muted)', fontFamily:'Arial, sans-serif', lineHeight:1.7, marginBottom:28 }}>{t('auth.mdpOublieInfo')}</p>

              {status === 'error' && (
                <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
                  <p style={{ fontSize:14, color:'#B91C1C', fontFamily:'Arial, sans-serif' }}>
                    {lang === 'en' ? 'Error. Check your email address.' : "Erreur. Vérifiez votre adresse email."}
                  </p>
                </div>
              )}

              <div style={{ marginBottom:24 }}>
                <label style={{ display:'block', fontSize:14, fontWeight:700, color:'#1A3C2E', fontFamily:'Arial, sans-serif', marginBottom:6 }}>{t('auth.email')}</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" style={inp} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
              </div>

              <button onClick={handleSubmit} disabled={status==='loading'} className="btn-gold"
                style={{ width:'100%', textAlign:'center', padding:'14px', fontSize:15, opacity:status==='loading'?0.7:1, cursor:status==='loading'?'wait':'pointer', marginBottom:16 }}>
                {status === 'loading' ? t('auth.envoiCours') : t('auth.envoyerLien')}
              </button>

              <p style={{ textAlign:'center', fontSize:14, color:'var(--text-muted)', fontFamily:'Arial, sans-serif' }}>
                <Link href="/connexion" style={{ color:'#2D6A4F', fontWeight:700 }}>{t('auth.seConnecter')}</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  )
}
