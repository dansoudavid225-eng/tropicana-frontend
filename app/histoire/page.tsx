import type { Metadata } from 'next'
import HistoireClient from './HistoireClient'

export const metadata: Metadata = {
  title: 'Notre Histoire — Tropicana Pio Pio',
  description: "Découvrez l'histoire de Felicien Prosper Durand, vétérinaire diplômé de Cuba, et la naissance du Thé Pio Pio.",
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const chapsFB = [
  { id:1, numero:'01', titre:'Les laboratoires de Cuba', texte:"Vétérinaire de formation, diplômé de Cuba où il a achevé ses études dans le plus grand laboratoire de diagnostic du pays, le fondateur n'a jamais cessé d'observer et de comprendre le vivant. Une conviction profonde s'est forgée : une cellule saine est une cellule bien irriguée.", image:null },
  { id:2, numero:'02', titre:'Le retour au Bénin', texte:"De retour au Bénin, il tourne son regard vers les ressources naturelles de sa terre. Il redécouvre une plante ancestrale cultivée depuis des siècles dans les cours royales d'Égypte : la verveine blanche à odeur citronnée — le roi des thés.", image:null },
  { id:3, numero:'03', titre:'La naissance de Tropicana Pio Pio', texte:"Convaincu que ce trésor naturel méritait d'être partagé, il décide d'en faire une filière sérieuse. Il commence à cultiver la verveine blanche ainsi que d'autres plantes médicinales menacées de disparition.", image:null },
  { id:4, numero:'04', titre:'Notre ambition', texte:"Notre thé 100% bio, sans additifs, est produit à Porto-Novo. Notre ambition : rayonner à l'échelle nationale, sous-régionale et internationale.", image:null },
]
const missionsFB = [
  { id:1, icone:'', texte:'Produire un thé 100% bio, sans additifs, accessible à toute la famille' },
  { id:2, icone:'', texte:'Préserver les plantes médicinales africaines menacées de disparition' },
  { id:3, icone:'', texte:'Faire du Thé Pio Pio un ambassadeur du bien-être africain dans le monde' },
  { id:4, icone:'', texte:"Rayonner à l'échelle nationale, sous-régionale et internationale" },
]
const fondateurFB = {
  citation: "Le plus grand laboratoire, c'est notre propre corps. Notre mission est de lui donner ce dont il a besoin pour fonctionner parfaitement.",
  nom: 'Felicien Prosper DURAND', role: 'Fondateur · Vétérinaire diplômé\nSpécialiste en biologie cellulaire, Cuba', photo: null,
}

async function get<T>(path: string, fb: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 300 } })
    if (!res.ok) return fb
    const d = await res.json()
    if (Array.isArray(fb)) { const l = Array.isArray(d) ? d : d.results ?? []; return (l.length > 0 ? l : fb) as T }
    return d ?? fb
  } catch { return fb }
}

export default async function Histoire() {
  const [chapitres, missions, fondateur] = await Promise.all([
    get('/histoire/', chapsFB), get('/missions/', missionsFB), get('/fondateur/', fondateurFB)
  ])
  return <HistoireClient chapitres={chapitres as any} missions={missions as any} fondateur={fondateur as any} />
}
