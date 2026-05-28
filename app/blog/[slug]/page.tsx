import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/blog/${slug}/`, { next: { revalidate: 300 } })
    if (res.status === 404) return null
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Article — Tropicana Pio Pio' }
  return { title: `${article.titre} — Tropicana Pio Pio`, description: article.extrait }
}

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) }
  catch { return d }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  return (
    <>
      <section style={{ position: 'relative', height: 360, overflow: 'hidden' }}>
        {article.image ? (
          <Image src={article.image} alt={article.titre} fill style={{ objectFit: 'cover' }} unoptimized />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1A3C2E, #0D2318)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>🌿</div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,20,0.72)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 40 }}>
          <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <span style={{ background: 'rgba(201,151,58,0.9)', color: '#1A3C2E', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 10 }}>{article.categorie}</span>
              <span style={{ color: 'rgba(240,235,224,0.6)', fontSize: 13, fontFamily: 'Arial, sans-serif' }}>{formatDate(article.date_publication)} · {article.temps_lecture}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 400, color: '#F0EBE0', margin: 0, lineHeight: 1.2 }}>{article.titre}</h1>
          </div>
        </div>
      </section>

      <section style={{ background: '#FAFAF7', padding: '60px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 18, color: '#3A2D1E', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.8, marginBottom: 36, borderLeft: '3px solid #C9973A', paddingLeft: 20 }}>
            {article.extrait}
          </p>
          <div style={{ fontSize: 15, color: '#5A4A3A', fontFamily: 'Arial, sans-serif', lineHeight: 1.9 }}>
            {article.contenu.split('\n\n').map((para: string, i: number) => (
              <p key={i} style={{ marginBottom: 20 }}>{para.replace(/\*\*/g, '')}</p>
            ))}
          </div>
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #E2DAC8', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/blog" style={{ fontSize: 14, color: '#2D6A4F', fontFamily: 'Arial, sans-serif', fontWeight: 700, textDecoration: 'none' }}>← Retour au blog</Link>
            <Link href="/boutique" className="btn-gold" style={{ fontSize: 14, padding: '10px 22px' }}>Commander le Thé Pio Pio →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
