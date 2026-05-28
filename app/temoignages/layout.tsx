import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avis Clients — Témoignages | Tropicana Pio Pio',
  description: 'Découvrez les témoignages de nos clients satisfaits. Partagez votre expérience avec le Thé Pio Pio à base de verveine blanche citronnée, 100% bio, Porto-Novo, Bénin.',
}

export default function TemoignagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
