import HeroSlider from '@/components/HeroSlider'
import HomePageClient from './HomePageClient'
import { getSiteContent } from '@/lib/siteContent'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const bienfaitsFallback = [
  { id:0, icone:'❤️', titre:'Circulation sanguine', description:'Nourrit les cellules, libère les artères naturellement' },
  { id:1, icone:'😴', titre:'Sommeil profond', description:'Endormissement rapide et repos vraiment réparateur' },
  { id:2, icone:'🦴', titre:'Articulations', description:'Réduit les inflammations et soulage les douleurs' },
  { id:3, icone:'🌿', titre:'Digestion douce', description:'Stimule le transit, apaise les ballonnements' },
  { id:4, icone:'🧘', titre:'Anti-stress', description:'Effet relaxant naturel dès la première tasse' },
  { id:5, icone:'✨', titre:'Purification', description:"Nettoie et détoxifie l'organisme en profondeur" },
]
const testimonialsDefaut = [
  { nom:'Agnès M.', ville:'Cotonou', texte:'Depuis que je bois le Thé Pio Pio chaque soir, je dors beaucoup mieux. Je le recommande à toute ma famille.', note:5 },
  { nom:'Kofi D.', ville:'Porto-Novo', texte:'Mes douleurs aux articulations ont vraiment diminué après 3 semaines. Produit naturel et vraiment efficace.', note:5 },
  { nom:'Rachel B.', ville:'Parakou', texte:"Je l'ai commandé pour ma mère âgée. Elle dit que son énergie est revenue. Merci Tropicana Pio Pio !", note:5 },
]

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 300 } })
    if (!res.ok) return fallback
    const data = await res.json()
    if (Array.isArray(fallback)) {
      const liste = Array.isArray(data) ? data : data.results ?? data.resultats ?? []
      return (liste.length > 0 ? liste : fallback) as T
    }
    return data ?? fallback
  } catch { return fallback }
}

export default async function Home() {
  const [testimonials, bienfaits, configAccueil, configSite, siteContent] = await Promise.all([
    get('/temoignages/', testimonialsDefaut),
    get('/bienfaits/', bienfaitsFallback),
    get('/config-accueil/', null),
    get('/config-site/', null),
    getSiteContent(),
  ])
  return (
    <>
      <HeroSlider heroSousTitre={siteContent.hero_sous_titre} heroSousTitreEm={siteContent.hero_sous_titre_em} />
      <HomePageClient
        bienfaits={bienfaits as any}
        testimonials={testimonials as any}
        configAccueil={configAccueil as any}
        configSite={configSite as any}
      />
    </>
  )
}
