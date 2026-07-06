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

export default function Inscription() {
  const { inscrire, connecterGoogle, user, loading } = useAuth()
  const { lang, t } = useLang()
  const router = useRouter()
  const [form, setForm] = useState({ prenom:'', nom:'', email:'', telephone:'', ville:'', mdp:'', confirmer:'' })
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
        theme: 'outline', size: 'large', width: 340, text: 'signup_with',
        locale: lang === 'en' ? 'en' : 'fr',
      })
    }

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

  const change = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.prenom || !form.email || !form.mdp) return
    if (form.mdp !== form.confirmer) { setStatus('error'); setErrMsg(lang === 'en' ? 'Passwords do not match.' : 'Les mots de passe ne correspondent pas.'); return }
    setStatus('loading')
    const res = await inscrire({ prenom:form.prenom, nom:form.nom, email:form.email, telephone:form.telephone, ville:form.ville, mot_de_passe:form.mdp, confirmation:form.confirmer })
    if (res.ok) window.location.replace('/espace-client')
    else { setStatus('error'); setErrMsg(res.message || (lang === 'en' ? 'Registration error. Try again.' : "Erreur d'inscription. Réessayez.")) }
  }

  const inp: React.CSSProperties = { width:'100%', padding:'13px 15px', border:'1.5px solid #D4C9B0', borderRadius:6, fontSize:15, fontFamily:'Arial, sans-serif', outline:'none', boxSizing:'border-box', color:'#2C1A0E', background:'#fff' }
  const lbl: React.CSSProperties = { display:'block', fontSize:14, fontWeight:700, color:'#1A3C2E', fontFamily:'Arial, sans-serif', marginBottom:6 }

  return (
    <>
      <section style={{ position:'relative', height:220, overflow:'hidden' }}>
        <Image src="/images/tasse-dessus.jpg" alt={t('auth.creerCompte')} fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.82)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'32px 40px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', width:'100%' }}>
            <span style={{ fontSize:13, letterSpacing:'2.5px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{t('auth.creerCompte')}</span>
            <h1 style={{ fontSize:30, fontWeight:400, color:'#F0EBE0', marginTop:6 }}>
              {lang === 'en' ? <>Join the <em style={{ color:'#C9973A' }}>Pio Pio family</em></> : <>Rejoignez la <em style={{ color:'#C9973A' }}>famille Pio Pio</em></>}
            </h1>
          </div>
        </div>
      </section>

      <section style={{ background:'var(--bg-section)', padding:'60px 24px' }}>
        <div style={{ maxWidth:500, margin:'0 auto', background:'var(--bg-card)', borderRadius:16, padding:'40px 36px', border:'0.5px solid var(--border-color)', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>

          {status === 'error' && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
              <p style={{ fontSize:14, color:'#B91C1C', fontFamily:'Arial, sans-serif' }}>{errMsg}</p>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
            <div>
              <label style={lbl}>{t('auth.prenom')} *</label>
              <input name="prenom" value={form.prenom} onChange={change} placeholder={lang === 'en' ? 'John' : 'Kofi'} style={inp} />
            </div>
            <div>
              <label style={lbl}>{t('auth.nom')}</label>
              <input name="nom" value={form.nom} onChange={change} placeholder={lang === 'en' ? 'Doe' : 'Mensah'} style={inp} />
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={lbl}>{t('auth.email')} *</label>
            <input name="email" type="email" value={form.email} onChange={change} placeholder="email@example.com" style={inp} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
            <div>
              <label style={lbl}>{t('auth.telephone')}</label>
              <input name="telephone" value={form.telephone} onChange={change} placeholder="+229 XX XX XX XX" style={inp} />
            </div>
            <div>
              <label style={lbl}>{t('auth.ville')}</label>
              <input name="ville" value={form.ville} onChange={change} placeholder={lang === 'en' ? 'Cotonou' : 'Cotonou'} style={inp} />
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={lbl}>{t('auth.mdp')} *</label>
            <div style={{ position:'relative' }}>
              <input name="mdp" type={showMdp?'text':'password'} value={form.mdp} onChange={change} placeholder="••••••••" style={{ ...inp, paddingRight:46 }} />
              <button onClick={()=>setShowMdp(!showMdp)} aria-label={showMdp?t('auth.masquerMdp'):t('auth.afficherMdp')}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#6B5E4E' }}>
                {showMdp ? '' : ''}
              </button>
            </div>
          </div>

          <div style={{ marginBottom:28 }}>
            <label style={lbl}>{t('auth.confirmerMdp')} *</label>
            <input name="confirmer" type={showMdp?'text':'password'} value={form.confirmer} onChange={change} placeholder="••••••••" style={inp} />
          </div>

          <button onClick={handleSubmit} disabled={status==='loading'||loading} className="btn-gold"
            style={{ width:'100%', textAlign:'center', padding:'14px', fontSize:15, opacity:(status==='loading'||loading)?0.7:1, cursor:(status==='loading'||loading)?'wait':'pointer', marginBottom:16 }}>
            {(status==='loading'||loading) ? t('auth.creationCours') : t('auth.creerCompte')}
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
            {t('auth.dejaCpt')}{' '}
            <Link href="/connexion" style={{ color:'#2D6A4F', fontWeight:700 }}>{t('auth.seConnecter')}</Link>
          </p>
        </div>
      </section>
    </>
  )
}
