import type { Metadata } from 'next'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog — Tropicana Pio Pio',
  description: 'Articles sur les bienfaits des plantes médicinales africaines, conseils de santé naturelle et actualités de Tropicana Pio Pio.',
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
const artsFB = [
  { id:1, slug:'verveine-blanche-bienfaits', categorie:'Plantes médicinales', date_publication:'2025-04-10', titre:'Les 7 bienfaits prouvés de la verveine blanche citronnée', extrait:"Découvrez pourquoi la verveine blanche est au cœur de notre formule et comment elle agit sur votre corps au quotidien.", image:null, temps_lecture:'5 min' },
  { id:2, slug:'the-famille-enfants', categorie:'Famille & Santé', date_publication:'2025-03-22', titre:'Le Thé Pio Pio en famille : dès 2 ans, pour tous', extrait:'Pourquoi notre thé est recommandé pour toute la famille, des enfants dès 2 ans aux seniors.', image:null, temps_lecture:'3 min' },
  { id:3, slug:'distributeur-the-piopio', categorie:'Distribution', date_publication:'2025-02-15', titre:'Devenir distributeur Tropicana Pio Pio au Bénin', extrait:'Vous souhaitez vendre le Thé Pio Pio dans votre boutique ? Découvrez nos conditions de partenariat.', image:null, temps_lecture:'4 min' },
]

export default async function Blog() {
  try {
    const res = await fetch(`${API_BASE}/blog/`, { next: { revalidate: 300 } })
    const articles = res.ok ? (await res.json().then((d:any) => { const l = Array.isArray(d) ? d : d.results ?? []; return l.length > 0 ? l : artsFB })) : artsFB
    return <BlogClient articles={articles} />
  } catch { return <BlogClient articles={artsFB} /> }
}
