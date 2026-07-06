'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSiteConfig } from '@/lib/useSiteConfig'
import { useLang } from '@/context/LanguageContext'

export default function Contact() {
  const site = useSiteConfig()
  const { lang, t } = useLang()
  const [form, setForm] = useState({ nom:'', email:'', telephone:'', objet:'', message:'' })
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.nom || !form.email || !form.message)
      return alert(lang === 'en' ? 'Please fill in all required fields (Name, Email, Message).' : 'Veuillez remplir tous les champs obligatoires (Nom, Email, Message).')
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          access_key: '30484ae9-87aa-4add-a1b0-9c39b4994048',
          from_name: 'Tropicana Pio Pio — Site web',
          name: form.nom,
          email: form.email,
          telephone: form.telephone || '—',
          subject: form.objet || 'Message depuis Tropicana Pio Pio',
          message: form.message,
        }),
      })
      const data = await res.json()
      if (data.success) { setStatus('sent'); setForm({ nom:'', email:'', telephone:'', objet:'', message:'' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inp: React.CSSProperties = { width:'100%', padding:'13px 15px', border:'1.5px solid #D4C9B0', borderRadius:6, fontSize:15, fontFamily:'Arial, sans-serif', color:'#2C1A0E', background:'#fff', outline:'none', boxSizing:'border-box' }
  const lbl: React.CSSProperties = { display:'block', fontSize:14, fontWeight:700, color:'#1A3C2E', fontFamily:'Arial, sans-serif', marginBottom:6, letterSpacing:'0.4px' }

  const coordItems = [
    { icon:'', label:t('contact.adresse'),   value:site.adresse },
    { icon:'', label:t('contact.telephone'), value:site.telephone },
    { icon:'', label:t('contact.email'),     value:site.email },
    { icon:'', label:t('contact.dispo'),     value:t('contact.dispoVal') },
    { icon:'', label:t('contact.livraison'), value:t('contact.livVal') },
  ]

  return (
    <>
      {/* Hero */}
      <section style={{ position:'relative', height:260, overflow:'hidden' }}>
        <Image src="/images/produit-bois.jpg" alt="Contact Tropicana Pio Pio" fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.75)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'24px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', width:'100%' }}>
            <span style={{ fontSize:14, letterSpacing:'2.5px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{t('contact.label')}</span>
            <h1 style={{ fontSize:34, fontWeight:400, color:'#F0EBE0', marginTop:8 }}>
              {lang === 'en' ? <>We are here to <em style={{ color:'#C9973A' }}>help you</em></> : <>Nous sommes à <em style={{ color:'#C9973A' }}>votre écoute</em></>}
            </h1>
          </div>
        </div>
      </section>

      {/* Raccourcis */}
      <div style={{ background:'#1A3C2E', padding:'16px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          <a href="https://wa.me/2290195967762?text=Bonjour%2C%20je%20souhaite%20vous%20contacter." target="_blank" rel="noopener noreferrer"
            style={{ background:'#25D366', color:'#fff', fontFamily:'Arial, sans-serif', fontWeight:700, fontSize:14, padding:'10px 20px', borderRadius:6, textDecoration:'none' }}>
            {t('contact.whatsappDirect')}
          </a>
          <a href={`tel:${site.telephone_raw}`} style={{ background:'#0D2318', border:'1px solid #2D6A4F', color:'#95D5B2', fontFamily:'Arial, sans-serif', fontSize:14, padding:'10px 20px', borderRadius:6, textDecoration:'none' }}>
            {site.telephone}
          </a>
          <a href={`mailto:${site.email}`} style={{ background:'#0D2318', border:'1px solid #2D6A4F', color:'#95D5B2', fontFamily:'Arial, sans-serif', fontSize:14, padding:'10px 20px', borderRadius:6, textDecoration:'none' }}>
            {t('contact.emailDirect')}
          </a>
        </div>
      </div>

      <section style={{ background:'var(--bg-section)', padding:'60px 24px' }}>
        <div className="contact-grid" style={{ maxWidth:1200, margin:'0 auto' }}>

          {/* Formulaire */}
          <div style={{ background:'var(--bg-card)', borderRadius:14, padding:'36px 32px', border:'0.5px solid var(--border-color)', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
            {status === 'sent' ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <h3 style={{ fontSize:24, fontWeight:400, color:'var(--text-primary)', marginBottom:10 }}>{t('contact.envoye')}</h3>
                <p style={{ fontSize:15, color:'var(--text-muted)', fontFamily:'Arial, sans-serif', lineHeight:1.7, marginBottom:24 }}>{t('contact.merci')}</p>
                <Link href="/boutique" className="btn-gold">{t('contact.voirBoutique')}</Link>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize:22, fontWeight:400, color:'var(--text-primary)', marginBottom:6 }}>{t('contact.formTitre')}</h2>
                <p style={{ fontSize:14, color:'var(--text-muted)', fontFamily:'Arial, sans-serif', marginBottom:24 }}>{t('contact.formSub')}</p>

                {status === 'error' && (
                  <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
                    <p style={{ fontSize:14, color:'#B91C1C', fontFamily:'Arial, sans-serif' }}>{t('contact.erreur')}</p>
                    <a href="https://wa.me/2290195967762" target="_blank" rel="noopener noreferrer"
                      style={{ fontSize:14, color:'#25D366', fontFamily:'Arial, sans-serif', fontWeight:700, textDecoration:'none', display:'inline-block', marginTop:6 }}>
                      {t('contact.whatsapp')}
                    </a>
                  </div>
                )}

                <div className="form-row" style={{ display:'grid', gap:16, marginBottom:16 }}>
                  <div>
                    <label style={lbl}>{t('contact.nomComplet')}</label>
                    <input name="nom" value={form.nom} onChange={handleChange} placeholder={t('contact.nomPh')} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>{t('contact.emailLbl')}</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" style={inp} />
                  </div>
                </div>

                <div className="form-row" style={{ display:'grid', gap:16, marginBottom:16 }}>
                  <div>
                    <label style={lbl}>{t('auth.telephone')}</label>
                    <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="+229 XX XX XX XX" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>{t('contact.objet')}</label>
                    <select name="objet" value={form.objet} onChange={handleChange} style={inp}>
                      <option value="">{t('contact.selectPh')}</option>
                      <option value="commande">{t('contact.optCmd')}</option>
                      <option value="partenariat">{t('contact.optPart')}</option>
                      <option value="renseignement">{t('contact.optRens')}</option>
                      <option value="autre">{t('contact.optAutre')}</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom:24 }}>
                  <label style={lbl}>{t('contact.message')}</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder={t('contact.msgPh')} rows={5} style={{ ...inp, resize:'vertical' }} />
                </div>

                <button onClick={handleSubmit} disabled={status==='sending'} className="btn-gold"
                  style={{ width:'100%', textAlign:'center', padding:'15px', fontSize:15, opacity:status==='sending'?0.7:1, cursor:status==='sending'?'wait':'pointer' }}>
                  {status === 'sending' ? t('contact.envoi') : t('contact.envoyer')}
                </button>
                <p style={{ fontSize:13, color:'var(--text-muted)', fontFamily:'Arial, sans-serif', textAlign:'center', marginTop:12 }}>{t('contact.rgpd')}</p>
              </>
            )}
          </div>

          {/* Coordonnées */}
          <div>
            <h2 style={{ fontSize:22, fontWeight:400, color:'var(--text-primary)', marginBottom:24 }}>{t('contact.coordonnees')}</h2>
            {coordItems.map(c => (
              <div key={c.label} style={{ display:'flex', gap:14, marginBottom:18, alignItems:'flex-start' }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'#C9973A', fontFamily:'Arial, sans-serif', letterSpacing:'1px', textTransform:'uppercase', marginBottom:2 }}>{c.label}</p>
                  <p style={{ fontSize:15, color:'var(--text-primary)', fontFamily:'Arial, sans-serif' }}>{c.value}</p>
                </div>
              </div>
            ))}

            <div style={{ background:'#1A3C2E', borderRadius:10, padding:'20px 18px', marginBottom:16 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'#C9973A', fontFamily:'Arial, sans-serif', marginBottom:8 }}>{t('contact.mobileMoney')}</h3>
              <p style={{ fontSize:14, color:'#95D5B2', fontFamily:'Arial, sans-serif', marginBottom:4 }}>MTN Money / Moov Money</p>
              <p style={{ fontSize:16, color:'#F0EBE0', fontFamily:'Arial, sans-serif', fontWeight:700 }}>{site.telephone}</p>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <a href="https://www.tiktok.com/@thepio08" target="_blank" rel="noopener noreferrer"
                style={{ flex:1, background:'#0D2318', color:'#95D5B2', fontSize:14, fontFamily:'Arial, sans-serif', padding:'11px 12px', borderRadius:6, textDecoration:'none', border:'1px solid #2D6A4F', textAlign:'center' }}>TikTok @thepio08</a>
              <a href="https://facebook.com/profile.php?id=61569744814995" target="_blank" rel="noopener noreferrer"
                style={{ flex:1, background:'#0D2318', color:'#95D5B2', fontSize:14, fontFamily:'Arial, sans-serif', padding:'11px 12px', borderRadius:6, textDecoration:'none', border:'1px solid #2D6A4F', textAlign:'center' }}>Facebook</a>
            </div>
          </div>

        </div>

        {/* Google Maps — pleine largeur */}
        <div style={{ maxWidth:1200, margin:'24px auto 0', borderRadius:10, overflow:'hidden', border:'1px solid rgba(45,106,79,0.3)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.052!2d2.6198!3d6.4969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023531cf0c5695b%3A0x97f7d7c0ecd8e1bb!2sOganla%2C%20Porto-Novo%2C%20Benin!5e0!3m2!1sfr!2sbj!4v1716559000000!5m2!1sfr!2sbj"
            width="100%" height="350"
            style={{ border:0, display:'block' }}
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation Tropicana Pio Pio"
          />
          <a href="https://maps.app.goo.gl/HoiH17s7iBD6cRui7" target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:8, background:'#1A3C2E', padding:'10px 14px', fontSize:13, color:'#95D5B2', fontFamily:'Arial, sans-serif', textDecoration:'none', justifyContent:'center' }}>
            <span>{t('contact.ouvrirMaps')}</span>
          </a>
        </div>
      </section>

      {/* Distributeurs */}
      <section style={{ background:'#1A3C2E', padding:'48px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:40, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:260 }}>
            <h2 style={{ fontSize:24, fontWeight:400, color:'#F0EBE0', marginBottom:14 }}>{t('contact.distTitre')}</h2>
            <p style={{ color:'#95D5B2', fontSize:15, fontFamily:'Arial, sans-serif', lineHeight:1.8, marginBottom:20, fontWeight:300 }}>{t('contact.distBody')}</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {(lang === 'en'
                ? ['Preferential price from 10 units', 'Fast national delivery', 'Commercial support included', '100% organic product']
                : ['Prix préférentiels dès 10 unités', 'Livraison nationale rapide', 'Support commercial inclus', 'Produit 100% bio']
              ).map(item => (
                <span key={item} style={{ background:'#0D2318', border:'1px solid #2D6A4F', color:'#95D5B2', fontSize:14, padding:'7px 13px', borderRadius:4, fontFamily:'Arial, sans-serif' }}>{item}</span>
              ))}
            </div>
          </div>
          <div style={{ position:'relative', width:280, height:200, borderRadius:12, overflow:'hidden', flexShrink:0 }}>
            <Image src="/images/produit-sachets.jpg" alt="Thé Pio Pio distributeurs" fill style={{ objectFit:'cover' }} />
          </div>
        </div>
      </section>

      <style>{`.contact-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:48px;align-items:start}.form-row{grid-template-columns:1fr 1fr}@media(max-width:860px){.contact-grid{grid-template-columns:1fr;gap:32px}.form-row{grid-template-columns:1fr}}@media(max-width:500px){.contact-grid>div:last-child{padding:24px 18px!important}}`}</style>
    </>
  )
}
