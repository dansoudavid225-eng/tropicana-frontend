'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LanguageContext'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (resp: { credential: string }) => void }) => void
          prompt: () => void
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

export default function Connexion() {
  const { connecter, connecterGoogle, user, loading } = useAuth()
  const { lang, t } = useLang()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [showMdp, setShowMdp] = useState(false)
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const googleBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (user) router.push('/espace-client') }, [user, router])

  // ── Initialisation Google Identity Services ────────────────────────────
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) return

    const init = () => {
      if (!window.google || !googleBtnRef.current) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (resp: { credential: string }) => {
          setStatus('loading')
          const res = await connecterGoogle({ credential: resp.credential })
          if (res.ok) window.location.replace('/espace-client')
          else { setStatus('error'); setErrMsg(res.message || (lang === 'en' ? 'Google sign-in error.' : 'Erreur connexion Google.')) }
        },
      })
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', width: 340, text: 'continue_with',
        locale: lang === 'en' ? 'en' : 'fr',
      })
    }

    // Le script <Script> global peut ne pas être encore chargé
    if (window.google) { init() }
    else {
      const interval = setInterval(() => {
        if (window.google) { clearInterval(interval); init() }
      }, 200)
      const timeout = setTimeout(() => clearInterval(interval), 8000)
      return () => { clearInterval(interval); clearTimeout(timeout) }
    }
  }, [lang, connecterGoogle])

  if (user) return null

  const handleSubmit = async () => {
    if (!email || !mdp) return
    setStatus('loading')
    const res = await connecter(email, mdp)
    if (res.ok) { window.location.replace('/espace-client') }
    else { setStatus('error'); setErrMsg(res.message || (lang === 'en' ? 'Incorrect email or password.' : 'Email ou mot de passe incorrect.')) }
  }

  const inp: React.CSSProperties = { width:'100%', padding:'13px 15px', border:'1.5px solid var(--border-color)', borderRadius:6, fontSize:15, fontFamily:'Arial, sans-serif', outline:'none', boxSizing:'border-box', color:'var(--text-primary)', background:'var(--bg-input)' }
  const lbl: React.CSSProperties = { display:'block', fontSize:14, fontWeight:700, color:'var(--green-deep)', fontFamily:'Arial, sans-serif', marginBottom:6 }

  return (
    <>
      <section style={{ position:'relative', height:220, overflow:'hidden' }}>
        <Image src="/images/tasse-dessus.jpg" alt={t('auth.seConnecter')} fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.82)', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', padding:'32px 24px' }}>
            <span style={{ fontSize:13, letterSpacing:'2.5px', color:'var(--gold)', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{t('page.connexion')}</span>
            <h1 style={{ fontSize:30, fontWeight:400, color:'var(--text-inverse)', marginTop:6 }}>
              {lang === 'en' ? <>Access your <em style={{ color:'var(--gold)' }}>account</em></> : <>Accédez à votre <em style={{ color:'var(--gold)' }}>espace</em></>}
            </h1>
          </div>
        </div>
      </section>

      <section style={{ background:'var(--bg-section)', padding:'60px 24px', minHeight:'60vh' }}>
        <div className="card-fade-in" style={{ maxWidth:420, margin:'0 auto', background:'var(--bg-card)', borderRadius:16, padding:'40px 36px', border:'0.5px solid var(--border-color)', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>

          {status === 'error' && (
            <div style={{ background:'var(--bg-error)', border:'1px solid var(--border-error)', borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
              <p style={{ fontSize:14, color:'var(--text-error)', fontFamily:'Arial, sans-serif' }}>{errMsg}</p>
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
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:4, color:'var(--text-muted)' }}>
                {showMdp ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ textAlign:'right', marginBottom:24 }}>
            <Link href="/mot-de-passe-oublie" style={{ fontSize:13, color:'var(--green-mid)', fontFamily:'Arial, sans-serif' }}>{t('auth.mdpOublie')}</Link>
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

          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
            <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, minHeight: 44 }} />
          ) : (
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Arial, sans-serif', marginBottom: 24 }}>
              {lang === 'en' ? 'Google sign-in is currently unavailable.' : 'Connexion Google momentanément indisponible.'}
            </div>
          )}

          <p style={{ textAlign:'center', fontSize:14, color:'var(--text-muted)', fontFamily:'Arial, sans-serif' }}>
            {t('auth.pasCpt')}{' '}
            <Link href="/inscription" style={{ color:'var(--green-mid)', fontWeight:700 }}>{t('auth.sinscrire')}</Link>
          </p>
        </div>
      </section>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .card-fade-in { animation:fadeInUp .5s ease both; }
        .card-fade-in > div { animation:fadeInUp .4s ease both; }
        .card-fade-in > div:nth-child(2) { animation-delay:.08s; }
        .card-fade-in > div:nth-child(3) { animation-delay:.16s; }
        .card-fade-in > div:nth-child(4) { animation-delay:.24s; }
        .card-fade-in > div:nth-child(5) { animation-delay:.32s; }
        .card-fade-in > div:nth-child(6) { animation-delay:.40s; }
        .card-fade-in > div:nth-child(7) { animation-delay:.48s; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        .btn-gold:disabled { animation:pulse 1.5s ease infinite; }
        input:focus { border-color:var(--gold) !important; box-shadow:0 0 0 3px rgba(201,151,58,0.2) !important; transition:all .25s; }
      `}</style>
    </>
  )
}
