'use client'
import { useLang } from '@/context/LanguageContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSiteConfig } from '@/lib/useSiteConfig'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const faqFallback: FAQItem[] = [
  { id:1, question:"Qu'est-ce que le Thé Pio Pio ?", reponse:"Le Thé Pio Pio est une infusion 100% naturelle à base de verveine blanche citronnée, cultivée au Bénin sans engrais ni herbicide. Formulé par un vétérinaire spécialisé en biologie cellulaire.", categorie:"Produit" },
  { id:2, question:"Le thé est-il adapté aux enfants ?", reponse:"Oui, le Thé Pio Pio est recommandé à partir de 2 ans. Il est sans additifs, sans colorants et 100% naturel. Idéal pour toute la famille.", categorie:"Santé" },
  { id:3, question:"Quels sont les principaux bienfaits ?", reponse:"Circulation sanguine, sommeil profond, articulations soulagées, digestion douce, anti-stress et purification de l'organisme. Ses vertus sont reconnues depuis des siècles.", categorie:"Santé" },
  { id:4, question:"Comment passer une commande ?", reponse:"Rendez-vous sur notre page Boutique ou contactez-nous par WhatsApp au +229 01 95 96 77 62. Livraison partout au Bénin sous 24h à 48h.", categorie:"Commande" },
  { id:5, question:"Quels modes de paiement acceptez-vous ?", reponse:"Paiement à la livraison, Mobile Money (MTN MoMo, Moov Money) et virements bancaires pour les grossistes.", categorie:"Paiement" },
  { id:6, question:"Livrez-vous partout au Bénin ?", reponse:"Oui, nous livrons dans toutes les villes du Bénin — Cotonou, Porto-Novo, Parakou, Abomey-Calavi et bien d'autres — sous 24h à 48h.", categorie:"Livraison" },
  { id:7, question:"Comment devenir distributeur ?", reponse:"Contactez-nous via le formulaire ou par WhatsApp. Prix préférentiels à partir de 10 unités, support commercial inclus.", categorie:"Général" },
]
const faqFallbackEN: FAQItem[] = [
  { id:1, question:"What is Thé Pio Pio?", reponse:"Thé Pio Pio is a 100% natural infusion made from white lemon verbena, grown in Benin without fertilizers or herbicides. Formulated by a veterinarian specialized in cell biology.", categorie:"Product" },
  { id:2, question:"Is the tea suitable for children?", reponse:"Yes, Thé Pio Pio is recommended from age 2. It is additive-free, colorant-free and 100% natural. Ideal for the whole family.", categorie:"Health" },
  { id:3, question:"What are the main benefits?", reponse:"Blood circulation, deep sleep, joint relief, gentle digestion, anti-stress and body detox. Its virtues have been recognized for centuries.", categorie:"Health" },
  { id:4, question:"How do I place an order?", reponse:"Visit our Shop page or contact us via WhatsApp at +229 01 95 96 77 62. We deliver across Benin within 24h to 48h.", categorie:"Order" },
  { id:5, question:"What payment methods do you accept?", reponse:"Cash on delivery, Mobile Money (MTN MoMo, Moov Money) and bank transfers for wholesalers.", categorie:"Payment" },
  { id:6, question:"Do you deliver across Benin?", reponse:"Yes, we deliver to all cities in Benin — Cotonou, Porto-Novo, Parakou, Abomey-Calavi and more — within 24h to 48h.", categorie:"Delivery" },
  { id:7, question:"How do I become a distributor?", reponse:"Contact us via the form or WhatsApp. Preferential pricing from 10 units, commercial support included.", categorie:"General" },
]

type FAQItem = { id: number; question: string; reponse: string; categorie: string }

const catIcons: Record<string, string> = {
  'Général': '💬', 'Produit': '🌿', 'Santé': '❤️',
  'Livraison': '📦', 'Paiement': '💳', 'Commande': '🛒',
}

export default function FAQPage() {
  const site = useSiteConfig()
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const [cat, setCat] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const { lang, t } = useLang()

  useEffect(() => {
    fetch(`${API_BASE}/faq/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const liste = Array.isArray(d) ? d : d.results ?? []
        setFaqs(liste.length > 0 ? liste : (lang === 'en' ? faqFallbackEN : faqFallback))
      })
      .catch(() => setFaqs(lang === 'en' ? faqFallbackEN : faqFallback))
      .finally(() => setLoading(false))
  }, [lang])

  const cats = ['Tous', ...Array.from(new Set(faqs.map(f => f.categorie))).filter(Boolean)]
  const filtered = cat === 'Tous' ? faqs : faqs.filter(f => f.categorie === cat)
  const whatsappUrl = `https://wa.me/${site.telephone_raw}?text=${encodeURIComponent('Bonjour, j\'ai une question sur le Thé Pio Pio.')}`

  return (
    <>
      {/* Hero */}
      <section style={{ background:'linear-gradient(160deg, #0D2318 0%, #1A3C2E 100%)', padding:'80px 24px 70px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, left:-60, width:240, height:240, borderRadius:'50%', border:'1px solid rgba(201,151,58,0.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, right:-40, width:180, height:180, borderRadius:'50%', border:'1px solid rgba(201,151,58,0.06)', pointerEvents:'none' }} />
        <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <span className="badge-gold" style={{ marginBottom:20, display:'inline-block' }}>Questions fréquentes</span>
          <h1 style={{ fontSize:'clamp(30px,4.5vw,48px)', fontWeight:400, color:'#F0EBE0', lineHeight:1.15, margin:'0 0 16px' }}>
            Tout ce que vous voulez{' '}
            <em style={{ color:'#C9973A', fontStyle:'italic' }}>savoir</em>
          </h1>
          <p style={{ fontSize:16, color:'rgba(168,213,184,0.85)', fontFamily:'Arial, sans-serif', lineHeight:1.75, maxWidth:480, margin:'0 auto' }}>
            {faqs.length > 0 ? `${faqs.length} ${t('faq.questionsRepondues')}` : t('faq.toutesQuestions')}
          </p>
        </div>
      </section>

      <section style={{ background:'var(--bg-card-alt)', padding:'60px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>

          {/* Filtres catégories */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:40, justifyContent:'center' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding:'9px 20px', borderRadius:50, border:'1.5px solid', cursor:'pointer',
                fontSize:13, fontWeight:700, fontFamily:'Arial, sans-serif', transition:'all .2s',
                background: cat === c ? '#1A3C2E' : 'var(--bg-card)',
                color: cat === c ? '#F0EBE0' : 'var(--text-primary)',
                borderColor: cat === c ? '#1A3C2E' : 'var(--border-color)',
                boxShadow: cat === c ? '0 4px 14px rgba(26,60,46,0.2)' : 'none',
              }}>
                {catIcons[c] ?? ''} {c}
              </button>
            ))}
          </div>

          {/* Liste FAQ */}
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton" style={{ height:64, borderRadius:14 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', color:'var(--text-muted)', padding:60, fontSize:15, fontFamily:'Arial, sans-serif' }}>
              Aucune question dans cette catégorie.
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {filtered.map((faq, i) => (
                <div
                  key={faq.id}
                  style={{
                    background:'var(--bg-card)',
                    borderRadius:16,
                    border:`1.5px solid ${open === faq.id ? '#2D6A4F' : 'var(--border-light)'}`,
                    overflow:'hidden',
                    transition:'border-color .25s, box-shadow .25s',
                    boxShadow: open === faq.id ? '0 8px 24px rgba(45,106,79,0.12)' : 'none',
                    animationDelay: `${i * 40}ms`,
                  }}
                  className="animate-fade-up"
                >
                  <button
                    onClick={() => setOpen(open === faq.id ? null : faq.id)}
                    style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', background:'none', border:'none', cursor:'pointer', textAlign:'left', gap:16 }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:12, flex:1 }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{catIcons[faq.categorie] ?? '💬'}</span>
                      <span style={{ fontSize:15, fontWeight:600, color:'var(--text-primary)', fontFamily:'Arial, sans-serif', lineHeight:1.4 }}>{faq.question}</span>
                    </div>
                    <div style={{
                      width:28, height:28, borderRadius:'50%', background: open === faq.id ? '#1A3C2E' : 'var(--green-pale)',
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                      fontSize:18, color: open === faq.id ? '#fff' : 'var(--text-primary)',
                      transition:'all .3s', transform: open === faq.id ? 'rotate(45deg)' : 'none',
                    }}>+</div>
                  </button>
                  {open === faq.id && (
                    <div style={{ padding:'0 22px 22px 22px', borderTop:'1px solid #F0EBE0' }}>
                      <div style={{ marginTop:16, paddingLeft:16, borderLeft:'3px solid #C9973A' }}>
                        <p style={{ fontSize:14, color:'var(--text-secondary)', fontFamily:'Arial, sans-serif', lineHeight:1.85 }}>{faq.reponse}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA contact */}
          <div style={{ marginTop:52, background:'linear-gradient(135deg, #1A3C2E, #0D2318)', borderRadius:24, padding:'40px 32px', display:'flex', flexWrap:'wrap', gap:24, alignItems:'center', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', border:'1px solid rgba(201,151,58,0.1)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <h3 style={{ fontSize:20, fontWeight:400, color:'#F0EBE0', margin:'0 0 8px' }}>Vous n&apos;avez pas trouvé votre réponse ?</h3>
              <p style={{ fontSize:14, color:'rgba(168,213,184,0.8)', fontFamily:'Arial, sans-serif', margin:0 }}>Notre équipe répond sous 2h sur WhatsApp.</p>
            </div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', position:'relative', zIndex:1 }}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize:14, padding:'12px 22px', textDecoration:'none' }}>
                WhatsApp
              </a>
              <Link href="/contact" className="btn-ghost" style={{ fontSize:14, padding:'12px 22px', color:'#fff', borderColor:'rgba(255,255,255,0.3)' }}>
                📧 Formulaire
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
