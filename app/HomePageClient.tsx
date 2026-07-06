'use client'
import Link from 'next/link'
import Image from 'next/image'
import ScrollReveal from '@/components/ScrollReveal'
import Partenaires from '@/components/Partenaires'
import { useLang } from '@/context/LanguageContext'

type Bienfait  = { id?: number; icone?: string; titre?: string; title?: string; description?: string; desc?: string }
type Temoignage= { nom?: string; name?: string; ville?: string; city?: string; texte?: string; text?: string; note?: number }
type CfgAccueil= { tasse_image?: string; tasse_label?: string; tasse_citation?: string; tasse_lien?: string; tasse_bouton?: string } | null
type CfgSite   = { arguments?: any[]; stats?: any[] } | null
type SiteContentArgs = { arguments?: { icon: string; title: string; sub: string }[]; stats?: { num: string; label: string; icon: string; desc: string }[]; stats_bandeau?: string; temoignages_rapides?: { texte: string; nom: string; ville: string }[]; tasse_label?: string; tasse_citation?: string; tasse_citation_em?: string; tasse_btn?: string; fondateur_label?: string; fondateur_titre?: string; fondateur_citation?: string; fondateur_nom?: string; fondateur_sous?: string; fondateur_btn?: string; plante_label?: string; plante_titre?: string; plante_titre_em?: string; plante_texte?: string; plante_points?: string[] } | null

interface Props { bienfaits: Bienfait[]; testimonials: Temoignage[]; configAccueil: CfgAccueil; configSite: CfgSite; siteContent?: SiteContentArgs }

export default function HomePageClient({ bienfaits, testimonials, configAccueil, configSite, siteContent }: Props) {
  const { lang, t } = useLang()

  const argumentsAdmin = siteContent?.arguments?.length
    ? siteContent.arguments.map(a => ({ icone: a.icon, titre: a.title, sous: a.sub }))
    : null
  const statsAdmin = siteContent?.stats?.length
    ? siteContent.stats.map(s => ({ num: s.num, label: s.label, icone: s.icon, desc: s.desc }))
    : null

  const argIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  const args = lang === 'en'
    ? [ { icone:argIcon, titre:'100% Organic', sous:'No fertilizer or herbicide' }, { icone:argIcon, titre:'Science-backed', sous:'Formulated by a veterinarian' }, { icone:argIcon, titre:'Whole family', sous:'Recommended from age 2' }, { icone:argIcon, titre:'Made in Benin', sous:'Nationwide delivery' } ]
    : [ { icone:argIcon, titre:'100 % Bio', sous:'Sans engrais ni herbicides' }, { icone:argIcon, titre:'Fondé sur la science', sous:'Formulé par un vétérinaire' }, { icone:argIcon, titre:'Toute la famille', sous:'Recommandé dès 2 ans' }, { icone:argIcon, titre:'Made in Bénin', sous:'Livraison nationale' } ]

  const planteBullets = lang === 'en'
    ? ['Known for its deep relaxing properties', 'Natural artery cleanser', 'Rich in vitamin K, essential for internal balance', 'Promotes deep, restful sleep']
    : ["Connue pour ses vertus relaxantes profondes", "Nettoyante naturelle des artères", "Riche en vitamine K, essentielle à l'équilibre interne", 'Favorise un sommeil profond et récupérateur']

  const produitTags = lang === 'en'
    ? ['100% Organic', 'No additives', 'From age 2', 'Made in Benin']
    : ['100% Bio', 'Sans additif', 'Dès 2 ans', 'Made in Bénin']

  const locItems = lang === 'en'
    ? [
        { icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', label:'Address',             value:'Porto-Novo, Republic of Benin', gold:false },
        { icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>', label:'Nationwide delivery', value:'All cities in Benin — 24h to 48h', gold:false },
        { icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>', label:'Phone',               value:'+229 01 95 96 77 62', gold:true },
        { icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>', label:'WhatsApp',            value:'Available 7 days/7', gold:false },
      ]
    : [
        { icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>', label:'Adresse',             value:'Porto-Novo, République du Bénin', gold:false },
        { icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>', label:'Livraison nationale', value:'Toutes villes du Bénin — 24h à 48h', gold:false },
        { icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>', label:'Téléphone',           value:'+229 01 95 96 77 62', gold:true },
        { icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>', label:'WhatsApp',            value:'Disponible 7j/7', gold:false },
      ]

  const statIco1 = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  const statIco2 = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  const stats = lang === 'en'
    ? [ { num:'500+', label:'Satisfied Beninese families', icone:statIco1, desc:'Across Benin' }, { num:'100%', label:'Organic, zero additive', icone:statIco2, desc:'No fertilizer or herbicide' }, { num:'From 2', label:'For the whole family', icone:statIco1, desc:'Children, adults, seniors' }, { num:'24h', label:'Delivery time', icone:statIco2, desc:'Across Benin' } ]
    : [ { num:'500+', label:'Familles béninoises satisfaites', icone:statIco1, desc:'Partout au Bénin' }, { num:'100%', label:'Bio, zéro additif', icone:statIco2, desc:'Sans engrais ni herbicide' }, { num:'Dès 2 ans', label:'Pour toute la famille', icone:statIco1, desc:'Enfants, adultes, seniors' }, { num:'24h', label:'Délai de livraison', icone:statIco2, desc:'Partout au Bénin' } ]

  return (
    <>
      {/* ── CTA FIXE MOBILE (comme CEVADEL "Voir nos produits") ── */}
      <div className="mobile-sticky-cta">
        <Link href="/boutique" className="btn-gold">
          {lang === 'en' ? 'Order now' : 'Voir nos produits'}
        </Link>
      </div>

      {/* STRIP ARGUMENTS */}
      <section style={{ background:'var(--bg-section)', borderBottom:'1px solid var(--border-color)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {(argumentsAdmin ?? configSite?.arguments ?? args).map((item:any, i:number, arr:any[]) => (
            <div key={item.titre ?? i} className="args-strip-item" style={{ display:'flex', alignItems:'center', gap:12, padding:'18px 20px', borderRight:i<arr.length-1?'1px solid #D4C9B0':'none' }}>
               <div className="args-strip-icon" style={{ width:38, height:38, background:'#2D6A4F', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }} dangerouslySetInnerHTML={{ __html: item.icone || '' }} />
              <div>
                <div className="args-strip-titre" style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', fontFamily:'Arial, sans-serif', marginBottom:2 }}>{item.titre}</div>
                <div className="args-strip-sous" style={{ fontSize:15, color:'var(--text-muted)', fontFamily:'Arial, sans-serif' }}>{item.sous}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LA PLANTE */}
      <section className="section-mobile-pad" style={{ background:'var(--bg-page)', padding:'60px 24px' }}>
        <div className="plante-grid" style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:48, alignItems:'center', flexWrap:'wrap' }}>
          <div className="plante-image-block" style={{ position:'relative', width:340, height:400, flexShrink:0 }}>
            <div style={{ position:'absolute', top:14, left:14, right:-14, bottom:-14, borderRadius:20, border:'2px solid rgba(201,151,58,0.35)', background:'rgba(201,151,58,0.06)' }} />
            <div style={{ position:'relative', width:'100%', height:'100%', borderRadius:20, overflow:'hidden', background:'#1A3C2E', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
              <Image src="/images/plante-verveine.jpg" alt="Verveine blanche citronnée" fill style={{ objectFit:'cover', objectPosition:'center top' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top, rgba(26,60,46,0.6), transparent)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', top:16, right:16, background:'rgba(13,35,24,0.85)', backdropFilter:'blur(8px)', border:'1px solid rgba(201,151,58,0.4)', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:700, color:'#C9973A', fontFamily:'Arial, sans-serif', letterSpacing:'1px' }}>100% BIO</div>
            </div>
          </div>
          <div style={{ flex:1, minWidth:260 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ flex:1, height:1, background:'var(--border-color)' }} />
              <div style={{ width:7, height:7, background:'#C9973A', transform:'rotate(45deg)' }} />
              <div style={{ flex:1, height:1, background:'var(--border-color)' }} />
            </div>
            <span style={{ fontSize:15, letterSpacing:'2.5px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{siteContent?.plante_label || t('home.planteLabel')}</span>
            <h2 style={{ fontSize:28, fontWeight:400, color:'var(--text-primary)', marginTop:8, marginBottom:16, lineHeight:1.3 }}>
              {siteContent?.plante_titre || t('home.planteTitre1')}<br /><em style={{ color:'#C9973A' }}>{siteContent?.plante_titre_em || t('home.planteTitre2')}</em>
            </h2>
            <p style={{ fontSize:15, color:'var(--text-secondary)', fontFamily:'Arial, sans-serif', lineHeight:1.9, marginBottom:20, fontWeight:300 }}>{siteContent?.plante_texte || t('home.planteDesc')}</p>
            {(siteContent?.plante_points?.length ? siteContent.plante_points : planteBullets).map((b, i) => (
              <div key={b || i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:6, height:6, background:'#2D6A4F', borderRadius:'50%', flexShrink:0 }} />
                <span style={{ fontSize:14, color:'var(--text-secondary)', fontFamily:'Arial, sans-serif' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIENFAITS */}
      <section className="section-mobile-pad" style={{ background:'var(--bg-section)', padding:'60px 24px' }}>
        <style>{`.bienfait-card{background:var(--bg-card);border:0.5px solid var(--border-color);border-radius:10px;padding:16px 14px;display:flex;gap:12px;align-items:flex-start;cursor:default;transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.28s ease,border-color 0.28s ease;will-change:transform}.bienfait-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 12px 32px rgba(26,60,46,0.13);border-color:var(--gold)}.bienfait-icone{font-size:20px;flex-shrink:0;margin-top:2px;display:inline-block;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1)}.bienfait-card:hover .bienfait-icone{transform:scale(1.35) rotate(-8deg)}.bienfait-titre{font-size:14px;font-weight:700;color:var(--text-primary);font-family:Arial,sans-serif;margin-bottom:4px;transition:color 0.2s ease}.bienfait-card:hover .bienfait-titre{color:var(--gold)}.bienfait-desc{font-size:14px;color:var(--text-secondary);font-family:Arial,sans-serif;line-height:1.5}`}</style>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <ScrollReveal animation="fadeUp">
            <span className="section-label">{t('home.bienfaitsLabel')}</span>
            <h2 className="section-title">{t('home.bienfaitsTitre')}</h2>
          </ScrollReveal>
          <div className="bienfaits-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:14 }}>
            {bienfaits.map((b:any, i:number) => (
              <ScrollReveal key={b.id ?? b.titre} animation="scaleUp" delay={i*80}>
                <div className="bienfait-card">
                  {b.icone ? <span className="bienfait-icone" dangerouslySetInnerHTML={{ __html: b.icone }} /> : <div style={{ width:8, height:8, background:'#2D6A4F', borderRadius:'50%', marginTop:6, flexShrink:0 }} />}
                  <div>
                    <div className="bienfait-titre">{b.titre ?? b.title}</div>
                    <div className="bienfait-desc">{b.description ?? b.desc}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TASSE */}
      <section className="tasse-section" style={{ position:'relative', height:340, overflow:'hidden' }}>
        <Image src={configAccueil?.tasse_image || '/images/tasse-dessus.jpg'} alt="Tasse de Thé Pio Pio" fill style={{ objectFit:'cover' }} unoptimized={!!configAccueil?.tasse_image} />
        <div style={{ position:'absolute', inset:0, background:'rgba(10,30,20,0.65)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', textAlign:'center', padding:24 }}>
          <ScrollReveal animation="fadeIn" style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <span style={{ fontSize:15, letterSpacing:'3px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase', marginBottom:12 }}>
              {siteContent?.tasse_label || configAccueil?.tasse_label || (lang === 'en' ? 'A moment just for you' : 'Un moment rien que pour vous')}
            </span>
            <h2 style={{ fontSize:30, fontWeight:400, color:'#F0EBE0', lineHeight:1.3, maxWidth:480, marginBottom:20 }}>
              &quot;{siteContent?.tasse_citation || configAccueil?.tasse_citation || t('home.cta')}&quot;
              {siteContent?.tasse_citation_em && <em style={{ color:'#C9973A', fontStyle:'italic', display:'block', fontSize:'0.8em', marginTop:6 }}>{siteContent.tasse_citation_em}</em>}
            </h2>
            <Link href={configAccueil?.tasse_lien || '/boutique'} className="btn-gold">
              {siteContent?.tasse_btn || configAccueil?.tasse_bouton || (lang === 'en' ? 'Order now' : 'Commander maintenant')}
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* FONDATEUR */}
      <section className="section-mobile-pad" style={{ background:'#1A3C2E', padding:'60px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <ScrollReveal animation="slideLeft">
            <span className="section-label">{siteContent?.fondateur_label || t('home.fondateurLabel')}</span>
            <h2 className="section-title light">{siteContent?.fondateur_titre || t('home.fondateurTitre')}</h2>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={150}>
            <div className="fondateur-card" style={{ background:'#0D2318', borderRadius:12, padding:'32px 28px', display:'flex', gap:24, alignItems:'center', flexWrap:'wrap', marginTop:8 }}>
              <div style={{ position:'relative', width:90, height:90, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'3px solid #C9973A' }}>
                <Image src="/images/fondateur-durand.jpg" alt="Felicien Prosper Durand" fill style={{ objectFit:'cover', objectPosition:'center top' }} />
              </div>
              <div style={{ flex:1, minWidth:240 }}>
                <p style={{ fontSize:15, fontStyle:'italic', color:'#E8F5EE', lineHeight:1.8, marginBottom:14 }}>&quot;{siteContent?.fondateur_citation || t('home.fondateurCit')}&quot;</p>
                <p style={{ fontSize:14, fontWeight:700, color:'#C9973A', fontFamily:'Arial, sans-serif', letterSpacing:'0.5px' }}>{siteContent?.fondateur_nom || 'Felicien Prosper DURAND'}</p>
                <p style={{ fontSize:15, color:'#6B9E7A', fontFamily:'Arial, sans-serif', marginTop:3 }}>{siteContent?.fondateur_sous || t('footer.fondateur')}</p>
              </div>
              <Link href="/histoire" className="btn-ghost" style={{ flexShrink:0 }}>{siteContent?.fondateur_btn || t('home.lireHistoire')}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PRODUIT */}
      <section className="section-mobile-pad" style={{ background:'var(--bg-section)', padding:'60px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <ScrollReveal animation="fadeUp">
            <span className="section-label">{t('home.boutiqueLabel')}</span>
            <h2 className="section-title">{t('home.produitTitre')}</h2>
          </ScrollReveal>
          <ScrollReveal animation="scaleUp" delay={200} style={{ maxWidth:680, marginTop:16 }}>
            <div className="produit-card" style={{ background:'var(--bg-card)', border:'0.5px solid var(--border-color)', borderRadius:12, overflow:'hidden', display:'flex', flexWrap:'wrap' }}>
              <div className="produit-image-block" style={{ position:'relative', flex:'0 0 260px', minHeight:220 }}>
                <Image src="/images/produit-tasse.jpg" alt="Thé Pio Pio" fill style={{ objectFit:'cover' }} />
                <div style={{ position:'absolute', top:12, left:12, background:'#C9973A', color:'var(--text-primary)', fontSize:14, fontWeight:700, padding:'4px 10px', borderRadius:3, fontFamily:'Arial, sans-serif' }}>
                  {lang === 'en' ? 'Popular' : 'Populaire'}
                </div>
              </div>
              <div style={{ flex:1, minWidth:220, padding:'24px 22px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div>
                  <h3 style={{ fontSize:18, fontWeight:700, color:'var(--text-primary)', fontFamily:'Arial, sans-serif', marginBottom:8 }}>Thé Pio Pio</h3>
                  <p style={{ fontSize:14, color:'var(--text-muted)', fontFamily:'Arial, sans-serif', lineHeight:1.7, marginBottom:14 }}>{t('home.produitDesc')}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                    {produitTags.map(tag => (
                      <span key={tag} style={{ background:'var(--bg-section)', color:'#2D6A4F', fontSize:13, padding:'4px 10px', borderRadius:20, fontFamily:'Arial, sans-serif', fontWeight:700 }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                  <span style={{ fontSize:24, fontWeight:700, color:'#2D6A4F', fontFamily:'Arial, sans-serif' }}>{t('home.prix')}</span>
                  <Link href="/boutique" className="btn-gold" style={{ fontSize:14, padding:'10px 20px' }}>{t('home.commander')}</Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Partenaires />

      {/* LOCALISATION */}
      <section className="section-mobile-pad" style={{ background:'linear-gradient(160deg, #1A3C2E 0%, #0D2318 100%)', padding:'90px 24px', position:'relative', overflow:'hidden', borderTop:'1px solid rgba(201,151,58,0.12)' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.15, backgroundImage:'linear-gradient(rgba(201,151,58,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,58,0.1) 1px, transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ marginBottom:52 }}>
            <span style={{ fontSize:11, letterSpacing:'3px', color:'#C9973A', fontFamily:'Arial, sans-serif', fontWeight:700, textTransform:'uppercase' }}>{t('home.ouTrouver')}</span>
            <h2 style={{ fontSize:'clamp(28px, 4vw, 46px)', fontWeight:300, color:'#F0EBE0', margin:'8px 0 0', lineHeight:1.15, fontFamily:'Georgia, serif' }}>
              {t('home.cultive')}{' '}<em style={{ color:'#C9973A', fontStyle:'italic', fontWeight:400 }}>{t('home.location')}</em>
            </h2>
          </div>
          <div className="loc-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:28, alignItems:'start' }}>
            <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 30px 70px rgba(0,0,0,0.5)', border:'1px solid rgba(201,151,58,0.2)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.052!2d2.6198!3d6.4969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023531cf0c5695b%3A0x97f7d7c0ecd8e1bb!2sOganla%2C%20Porto-Novo%2C%20Benin!5e0!3m2!1sfr!2sbj!4v1716559000000!5m2!1sfr!2sbj"
                width="100%" height="320"
                style={{ border:0, display:'block' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Tropicana Pio Pio"
              />
              <a href="https://maps.app.goo.gl/HoiH17s7iBD6cRui7" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(26,60,46,0.95)', padding:'10px 16px', fontSize:13, color:'#95D5B2', fontFamily:'Arial, sans-serif', textDecoration:'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#95D5B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>{t('home.ouvrirMaps')}</span>
              </a>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {locItems.map(item => (
                <div key={item.label} style={{ display:'flex', gap:14, alignItems:'center', background:item.gold?'linear-gradient(135deg, rgba(201,151,58,0.15), rgba(201,151,58,0.08))':'rgba(255,255,255,0.05)', border:item.gold?'1px solid rgba(201,151,58,0.4)':'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px' }}>
                  <span style={{ color: item.gold ? '#C9973A' : '#6B9E7A', flexShrink: 0, display: 'flex' }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:item.gold?'#C9973A':'rgba(149,213,178,0.7)', fontFamily:'Arial, sans-serif', letterSpacing:'2px', textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:15, fontWeight:item.gold?700:500, color:item.gold?'#F0EBE0':'rgba(240,235,224,0.85)', fontFamily:'Arial, sans-serif' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="section-mobile-pad" style={{ background:'#1A3C2E', padding:'60px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:8 }}>
            <div>
              <span className="section-label">{t('home.temoLabel')}</span>
              <h2 className="section-title light">{t('home.temoTitre')}</h2>
            </div>
            <Link href="/temoignages" className="btn-ghost" style={{ fontSize:14, padding:'10px 20px', marginBottom:8 }}>{t('temo.laisser')}</Link>
          </div>
          <div className="temo-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16, marginTop:8 }}>
            {testimonials.map((t2:any, i:number) => (
              <div key={t2.nom ?? t2.name ?? i} style={{ background:'#0D2318', border:'1px solid #2D6A4F', borderRadius:10, padding:20 }}>
                <div style={{ color:'#C9973A', fontSize:14, letterSpacing:3, marginBottom:12 }}>{'★'.repeat(Math.min(5, t2.note ?? 5))}</div>
                <p style={{ fontSize:14, color:'#A8D5B8', fontFamily:'Arial, sans-serif', lineHeight:1.7, fontStyle:'italic', marginBottom:16 }}>&quot;{t2.texte ?? t2.text}&quot;</p>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:30, height:30, background:'#2D6A4F', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#F0EBE0', fontFamily:'Arial, sans-serif' }}>
                    {(t2.nom ?? t2.name ?? '?').split(' ').map((w:string)=>w[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#F0EBE0', fontFamily:'Arial, sans-serif' }}>{t2.nom ?? t2.name}</div>
                    <div style={{ fontSize:15, color:'#6B9E7A', fontFamily:'Arial, sans-serif' }}>{t2.ville ?? t2.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:28 }}>
            <Link href="/temoignages" className="btn-ghost" style={{ fontSize:14, padding:'12px 28px' }}>{t('temo.voirTous')}</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background:'#0D2318', padding:'0' }}>
        <div style={{ background:'#C9973A', padding:'10px 24px', textAlign:'center' }}>
          <p style={{ fontSize:14, fontWeight:700, color:'#1A3C2E', fontFamily:'Arial, sans-serif', letterSpacing:'1.5px', textTransform:'uppercase' }}>{siteContent?.stats_bandeau || t('home.bannerTxt')}</p>
        </div>
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', maxWidth:1200, margin:'0 auto', padding:'48px 24px', gap:32 }}>
          {(statsAdmin ?? configSite?.stats ?? stats).map((s:any) => (
            <div key={s.num} style={{ textAlign:'center', padding:'8px' }}>
              <div style={{ fontSize:36, marginBottom:10 }} dangerouslySetInnerHTML={{ __html: s.icone || '' }} />
              <span style={{ display:'block', fontSize:38, fontWeight:400, color:'#C9973A', fontFamily:'Georgia, serif', lineHeight:1, marginBottom:8 }}>{s.num}</span>
              <span style={{ display:'block', fontSize:15, color:'#F0EBE0', fontFamily:'Arial, sans-serif', fontWeight:700, marginBottom:4 }}>{s.label}</span>
              <span style={{ display:'block', fontSize:13, color:'#6B9E7A', fontFamily:'Arial, sans-serif' }}>{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AVIS RAPIDES */}
      {siteContent?.temoignages_rapides && siteContent.temoignages_rapides.length > 0 && (
        <section className="section-mobile-pad" style={{ background:'var(--bg-page)', padding:'56px 24px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:20 }}>
              {siteContent.temoignages_rapides.map((avis, i) => (
                <div key={i} style={{ background:'var(--bg-card)', border:'0.5px solid var(--border-color)', borderRadius:12, padding:'20px 22px' }}>
                  <p style={{ fontSize:15, color:'var(--text-secondary)', fontFamily:'Georgia, serif', fontStyle:'italic', lineHeight:1.6, marginBottom:14 }}>
                    « {avis.texte} »
                  </p>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', fontFamily:'Arial, sans-serif' }}>
                    {avis.nom}{avis.ville ? <span style={{ color:'var(--text-muted)', fontWeight:400 }}> — {avis.ville}</span> : null}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
