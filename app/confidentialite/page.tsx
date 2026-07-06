import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: "Politique de confidentialité et protection des données personnelles — Tropicana Pio Pio.",
}

const sections = [
  {
    title: '1. Responsable du traitement',
    content: "Tropicana Pio Pio, représentée par Felicien Prosper DURAND, sise à Oganla Gare Nord, Porto-Novo, République du Bénin. Contact : tropicanapiopio.officiel@gmail.com."
  },
  {
    title: '2. Données collectées',
    content: "Lors d'une commande, nous collectons : nom et prénom, adresse email, numéro de téléphone, adresse de livraison. Ces données sont strictement nécessaires au traitement de votre commande."
  },
  {
    title: '3. Utilisation des données',
    content: "Vos données sont utilisées exclusivement pour le traitement et le suivi de vos commandes, l'envoi de confirmations par SMS/email, et si vous y avez consenti, l'envoi de notre newsletter. Elles ne sont jamais vendues ni transmises à des tiers."
  },
  {
    title: '4. Conservation',
    content: "Vos données de commande sont conservées 3 ans à compter de la dernière transaction, conformément aux obligations légales en vigueur au Bénin. Les données de newsletter sont conservées jusqu'à votre désinscription."
  },
  {
    title: '5. Vos droits',
    content: "Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous par email ou téléphone. Nous répondons sous 72 heures ouvrables."
  },
  {
    title: '6. Cookies',
    content: "Notre site utilise des cookies techniques essentiels au bon fonctionnement (authentification, panier). Aucun cookie publicitaire ou de traçage tiers n'est utilisé."
  },
  {
    title: '7. Sécurité',
    content: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement HTTPS, tokens JWT à durée limitée, accès restreint aux données."
  },
]

export default function ConfidentialitePage() {
  return (
    <main style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A3C2E, #0D2318)', padding: '60px 24px 48px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link href="/" style={{ fontSize: 13, color: '#6B9E7A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            Retour à l'accueil
          </Link>
          <span style={{ fontSize: 11, letterSpacing: '3px', color: '#C9973A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Légal</span>
          <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 300, color: '#F0EBE0', fontFamily: 'var(--font-cormorant), Georgia, serif', letterSpacing: '-0.5px' }}>
            Politique de Confidentialité
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(107,158,122,0.7)', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', marginTop: 12 }}>
            Dernière mise à jour : mai 2026 · Tropicana Pio Pio, Porto-Novo, Bénin
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        {sections.map(s => (
          <div key={s.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A3C2E', fontFamily: 'var(--font-cormorant), Georgia, serif', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 15, color: '#5A4A3A', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', lineHeight: 1.85 }}>{s.content}</p>
          </div>
        ))}
        <div style={{ marginTop: 40, padding: '20px 24px', background: '#EAF4EE', border: '1px solid #B7D9C4', borderRadius: 12 }}>
          <p style={{ fontSize: 14, color: '#1A3C2E', fontFamily: 'var(--font-dm-sans), Arial, sans-serif', lineHeight: 1.7 }}>
            Questions sur vos données ? Écrivez-nous à <strong>tropicanapiopio.officiel@gmail.com</strong>.
          </p>
        </div>
      </div>
    </main>
  )
}
