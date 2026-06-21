import Image from 'next/image'
import Link from 'next/link'

export default function ArticleDistributeur() {
  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <Image src="/images/produit-bois.jpg" alt="Distribuer le Thé Pio Pio" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,20,0.75)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            <span style={{ fontSize: 10, letterSpacing: '2.5px', color: '#C9973A', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>Business & Distribution · Avril 2026 · 3 min de lecture</span>
            <h1 style={{ fontSize: 30, fontWeight: 400, color: '#F0EBE0', marginTop: 10, lineHeight: 1.3 }}>
              Pourquoi distribuer le Thé Pio Pio ?<br /><em style={{ color: '#C9973A' }}>Une opportunité business à saisir au Bénin</em>
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section style={{ background: 'var(--bg-card-alt)', padding: '60px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontFamily: 'Arial, sans-serif', lineHeight: 1.9, marginBottom: 28 }}>
            Le marché du bien-être naturel est en pleine explosion en Afrique. Avec une population de plus en plus consciente de l'importance de la santé naturelle et des produits bio, le <strong>Thé Pio Pio représente une opportunité sérieuse</strong> pour tout revendeur, grossiste ou entrepreneur souhaitant s'engager dans ce secteur porteur.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 20, marginTop: 36 }}>Pourquoi le marché du bien-être naturel explose en Afrique ?</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'Arial, sans-serif', lineHeight: 1.9, marginBottom: 20 }}>
            Les consommateurs béninois et ouest-africains se tournent massivement vers les remèdes naturels et les plantes médicinales. La méfiance envers les produits chimiques et industriels grandit, pendant que la confiance envers le patrimoine naturel africain se renforce. Le Thé Pio Pio se positionne exactement à cette intersection.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 20, marginTop: 36 }}>Les avantages concrets pour un distributeur</h2>
          {[
            { icon: '💰', titre: 'Prix préférentiels dès 10 unités', texte: 'À partir de 10 boîtes commandées, vous bénéficiez de tarifs grossiste attractifs, vous permettant une marge commerciale intéressante à la revente.' },
            { icon: '📦', titre: 'Livraison nationale assurée', texte: 'Que vous soyez à Cotonou, Parakou, Natitingou ou ailleurs, notre logistique couvre tout le territoire béninois. Vous recevez votre stock rapidement.' },
            { icon: '🎯', titre: 'Un produit qui se vend tout seul', texte: '1 000 FCFA pour 12 sachets : le prix est accessible, le produit est efficace, et les clients reviennent. Le bouche-à-oreille est votre meilleur allié.' },
            { icon: '📋', titre: 'Support commercial inclus', texte: 'Nous vous fournissons les arguments de vente, les informations produit détaillées et un support de notre équipe pour vous aider à démarrer.' },
            { icon: '🌱', titre: 'Produit différenciant', texte: '100% bio, sans additifs, formulé par un vétérinaire spécialiste : un positionnement premium qui justifie le prix et fidélise la clientèle.' },
          ].map(item => (
            <div key={item.titre} style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif', marginBottom: 6 }}>{item.titre}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'Arial, sans-serif', lineHeight: 1.8 }}>{item.texte}</p>
              </div>
            </div>
          ))}

          <h2 style={{ fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 16, marginTop: 36 }}>Qui peut devenir distributeur ?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
            {['Commerçants et boutiques', 'Pharmacies et parapharmacies', 'Hôtels et restaurants', 'Salons de beauté et spas', 'Revendeurs ambulants', 'Entrepreneurs indépendants'].map(item => (
              <div key={item} style={{ background: 'var(--green-pale)', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 6, height: 6, background: '#2D6A4F', borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'Arial, sans-serif' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA contact */}
          <div style={{ background: '#1A3C2E', borderRadius: 12, padding: '32px 28px', textAlign: 'center' }}>
            <p style={{ fontSize: 18, color: '#F0EBE0', fontFamily: 'Georgia, serif', marginBottom: 8 }}>Prêt à rejoindre notre réseau ?</p>
            <p style={{ fontSize: 13, color: '#95D5B2', fontFamily: 'Arial, sans-serif', marginBottom: 24, fontWeight: 300, lineHeight: 1.7 }}>
              Contactez-nous dès aujourd'hui pour discuter des conditions de partenariat.<br />Notre équipe vous répond sous 24h.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-gold">Nous contacter</Link>
              <Link href="/boutique" className="btn-ghost">Voir les produits</Link>
            </div>
          </div>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
            <Link href="/blog" style={{ fontSize: 12, color: '#2D6A4F', fontFamily: 'Arial, sans-serif', textDecoration: 'none', fontWeight: 700 }}>← Retour au Blog</Link>
          </div>
        </div>
      </section>
    </>
  )
}
