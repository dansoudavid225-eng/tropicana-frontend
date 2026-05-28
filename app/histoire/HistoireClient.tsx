'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

type Chapitre = { id?: number; numero?: string; titre?: string; texte?: string; image?: string | null }
type Mission   = { id?: number; icone?: string; texte?: string }
type Fondateur = { citation?: string; nom?: string; role?: string; photo?: string | null }
interface Props { chapitres: Chapitre[]; missions: Mission[]; fondateur: Fondateur }

export default function HistoireClient({ chapitres, missions, fondateur }: Props) {
  const { lang, t } = useLang()

  const chapitresEN = [
    { id:1, numero:'01', titre:'The laboratories of Cuba', texte:"A veterinarian trained in Cuba — graduating from the country's largest diagnostic laboratory — the founder never stopped observing and understanding life. A deep conviction took shape: a healthy cell is a well-irrigated cell." },
    { id:2, numero:'02', titre:'The return to Benin', texte:"Back in Benin, he turned his gaze toward the natural resources of his land. He rediscovered an ancestral plant cultivated for centuries in the royal courts of Egypt: white lemon verbena — the king of teas." },
    { id:3, numero:'03', titre:'The birth of Tropicana Pio Pio', texte:"Convinced that this natural treasure deserved to be shared, he decided to build a serious industry. He began cultivating white verbena along with other endangered medicinal plants." },
    { id:4, numero:'04', titre:'Our ambition', texte:"Our 100% organic tea, additive-free, is produced in Porto-Novo. Our ambition: to shine at the national, sub-regional, and international level." },
  ]
  const missionsEN = [
    { id:1, icone:'🌱', texte:'Produce a 100% organic tea, additive-free, accessible to the whole family' },
    { id:2, icone:'🌍', texte:'Preserve endangered African medicinal plants' },
    { id:3, icone:'🏆', texte:'Make Thé Pio Pio an ambassador of African well-being worldwide' },
    { id:4, icone:'🚀', texte:'Expand at the national, sub-regional and international level' },
  ]

  const displayChapitres = lang === 'en' ? chapitresEN : chapitres
  const displayMissions  = lang === 'en' ? missionsEN  : missions

  return (
    <>
      <section style={{ position:'relative', height:320, overflow:'hidden' }}>
        <Image src="/images/plante-verveine.jpg" alt="La verveine blanche" fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.75)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'40px' }}>
          <div style={{ maxWidth:800, margin:'0 auto', width:'100%' }}>
            <span style={{ fontSize:15, letterSpacing:'2.5px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{t('histoire.label')}</span>
            <h1 style={{ fontSize:34, fontWeight:400, color:'#F0EBE0', marginTop:8, lineHeight:1.3 }}>
              {t('histoire.titre')} —<br /><em style={{ color:'#C9973A' }}>{t('histoire.sous')}</em>
            </h1>
          </div>
        </div>
      </section>

      <section style={{ background:'var(--bg-page)', padding:'60px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          {displayChapitres.map((item:any, i:number) => (
            <div key={item.id ?? item.numero}>
              <div style={{ display:'flex', gap:28, marginBottom:40, alignItems:'flex-start' }}>
                <div style={{ fontSize:40, fontWeight:400, color:'#D4C9B0', fontFamily:'Georgia, serif', lineHeight:1, flexShrink:0, marginTop:4 }}>{item.numero}</div>
                <div style={{ borderLeft:'2px solid #EAF4EE', paddingLeft:24 }}>
                  <h2 style={{ fontSize:20, fontWeight:400, color:'var(--text-primary)', marginBottom:12 }}>{item.titre}</h2>
                  <p style={{ fontSize:15, color:'var(--text-secondary)', fontFamily:'Arial, sans-serif', lineHeight:1.9, fontWeight:300 }}>{item.texte}</p>
                  {item.image && (
                    <div style={{ position:'relative', height:200, borderRadius:10, overflow:'hidden', marginTop:16 }}>
                      <Image src={item.image} alt={item.titre ?? ''} fill style={{ objectFit:'cover' }} unoptimized />
                    </div>
                  )}
                </div>
              </div>
              {i === 1 && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:40 }}>
                  <div style={{ position:'relative', height:220, borderRadius:10, overflow:'hidden' }}>
                    <Image src="/images/produit-bois.jpg" alt="Thé Pio Pio" fill style={{ objectFit:'cover' }} />
                  </div>
                  <div style={{ position:'relative', height:220, borderRadius:10, overflow:'hidden' }}>
                    <Image src="/images/tasse-dessus.jpg" alt="Tasse de thé" fill style={{ objectFit:'cover' }} />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div style={{ background:'#0D2318', borderRadius:16, overflow:'hidden', marginBottom:48, display:'flex', flexWrap:'wrap' }}>
            <div style={{ position:'relative', width:240, minHeight:300, flexShrink:0 }}>
              <Image src={fondateur.photo || '/images/fondateur-durand.jpg'} alt={fondateur.nom ?? 'Fondateur'} fill style={{ objectFit:'cover', objectPosition:'center top' }} unoptimized={!!fondateur.photo} />
            </div>
            <div style={{ flex:1, minWidth:220, padding:'36px 28px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ fontSize:36, color:'#C9973A', fontFamily:'Georgia, serif', lineHeight:1, marginBottom:16, opacity:0.6 }}>&quot;</div>
              <p style={{ fontSize:15, fontStyle:'italic', color:'#E8F5EE', lineHeight:1.9, marginBottom:20 }}>{t('histoire.citation')}</p>
              <div style={{ borderTop:'1px solid #1A3C2E', paddingTop:16 }}>
                <p style={{ fontSize:15, fontWeight:700, color:'#C9973A', fontFamily:'Arial, sans-serif', marginBottom:4 }}>{fondateur.nom}</p>
                <p style={{ fontSize:13, color:'#6B9E7A', fontFamily:'Arial, sans-serif', lineHeight:1.6, whiteSpace:'pre-line' }}>{t('histoire.fondateur')}</p>
              </div>
            </div>
          </div>

          <h2 style={{ fontSize:22, fontWeight:400, color:'var(--text-primary)', marginBottom:20 }}>{t('histoire.mission')}</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:40 }}>
            {displayMissions.map((m:any) => (
              <div key={m.id ?? m.texte} style={{ background:'#EAF4EE', borderRadius:8, padding:'16px 14px', display:'flex', gap:12, alignItems:'flex-start' }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{m.icone}</span>
                <p style={{ fontSize:14, color:'#1A3C2E', fontFamily:'Arial, sans-serif', lineHeight:1.6 }}>{m.texte}</p>
              </div>
            ))}
          </div>

          <div style={{ position:'relative', height:260, borderRadius:14, overflow:'hidden', marginBottom:40 }}>
            <Image src="/images/produit-tasse.jpg" alt="Thé Pio Pio" fill style={{ objectFit:'cover' }} />
            <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.6)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', textAlign:'center', gap:14 }}>
              <p style={{ fontSize:18, color:'#F0EBE0', fontStyle:'italic' }}>&quot;{t('histoire.cta')}&quot;</p>
              <Link href="/boutique" className="btn-gold">{t('histoire.ctaBtn')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
