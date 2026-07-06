'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useLang } from '@/context/LanguageContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function ResetForm() {
  const { lang, t } = useLang()
  const params = useSearchParams()
  const token = params.get('token') || ''
  const uid   = params.get('uid')   || ''
  const [mdp, setMdp] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showMdp, setShowMdp] = useState(false)
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  const handleSubmit = async () => {
    if (!mdp || mdp !== confirm) {
      setStatus('error'); return
    }
    setStatus('loading')
    try {
      const res = await fetch(`${API_BASE}/auth/reset-mot-de-passe/confirmer/`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ token, uid, nouveau_mot_de_passe:mdp })
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch { setStatus('error') }
  }

  const inp: React.CSSProperties = { width:'100%', padding:'13px 15px', border:'1.5px solid #D4C9B0', borderRadius:6, fontSize:15, fontFamily:'Arial, sans-serif', outline:'none', boxSizing:'border-box', color:'#2C1A0E', background:'#fff' }
  const lbl: React.CSSProperties = { display:'block', fontSize:14, fontWeight:700, color:'#1A3C2E', fontFamily:'Arial, sans-serif', marginBottom:6 }

  if (status === 'done') return (
    <div style={{ textAlign:'center', padding:'20px 0' }}>
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <h3 style={{ fontSize:22, fontWeight:400, color:'var(--text-primary)', marginBottom:10 }}>{t('auth.mdpModifie')}</h3>
      <Link href="/connexion" className="btn-gold" style={{ display:'inline-block', marginTop:12 }}>{t('auth.seConnecter')}</Link>
    </div>
  )

  return (
    <>
      {status === 'error' && (
        <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
          <p style={{ fontSize:14, color:'#B91C1C', fontFamily:'Arial, sans-serif' }}>
            {lang === 'en' ? 'Error. Make sure both passwords match.' : 'Erreur. Vérifiez que les mots de passe correspondent.'}
          </p>
        </div>
      )}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>{t('auth.nvMdp')} *</label>
        <div style={{ position:'relative' }}>
          <input type={showMdp?'text':'password'} value={mdp} onChange={e=>setMdp(e.target.value)} placeholder="••••••••" style={{ ...inp, paddingRight:46 }} />
          <button onClick={()=>setShowMdp(!showMdp)} aria-label={showMdp?t('auth.masquerMdp'):t('auth.afficherMdp')}
            style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#6B5E4E' }}>
            {showMdp ? '' : ''}
          </button>
        </div>
      </div>
      <div style={{ marginBottom:28 }}>
        <label style={lbl}>{t('auth.confirmerNvMdp')} *</label>
        <input type={showMdp?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••" style={inp} />
      </div>
      <button onClick={handleSubmit} disabled={status==='loading'} className="btn-gold"
        style={{ width:'100%', textAlign:'center', padding:'14px', fontSize:15, opacity:status==='loading'?0.7:1, cursor:status==='loading'?'wait':'pointer' }}>
        {status === 'loading' ? t('auth.reinitialisationCours') : t('auth.reinitialiser')}
      </button>
    </>
  )
}

export default function ReinitialiserMotDePasse() {
  const { lang, t } = useLang()
  return (
    <>
      <section style={{ position:'relative', height:180, overflow:'hidden' }}>
        <Image src="/images/tasse-dessus.jpg" alt={t('auth.reinitialiser')} fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.82)', display:'flex', alignItems:'flex-end', padding:'28px 40px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', width:'100%' }}>
            <span style={{ fontSize:13, letterSpacing:'2.5px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{t('auth.reinitialiser')}</span>
            <h1 style={{ fontSize:28, fontWeight:400, color:'#F0EBE0', marginTop:6 }}>
              {lang === 'en' ? <>Create a new <em style={{ color:'#C9973A' }}>password</em></> : <>Créez votre nouveau <em style={{ color:'#C9973A' }}>mot de passe</em></>}
            </h1>
          </div>
        </div>
      </section>
      <section style={{ background:'var(--bg-section)', padding:'60px 24px', minHeight:'60vh' }}>
        <div style={{ maxWidth:420, margin:'0 auto', background:'var(--bg-card)', borderRadius:16, padding:'40px 36px', border:'0.5px solid var(--border-color)', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
          <Suspense fallback={<p style={{ fontFamily:'Arial, sans-serif', color:'var(--text-muted)' }}>{t('commun.charger')}</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
