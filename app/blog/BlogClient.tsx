'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

type Article = { id?: number; slug?: string; categorie?: string; date_publication?: string; titre?: string; extrait?: string; image?: string | null; temps_lecture?: string }

const emojiCat: Record<string,string> = { 'Plantes médicinales':'🌿', 'Famille & Santé':'👨‍👩‍👧', 'Distribution':'📦', 'Santé naturelle':'💚', default:'📖' }

function fmtDate(d: string, lang: string) {
  try { return new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day:'2-digit', month:'long', year:'numeric' }) }
  catch { return d }
}

export default function BlogClient({ articles }: { articles: Article[] }) {
  const { lang, t } = useLang()
  const [featured, ...rest] = articles

  return (
    <>
      <section style={{ background:'linear-gradient(160deg, #0D2318 0%, #1A3C2E 60%, #2D6A4F 100%)', padding:'80px 24px 70px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', border:'1px solid rgba(201,151,58,0.1)', pointerEvents:'none' }} />
        <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <span className="badge-gold" style={{ marginBottom:20, display:'inline-block' }}>{t('blog.badge')}</span>
          <h1 style={{ fontSize:'clamp(32px,5vw,52px)', fontWeight:400, color:'#F0EBE0', lineHeight:1.15, margin:'0 0 18px' }}>
            {t('blog.titre')}{' '}<em style={{ color:'#C9973A', fontStyle:'italic' }}>{t('blog.titreEm')}</em>
          </h1>
          <p style={{ fontSize:16, color:'rgba(168,213,184,0.85)', fontFamily:'Arial, sans-serif', lineHeight:1.75, maxWidth:500, margin:'0 auto 32px' }}>{t('blog.sous')}</p>
          <div style={{ display:'flex', gap:32, justifyContent:'center', flexWrap:'wrap' }}>
            {[{ num:articles.length.toString(), label:t('blog.articles') }, { num:'3', label:t('blog.categories') }, { num:'100%', label:t('blog.gratuit') }].map(s => (
              <div key={s.label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:24, fontWeight:700, color:'#C9973A', fontFamily:'Georgia, serif' }}>{s.num}</div>
                <div style={{ fontSize:12, color:'rgba(168,213,184,0.7)', fontFamily:'Arial, sans-serif', letterSpacing:'1px', textTransform:'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'var(--bg-page)', padding:'60px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          {featured && (
            <div style={{ marginBottom:52 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ height:2, flex:1, background:'linear-gradient(90deg, #C9973A, transparent)' }} />
                <span style={{ fontSize:11, fontWeight:700, color:'#C9973A', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'Arial, sans-serif' }}>{t('blog.vedette')}</span>
                <div style={{ height:2, flex:1, background:'linear-gradient(90deg, transparent, #C9973A)' }} />
              </div>
              <Link href={`/blog/${featured.slug}`} style={{ textDecoration:'none', display:'block' }}>
                <div className="card" style={{ display:'flex', flexWrap:'wrap', overflow:'hidden', borderRadius:20 }}>
                  <div style={{ position:'relative', flex:'0 0 420px', minHeight:280, background:'linear-gradient(135deg, #1A3C2E, #0D2318)' }}>
                    {featured.image
                      ? <Image src={featured.image} alt={featured.titre ?? ''} fill style={{ objectFit:'cover' }} unoptimized />
                      : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
                          <span style={{ fontSize:64 }}>{emojiCat[featured.categorie ?? ''] ?? '🌿'}</span>
                        </div>
                    }
                    <div style={{ position:'absolute', top:16, left:16, background:'rgba(201,151,58,0.92)', color:'#1A3C2E', fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:10 }}>{featured.categorie}</div>
                  </div>
                  <div style={{ flex:1, minWidth:260, padding:'36px 32px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:16 }}>
                        <span style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'Arial, sans-serif' }}>{fmtDate(featured.date_publication ?? '', lang)}</span>
                        <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--border-color)', display:'inline-block' }} />
                        <span style={{ fontSize:12, color:'#2D6A4F', fontFamily:'Arial, sans-serif', fontWeight:600 }}>📖 {featured.temps_lecture}</span>
                      </div>
                      <h2 style={{ fontSize:'clamp(20px,2.5vw,26px)', fontWeight:400, color:'var(--text-primary)', lineHeight:1.3, marginBottom:14 }}>{featured.titre}</h2>
                      <p style={{ fontSize:14, color:'var(--text-muted)', fontFamily:'Arial, sans-serif', lineHeight:1.75, marginBottom:24 }}>{featured.extrait}</p>
                    </div>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:14, color:'#2D6A4F', fontWeight:700, fontFamily:'Arial, sans-serif' }}>
                      {t('blog.lire')} <span style={{ fontSize:18 }}>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {rest.length > 0 && (
            <>
              <h2 style={{ fontSize:22, fontWeight:400, color:'var(--text-primary)', marginBottom:24 }}>{t('blog.autres')}</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:24, marginBottom:52 }}>
                {rest.map((a:any) => (
                  <Link key={a.id ?? a.slug} href={`/blog/${a.slug}`} style={{ textDecoration:'none', display:'flex', flexDirection:'column' }}>
                    <div className="card" style={{ flex:1, display:'flex', flexDirection:'column', borderRadius:18 }}>
                      <div style={{ position:'relative', height:190, background:'linear-gradient(135deg, #1A3C2E, #0D2318)', flexShrink:0, overflow:'hidden' }}>
                        {a.image
                          ? <Image src={a.image} alt={a.titre ?? ''} fill style={{ objectFit:'cover' }} unoptimized />
                          : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:48 }}>{emojiCat[a.categorie ?? ''] ?? '🌿'}</span></div>
                        }
                        <div style={{ position:'absolute', top:12, left:12, background:'rgba(201,151,58,0.9)', color:'#1A3C2E', fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:8 }}>{a.categorie}</div>
                      </div>
                      <div style={{ padding:'20px 18px', display:'flex', flexDirection:'column', flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                          <span style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'Arial, sans-serif' }}>{fmtDate(a.date_publication ?? '', lang)}</span>
                          <span style={{ fontSize:12, color:'#6B9E7A', fontFamily:'Arial, sans-serif', fontWeight:600 }}>📖 {a.temps_lecture}</span>
                        </div>
                        <h3 style={{ fontSize:17, fontWeight:400, color:'var(--text-primary)', lineHeight:1.35, marginBottom:10, flex:1 }}>{a.titre}</h3>
                        <p style={{ fontSize:13, color:'var(--text-muted)', fontFamily:'Arial, sans-serif', lineHeight:1.65, marginBottom:16 }}>{(a.extrait ?? '').substring(0,100)}...</p>
                        <span style={{ fontSize:13, color:'#2D6A4F', fontWeight:700, fontFamily:'Arial, sans-serif' }}>{t('blog.lire')} →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div style={{ background:'linear-gradient(135deg, #1A3C2E 0%, #0D2318 100%)', borderRadius:24, padding:'48px 40px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'relative', zIndex:1 }}>
              <span style={{ fontSize:32, display:'block', marginBottom:16 }}>🌿</span>
              <h3 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:400, color:'#F0EBE0', marginBottom:10 }}>
                {t('blog.ctaTitre')} <em style={{ color:'#C9973A' }}>{t('blog.ctaEm')}</em>
              </h3>
              <p style={{ fontSize:15, color:'rgba(168,213,184,0.8)', fontFamily:'Arial, sans-serif', marginBottom:28, maxWidth:440, margin:'0 auto 28px' }}>{t('blog.ctaSub')}</p>
              <Link href="/contact" className="btn-gold" style={{ display:'inline-block', fontSize:15, padding:'14px 32px' }}>{t('blog.ctaBtn')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
