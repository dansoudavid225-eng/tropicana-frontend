import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description: "Conditions générales de vente de Tropicana Pio Pio — Porto-Novo, Bénin.",
}

const sections = [
  {
    title: '1. Objet',
    content: "Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Tropicana Pio Pio, entreprise individuelle sise à Oganla Gare Nord, Porto-Novo, République du Bénin, et tout client passant commande via le site tropicanapiopio.com ou par téléphone."
  },
  {
    title: '2. Produits',
    content: "Les produits Tropicana Pio Pio sont des infusions à base de plantes naturelles 100% biologiques, cultivées et transformées au Bénin. Les descriptions et photographies sont fournies à titre indicatif et peuvent évoluer sans préavis."
  },
  {
    title: '3. Prix',
    content: "Les prix sont indiqués en Francs CFA (FCFA) toutes taxes comprises. Tropicana Pio Pio se réserve le droit de modifier ses prix à tout moment. Les commandes sont facturées au tarif en vigueur au moment de la validation."
  },
  {
    title: '4. Commande',
    content: "Toute commande passée sur le site ou par téléphone vaut acceptation des présentes CGV. Une confirmation par SMS ou email est envoyée à la validation de la commande. La commande est ferme et définitive après réception du paiement."
  },
  {
    title: '5. Paiement',
    content: "Le règlement s'effectue par Mobile Money (MTN Money, Moov Money, Wave, Orange Money). Le paiement est exigé à la commande ou à la livraison selon l'accord convenu avec le client."
  },
  {
    title: '6. Livraison',
    content: "La livraison est effectuée partout en République du Bénin dans un délai de 24 à 72 heures ouvrables après confirmation de la commande. Les frais de livraison sont offerts à partir de 5 000 FCFA d'achat."
  },
  {
    title: '7. Retours & Remboursements',
    content: "En cas de produit défectueux ou non conforme, le client dispose de 48 heures à compter de la réception pour nous contacter. Après vérification, un remboursement ou remplacement sera effectué dans les meilleurs délais."
  },
  {
    title: '8. Données personnelles',
    content: "Les informations collectées lors d'une commande sont utilisées uniquement pour son traitement et sa livraison. Elles ne sont jamais transmises à des tiers. Consultez notre Politique de Confidentialité pour plus d'informations."
  },
]

export default function CGVPage() {
  return (
    <main style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1A3C2E, #0D2318)', padding: '60px 24px 48px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link href="/" style={{ fontSize: 13, color: '#6B9E7A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            Retour à l'accueil
          </Link>
          <span style={{ fontSize: 11, letterSpacing: '3px', color: '#C9973A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Légal</span>
          <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 300, color: '#F0EBE0', fontFamily: 'var(--font-cormorant), Georgia, serif', letterSpacing: '-0.5px' }}>
            Conditions Générales de Vente
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(107,158,122,0.7)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', marginTop: 12 }}>
            Dernière mise à jour : mai 2026 · Tropicana Pio Pio, Porto-Novo, Bénin
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        {sections.map(s => (
          <div key={s.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A3C2E', fontFamily: 'var(--font-cormorant), Georgia, serif', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 15, color: '#5A4A3A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', lineHeight: 1.85 }}>{s.content}</p>
          </div>
        ))}
        <div style={{ marginTop: 40, padding: '20px 24px', background: '#EAF4EE', border: '1px solid #B7D9C4', borderRadius: 12 }}>
          <p style={{ fontSize: 14, color: '#1A3C2E', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', lineHeight: 1.7 }}>
            Pour toute question relative à ces CGV, contactez-nous au <strong>+229 01 95 96 77 62</strong> ou à <strong>tropicanapiopio.officiel@gmail.com</strong>.
          </p>
        </div>
      </div>
    </main>
  )
}
