import Image from 'next/image'
import Link from 'next/link'

export default function ArticleVerveine() {
  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <Image src="/images/plante-verveine.jpg" alt="Verveine blanche citronnée" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,20,0.75)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            <span style={{ fontSize: 10, letterSpacing: '2.5px', color: '#C9973A', fontFamily: 'Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>Santé naturelle · Avril 2026 · 3 min de lecture</span>
            <h1 style={{ fontSize: 30, fontWeight: 400, color: '#F0EBE0', marginTop: 10, lineHeight: 1.3 }}>
              Qu'est-ce que la verveine blanche ?<br /><em style={{ color: '#C9973A' }}>La plante qui révolutionne votre bien-être</em>
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section style={{ background: '#FAFAF7', padding: '60px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          <p style={{ fontSize: 15, color: '#5A4A3A', fontFamily: 'Arial, sans-serif', lineHeight: 1.9, marginBottom: 28, fontWeight: 400 }}>
            Vous avez entendu parler de la verveine, mais savez-vous vraiment ce que la <strong>verveine blanche citronnée</strong> peut faire pour votre corps ? Cultivée depuis des siècles dans les cours royales d'Égypte, cette plante ancestrale est au cœur de notre Thé Pio Pio. Voici pourquoi elle mérite toute votre attention.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 400, color: '#1A3C2E', marginBottom: 16, marginTop: 36 }}>Une plante ancestrale aux vertus prouvées</h2>
          <p style={{ fontSize: 14, color: '#5A4A3A', fontFamily: 'Arial, sans-serif', lineHeight: 1.9, marginBottom: 20 }}>
            La verveine blanche à odeur citronnée — aussi appelée <em>roi des thés</em> — est connue depuis l'Antiquité pour ses propriétés relaxantes et thérapeutiques. Contrairement aux thés industriels, la nôtre pousse naturellement sur les terres béninoises, <strong>sans aucun engrais ni herbicide</strong>.
          </p>

          <div style={{ background: '#EAF4EE', borderRadius: 10, padding: '20px 22px', marginBottom: 28, borderLeft: '4px solid #2D6A4F' }}>
            <p style={{ fontSize: 13, color: '#1A3C2E', fontFamily: 'Arial, sans-serif', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
              "Une cellule saine est une cellule bien irriguée. Tant que le sang circule librement, les organes fonctionnent, l'énergie abonde, et la maladie s'éloigne."
            </p>
            <p style={{ fontSize: 11, color: '#C9973A', fontFamily: 'Arial, sans-serif', marginTop: 10, fontWeight: 700 }}>— Felicien Prosper DURAND, Fondateur & Vétérinaire</p>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 400, color: '#1A3C2E', marginBottom: 16, marginTop: 36 }}>6 bienfaits clés de la verveine blanche</h2>

          {[
            { titre: '1. Circulation sanguine optimisée', texte: 'La verveine blanche favorise la dilatation des vaisseaux sanguins, permettant une meilleure irrigation des organes et des cellules. Le résultat : plus d\'énergie, moins de fatigue chronique.' },
            { titre: '2. Sommeil profond et réparateur', texte: 'Consommée le soir, elle facilite l\'endormissement et améliore la qualité du sommeil. Beaucoup de nos clients constatent une différence dès la première semaine.' },
            { titre: '3. Soulagement des articulations', texte: 'Ses propriétés anti-inflammatoires naturelles aident à réduire les douleurs articulaires, notamment utile pour les personnes âgées ou actives.' },
            { titre: '4. Digestion apaisée', texte: 'Elle stimule le transit intestinal et soulage les ballonnements et inconforts digestifs — idéale après un repas lourd.' },
            { titre: '5. Effet anti-stress naturel', texte: 'Sa saveur délicate, fraîche et citronnée a un effet apaisant immédiat sur le système nerveux. Un moment de calme dans une journée chargée.' },
            { titre: '6. Purification de l\'organisme', texte: 'Elle aide le foie et les reins à éliminer les toxines accumulées, contribuant à une détoxification douce et progressive.' },
          ].map(item => (
            <div key={item.titre} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A3C2E', fontFamily: 'Arial, sans-serif', marginBottom: 8 }}>{item.titre}</h3>
              <p style={{ fontSize: 13, color: '#5A4A3A', fontFamily: 'Arial, sans-serif', lineHeight: 1.8 }}>{item.texte}</p>
            </div>
          ))}

          <h2 style={{ fontSize: 22, fontWeight: 400, color: '#1A3C2E', marginBottom: 16, marginTop: 36 }}>Comment la consommer ?</h2>
          <div style={{ background: '#fff', border: '0.5px solid #D4C9B0', borderRadius: 10, padding: '20px 22px', marginBottom: 32 }}>
            {[
              { qui: 'Adultes', comment: '1 sachet dans une tasse d\'eau bouillie, de préférence le soir avant de dormir.' },
              { qui: 'Enfants dès 2 ans', comment: '1 sachet dans 1 litre d\'eau bouillie, à boire à volonté dans la journée.' },
              { qui: 'Personnes âgées', comment: '1 à 2 sachets par jour, matin et soir, pour un effet renforcé.' },
            ].map(item => (
              <div key={item.qui} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, background: '#C9973A', borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#1A3C2E', fontFamily: 'Arial, sans-serif' }}>{item.qui} : </span>
                  <span style={{ fontSize: 13, color: '#5A4A3A', fontFamily: 'Arial, sans-serif' }}>{item.comment}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: '#1A3C2E', borderRadius: 12, padding: '28px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: '#F0EBE0', fontFamily: 'Georgia, serif', marginBottom: 8 }}>Prêt à découvrir la verveine blanche ?</p>
            <p style={{ fontSize: 12, color: '#95D5B2', fontFamily: 'Arial, sans-serif', marginBottom: 20, fontWeight: 300 }}>12 sachets · 100% Bio · 1 000 FCFA · Livraison nationale au Bénin</p>
            <Link href="/boutique" className="btn-gold">Commander le Thé Pio Pio</Link>
          </div>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #D4C9B0' }}>
            <Link href="/blog" style={{ fontSize: 12, color: '#2D6A4F', fontFamily: 'Arial, sans-serif', textDecoration: 'none', fontWeight: 700 }}>← Retour au Blog</Link>
          </div>
        </div>
      </section>
    </>
  )
}
