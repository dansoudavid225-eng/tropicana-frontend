'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'

export default function Connexion() {
  const { connecter, connecterGoogle, user, loading } = useAuth()
  const { lang, t } = useLang()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [showMdp, setShowMdp] = useState(false)
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => { if (user) router.push('/espace-client') }, [user, router])
  if (user) return null

  const handleSubmit = async () => {
    if (!email || !mdp) return
    setStatus('loading')
    const res = await connecter(email, mdp)
    if (res.ok) { window.location.replace('/espace-client') }
    else { setStatus('error'); setErrMsg(res.message || (lang === 'en' ? 'Incorrect email or password.' : 'Email ou mot de passe incorrect.')) }
  }

  const handleGoogle = async () => {
    setStatus('loading')
    const res = await connecterGoogle()
    if (res.ok) window.location.replace('/espace-client')
    else { setStatus('error'); setErrMsg(res.message || (lang === 'en' ? 'Google sign-in error.' : 'Erreur connexion Google.')) }
  }

  const inp: React.CSSProperties = { width:'100%', padding:'13px 15px', border:'1.5px solid #D4C9B0', borderRadius:6, fontSize:15, fontFamily:'Arial, sans-serif', outline:'none', boxSizing:'border-box', color:'#2C1A0E', background:'#fff' }
  const lbl: React.CSSProperties = { display:'block', fontSize:14, fontWeight:700, color:'#1A3C2E', fontFamily:'Arial, sans-serif', marginBottom:6 }

  return (
    <>
      <section style={{ position:'relative', height:220, overflow:'hidden' }}>
        <Image src="/images/tasse-dessus.jpg" alt={t('auth.seConnecter')} fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.82)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'32px 40px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', width:'100%' }}>
            <span style={{ fontSize:13, letterSpacing:'2.5px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{t('page.connexion')}</span>
            <h1 style={{ fontSize:30, fontWeight:400, color:'#F0EBE0', marginTop:6 }}>
              {lang === 'en' ? <>Access your <em style={{ color:'#C9973A' }}>account</em></> : <>Accédez à votre <em style={{ color:'#C9973A' }}>espace</em></>}
            </h1>
          </div>
        </div>
      </section>

      <section style={{ background:'var(--bg-section)', padding:'60px 24px', minHeight:'60vh' }}>
        <div style={{ maxWidth:420, margin:'0 auto', background:'var(--bg-card)', borderRadius:16, padding:'40px 36px', border:'0.5px solid var(--border-color)', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>

          {status === 'error' && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
              <p style={{ fontSize:14, color:'#B91C1C', fontFamily:'Arial, sans-serif' }}>{errMsg}</p>
            </div>
          )}

          <div style={{ marginBottom:20 }}>
            <label style={lbl}>{t('auth.email')}</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" style={inp} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
          </div>

          <div style={{ marginBottom:8 }}>
            <label style={lbl}>{t('auth.mdp')}</label>
            <div style={{ position:'relative' }}>
              <input type={showMdp?'text':'password'} value={mdp} onChange={e=>setMdp(e.target.value)} placeholder="••••••••" style={{ ...inp, paddingRight:46 }} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
              <button onClick={()=>setShowMdp(!showMdp)} aria-label={showMdp?t('auth.masquerMdp'):t('auth.afficherMdp')}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#6B5E4E' }}>
                {showMdp ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ textAlign:'right', marginBottom:24 }}>
            <Link href="/mot-de-passe-oublie" style={{ fontSize:13, color:'#2D6A4F', fontFamily:'Arial, sans-serif' }}>{t('auth.mdpOublie')}</Link>
          </div>

          <button onClick={handleSubmit} disabled={status==='loading'||loading} className="btn-gold"
            style={{ width:'100%', textAlign:'center', padding:'14px', fontSize:15, opacity:(status==='loading'||loading)?0.7:1, cursor:(status==='loading'||loading)?'wait':'pointer', marginBottom:16 }}>
            {(status==='loading'||loading) ? t('auth.connexionCours') : t('auth.seConnecter')}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:'var(--border-color)' }} />
            <span style={{ fontSize:13, color:'var(--text-muted)', fontFamily:'Arial, sans-serif' }}>{t('auth.ouAvec')}</span>
            <div style={{ flex:1, height:1, background:'var(--border-color)' }} />
          </div>

          <button onClick={handleGoogle} disabled={status==='loading'||loading}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'13px', border:'1.5px solid var(--border-color)', borderRadius:6, background:'var(--bg-card)', cursor:'pointer', fontSize:15, fontFamily:'Arial, sans-serif', color:'var(--text-primary)', marginBottom:24, opacity:(status==='loading'||loading)?0.7:1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {t('auth.google')}
          </button>

          <p style={{ textAlign:'center', fontSize:14, color:'var(--text-muted)', fontFamily:'Arial, sans-serif' }}>
            {t('auth.pasCpt')}{' '}
            <Link href="/inscription" style={{ color:'#2D6A4F', fontWeight:700 }}>{t('auth.sinscrire')}</Link>
          </p>
        </div>
      </section>
    </>
  )
}
