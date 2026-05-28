import Image from 'next/image'
import Link from 'next/link'

export default function ArticleFamille() {
  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <Image src="/images/tasse-dessus.jpg" alt="Thé Pio Pio pour toute la famille" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,20,0.75)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            <span style={{ fontSize: 10, letterSpacing: '2.5px', color: '#C9973A', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>Famille & Bien-être · Avril 2026 · 4 min de lecture</span>
            <h1 style={{ fontSize: 30, fontWeight: 400, color: '#F0EBE0', marginTop: 10, lineHeight: 1.3 }}>
              Thé naturel pour toute la famille :<br /><em style={{ color: '#C9973A' }}>à partir de quel âge et comment ?</em>
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section style={{ background: '#FAFAF7', padding: '60px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          <p style={{ fontSize: 15, color: '#5A4A3A', fontFamily: 'Arial, sans-serif', lineHeight: 1.9, marginBottom: 28 }}>
            Le Thé Pio Pio est recommandé <strong>dès 2 ans</strong>. C'est l'une de ses grandes forces : toute la famille peut en profiter. Mais comment le préparer pour un enfant ? Quelles doses respecter ? On vous explique tout en détail.
          </p>

          <div style={{ background: '#EAF4EE', borderRadius: 10, padding: '20px 22px', marginBottom: 36, borderLeft: '4px solid #2D6A4F' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2D6A4F', fontFamily: 'Arial, sans-serif', marginBottom: 6 }}>✅ Pourquoi dès 2 ans ?</p>
            <p style={{ fontSize: 13, color: '#1A3C2E', fontFamily: 'Arial, sans-serif', lineHeight: 1.8 }}>
              La verveine blanche citronnée est une plante douce, sans caféine, sans tanins agressifs. Elle ne contient aucun additif, aucun conservateur. Son profil est assez doux pour être adapté aux jeunes enfants, contrairement au thé noir ou vert classique.
            </p>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 400, color: '#1A3C2E', marginBottom: 20, marginTop: 36 }}>Guide de préparation par tranche d'âge</h2>

          {[
            {
              age: 'Enfants de 2 à 6 ans',
              icon: '👶',
              prep: '1 sachet dans 1 litre d\'eau bouillie et refroidie',
              quand: 'À boire à volonté dans la journée, en petites quantités',
              note: 'Peut être légèrement sucré avec du miel (dès 1 an)',
            },
            {
              age: 'Enfants de 7 à 12 ans',
              icon: '🧒',
              prep: '1 sachet dans 75 cl d\'eau bouillie',
              quand: 'Matin et/ou soir, 1 tasse',
              note: 'Idéal pour favoriser la concentration et un bon sommeil avant l\'école',
            },
            {
              age: 'Adolescents et adultes',
              icon: '👩',
              prep: '1 sachet par tasse (250 ml) d\'eau bouillie, infuser 5 min',
              quand: 'De préférence le soir avant de dormir',
              note: 'Effet relaxant et purificateur optimal',
            },
            {
              age: 'Personnes âgées',
              icon: '👴',
              prep: '1 à 2 sachets par jour, matin et soir',
              quand: 'Avant les repas pour une meilleure digestion',
              note: 'Particulièrement bénéfique pour la circulation et les articulations',
            },
          ].map(item => (
            <div key={item.age} style={{ background: '#fff', border: '0.5px solid #D4C9B0', borderRadius: 10, padding: '20px 20px', marginBottom: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A3C2E', fontFamily: 'Arial, sans-serif', marginBottom: 10 }}>{item.age}</h3>
                <p style={{ fontSize: 12, color: '#5A4A3A', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 6 }}><strong>Préparation :</strong> {item.prep}</p>
                <p style={{ fontSize: 12, color: '#5A4A3A', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, marginBottom: 6 }}><strong>Quand :</strong> {item.quand}</p>
                <p style={{ fontSize: 12, color: '#2D6A4F', fontFamily: 'Arial, sans-serif', lineHeight: 1.7, fontStyle: 'italic' }}>💡 {item.note}</p>
              </div>
            </div>
          ))}

          <h2 style={{ fontSize: 22, fontWeight: 400, color: '#1A3C2E', marginBottom: 16, marginTop: 36 }}>Quelques précautions simples</h2>
          {[
            'Toujours utiliser de l\'eau propre bouillie et refroidie à température idéale (85-90°C).',
            'Ne pas donner de thé très chaud à un enfant — attendre qu\'il soit tiède.',
            'En cas d\'allergie connue aux plantes de la famille des verbenacées, consultez un médecin.',
            'Le Thé Pio Pio ne remplace pas un traitement médical prescrit.',
          ].map(p => (
            <div key={p} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, background: '#C9973A', borderRadius: '50%', marginTop: 7, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: '#5A4A3A', fontFamily: 'Arial, sans-serif', lineHeight: 1.8 }}>{p}</p>
            </div>
          ))}

          {/* CTA */}
          <div style={{ background: '#1A3C2E', borderRadius: 12, padding: '28px 24px', textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontSize: 16, color: '#F0EBE0', fontFamily: 'Georgia, serif', marginBottom: 8 }}>Un thé pour toute la famille</p>
            <p style={{ fontSize: 12, color: '#95D5B2', fontFamily: 'Arial, sans-serif', marginBottom: 20, fontWeight: 300 }}>12 sachets · 100% Bio · 1 000 FCFA · Livraison nationale au Bénin</p>
            <Link href="/boutique" className="btn-gold">Commander maintenant</Link>
          </div>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #D4C9B0' }}>
            <Link href="/blog" style={{ fontSize: 12, color: '#2D6A4F', fontFamily: 'Arial, sans-serif', textDecoration: 'none', fontWeight: 700 }}>← Retour au Blog</Link>
          </div>
        </div>
      </section>
    </>
  )
}
