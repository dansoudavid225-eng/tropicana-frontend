import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Nous écrire | Tropicana Pio Pio',
  description: 'Contactez l\'équipe Tropicana Pio Pio pour toute question sur nos produits, une commande ou un partenariat. Nous sommes disponibles du lundi au samedi, 8h–18h.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
