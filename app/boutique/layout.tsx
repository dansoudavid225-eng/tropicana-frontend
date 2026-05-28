import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boutique — Commander le Thé Pio Pio | Tropicana Pio Pio',
  description: 'Commandez en ligne le Thé Pio Pio à base de verveine blanche citronnée. Boîte 30 sachets, 15 sachets ou vrac 100g. Livraison nationale au Bénin. Paiement Mobile Money.',
}

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
