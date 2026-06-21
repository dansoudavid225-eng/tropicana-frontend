// ─── lib/siteContent.ts ───────────────────────────────────────────────────────
// Source unique de vérité pour tout le contenu du site.
// Les valeurs par défaut sont le contenu actuel codé en dur.
// En production, ces valeurs sont écrasées par le JSON de /api/content-site/
// (lui-même alimenté par /api/admin/config/, géré dans le panneau admin)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export type Bienfait   = { id: string; icon: string; title: string; desc: string }
export type HistoireSection = { num: string; title: string; text: string }
export type BlogArticle = {
  slug: string; cat: string; date: string; title: string
  excerpt: string; img: string; read: string; contenu?: string
}
export type Partenaire = { id: string; nom: string; logo: string; lien: string; tag: string }
export type StatItem   = { num: string; label: string; icon: string; desc: string }
export type TemoignageRapide = { texte: string; nom: string; ville: string }
export type Argument   = { icon: string; title: string; sub: string }

export type SiteContent = {
  // Hero
  hero_badge:       string
  hero_titre:       string
  hero_titre_em:    string
  hero_sous_titre:  string
  hero_sous_titre_em: string
  hero_btn1:        string
  hero_btn2:        string

  // Strip 4 arguments
  arguments: Argument[]

  // Section plante
  plante_label:     string
  plante_titre:     string
  plante_titre_em:  string
  plante_texte:     string
  plante_points:    string[]

  // Bienfaits
  bienfaits_label:  string
  bienfaits_titre:  string
  bienfaits:        Bienfait[]

  // Tasse immersive
  tasse_label:      string
  tasse_citation:   string
  tasse_citation_em: string
  tasse_btn:        string

  // Fondateur (accueil)
  fondateur_label:  string
  fondateur_titre:  string
  fondateur_citation: string
  fondateur_nom:    string
  fondateur_sous:   string
  fondateur_btn:    string

  // Stats
  stats_bandeau:    string
  stats:            StatItem[]
  temoignages_rapides: TemoignageRapide[]

  // Localisation
  loc_titre:        string
  loc_titre_em:     string
  loc_sous_titre:   string

  // Histoire page
  histoire_hero_label:   string
  histoire_hero_titre:   string
  histoire_hero_titre_em: string
  histoire_sections:     HistoireSection[]
  histoire_citation:     string
  histoire_fondateur_nom: string
  histoire_fondateur_sous: string
  histoire_missions:     { icon: string; text: string }[]

  // Blog
  blog_articles: BlogArticle[]

  // Partenaires
  partenaires: Partenaire[]

  // AnnouncementBar
  annonces: string[]

  // Footer
  footer_slogan:    string
  footer_cta_pre:   string
  footer_cta_titre: string
  footer_cta_btn:   string
  footer_adresse:   string
  footer_horaires:  string
  footer_copyright: string

  // Contact
  contact_intro: string

  // Couleurs (pour référence)
  couleur_vert:    string
  couleur_or:      string
  couleur_creme:   string
  couleur_fonce:   string
}

// ─── Contenu par défaut (= contenu actuel du site) ───────────────────────────
export const defaultContent: SiteContent = {
  // Hero
  hero_badge:       '🌿 100% Bio · Porto-Novo, Bénin',
  hero_titre:       'La nature africaine',
  hero_titre_em:    'dans votre tasse',
  hero_sous_titre:  'Apaise ton stress, naturellement ',
  hero_sous_titre_em: '| Mį sȩ sīn Bōwā sīn',
  hero_btn1:        'Commander dès 1 000 FCFA',
  hero_btn2:        'Notre histoire',

  // 4 arguments
  arguments: [
    { icon: '🌱', title: '100 % Bio',           sub: 'Sans engrais ni herbicides' },
    { icon: '🔬', title: 'Fondé sur la science', sub: 'Formulé par un vétérinaire' },
    { icon: '👨‍👩‍👧', title: 'Toute la famille',    sub: 'Recommandé dès 2 ans' },
    { icon: '🇧🇯', title: 'Made in Bénin',       sub: 'Livraison nationale' },
  ],

  // Plante
  plante_label:    'Notre ingrédient phare',
  plante_titre:    'La verveine blanche',
  plante_titre_em: 'citronnée',
  plante_texte:    'Cultivée depuis des siècles dans les cours royales d\'Égypte, cette plante ancestrale pousse naturellement sur nos terres béninoises sans aucun engrais ni herbicide. Sa saveur délicate, fraîche et citronnée cache des vertus thérapeutiques exceptionnelles.',
  plante_points: [
    'Connue pour ses vertus relaxantes profondes',
    'Nettoyante naturelle des artères',
    'Riche en vitamine K, essentielle à l\'équilibre interne',
    'Favorise un sommeil profond et récupérateur',
  ],

  // Bienfaits
  bienfaits_label: 'Bienfaits prouvés',
  bienfaits_titre: 'Ce que notre thé fait pour vous',
  bienfaits: [
    { id: '1', icon: '❤️', title: 'Circulation sanguine', desc: 'Nourrit les cellules, libère les artères naturellement' },
    { id: '2', icon: '😴', title: 'Sommeil profond',      desc: 'Endormissement rapide et repos vraiment réparateur' },
    { id: '3', icon: '🦴', title: 'Articulations',        desc: 'Réduit les inflammations et soulage les douleurs' },
    { id: '4', icon: '🌿', title: 'Digestion douce',      desc: 'Stimule le transit, apaise les ballonnements' },
    { id: '5', icon: '🧘', title: 'Anti-stress',          desc: 'Effet relaxant naturel dès la première tasse' },
    { id: '6', icon: '✨', title: 'Purification',         desc: 'Nettoie et détoxifie l\'organisme en profondeur' },
  ],

  // Tasse
  tasse_label:       'Un moment rien que pour vous',
  tasse_citation:    '"Redécouvrez le plaisir d\'un',
  tasse_citation_em: 'moment de calme"',
  tasse_btn:         'Commander maintenant',

  // Fondateur accueil
  fondateur_label:    'Notre fondateur',
  fondateur_titre:    'De la science à la nature',
  fondateur_citation: '"Le plus grand laboratoire, c\'est notre propre corps. Notre mission est de lui donner ce dont il a besoin pour fonctionner parfaitement."',
  fondateur_nom:      'Felicien Prosper DURAND',
  fondateur_sous:     'Fondateur · Vétérinaire diplômé · Spécialiste en biologie cellulaire, Cuba',
  fondateur_btn:      'Lire notre histoire',

  // Stats
  stats_bandeau: '🌿 Cultivé à Porto-Novo · Formulé par un vétérinaire · Livraison nationale au Bénin',
  stats: [
    { num: '500+',    label: 'Familles béninoises satisfaites', icon: '👨‍👩‍👧‍👦', desc: 'Partout au Bénin' },
    { num: '100%',    label: 'Bio, zéro additif',               icon: '🌱',      desc: 'Sans engrais ni herbicide' },
    { num: 'Dès 2 ans', label: 'Pour toute la famille',         icon: '👶',      desc: 'Enfants, adultes, seniors' },
    { num: '24h',     label: 'Délai de livraison',              icon: '📦',      desc: 'Partout au Bénin' },
  ],
  temoignages_rapides: [
    { texte: 'Depuis que je bois le Thé Pio Pio le soir, je dors beaucoup mieux. Mes douleurs articulaires ont diminué.', nom: 'Mariam K.',  ville: 'Cotonou' },
    { texte: "Je le donne à mes enfants depuis 3 mois. Moins de maladies fréquentes, ils sont en pleine forme !",          nom: 'Faustin D.', ville: 'Porto-Novo' },
    { texte: "Je revends le Thé Pio Pio dans ma boutique. Mes clients adorent et reviennent toujours commander.",           nom: 'Rachelle A.', ville: 'Parakou' },
  ],

  // Localisation
  loc_titre:     'Cultivé & produit à',
  loc_titre_em:  'Porto-Novo, Bénin',
  loc_sous_titre: 'Nos plantes poussent en plein cœur du Bénin. Livraison partout au pays sous 24h à 48h.',

  // Histoire page
  histoire_hero_label:    'Notre Histoire',
  histoire_hero_titre:    'De la science à la nature —',
  histoire_hero_titre_em: 'une vocation née au cœur de l\'Afrique',
  histoire_sections: [
    { num: '01', title: 'Les laboratoires de Cuba', text: 'Vétérinaire de formation, diplômé de Cuba où il a achevé ses études dans le plus grand laboratoire de diagnostic du pays, le fondateur de TROPICANA PIO PIO n\'a jamais cessé d\'observer, d\'analyser et de comprendre le vivant. C\'est dans les salles d\'histologie et d\'hématologie de ce prestigieux laboratoire qu\'une conviction profonde s\'est forgée en lui : une cellule saine est une cellule bien irriguée. Tant que le sang circule librement, les organes fonctionnent, l\'énergie abonde, et la maladie s\'éloigne.' },
    { num: '02', title: 'Le retour au Bénin', text: 'De retour au Bénin, fort de cette expertise scientifique, il tourne son regard vers les ressources naturelles de sa terre. C\'est alors qu\'il redécouvre une plante ancestrale, cultivée depuis des siècles dans les cours royales d\'Égypte pour le roi et ses proches : la verveine blanche à odeur citronnée — le roi des thés. Cette plante, poussant naturellement, sans engrais ni herbicides, possède une propriété remarquable : elle favorise une circulation sanguine optimale, nourrit les cellules, régule le métabolisme et favorise un sommeil réparateur.' },
    { num: '03', title: 'La naissance de Tropicana Pio Pio', text: 'Convaincu que ce trésor naturel méritait d\'être partagé avec le plus grand nombre, le fondateur décide d\'en faire une filière sérieuse et structurée. Il commence à cultiver la verveine blanche ainsi que d\'autres plantes médicinales menacées de disparition, avec le souci constant de respecter la nature et les hommes. Aujourd\'hui, TROPICANA PIO PIO est né de cette rencontre entre la rigueur scientifique et la sagesse ancestrale africaine.' },
    { num: '04', title: 'Notre ambition', text: 'Notre thé, 100% bio, sans additifs, est produit à Porto-Novo et recommandé pour toute la famille — des enfants dès 2 ans aux personnes du troisième âge — pour booster l\'énergie, améliorer le sommeil, soulager les articulations et purifier l\'organisme. Notre ambition : rayonner à l\'échelle nationale, sous-régionale et internationale, et faire du Thé Pio Pio un ambassadeur du bien-être africain dans le monde entier.' },
  ],
  histoire_citation:      'Le plus grand laboratoire, c\'est notre propre corps. Notre mission est de lui donner ce dont il a besoin pour fonctionner parfaitement.',
  histoire_fondateur_nom: 'Felicien Prosper DURAND',
  histoire_fondateur_sous: 'Fondateur · Vétérinaire diplômé\nSpécialiste en biologie cellulaire, Cuba',
  histoire_missions: [
    { icon: '🌱', text: 'Produire un thé 100% bio, sans additifs, accessible à toute la famille' },
    { icon: '🌍', text: 'Préserver les plantes médicinales africaines menacées de disparition' },
    { icon: '🏆', text: 'Faire du Thé Pio Pio un ambassadeur du bien-être africain dans le monde' },
    { icon: '🚀', text: 'Rayonner à l\'échelle nationale, sous-régionale et internationale' },
  ],

  // Blog
  blog_articles: [
    { slug: 'verveine-blanche-bienfaits', cat: 'Santé naturelle',        date: 'Avril 2026', title: "Qu'est-ce que la verveine blanche ? La plante qui révolutionne votre bien-être", excerpt: 'Vous avez entendu parler de la verveine, mais savez-vous vraiment ce que la verveine blanche citronnée peut faire pour votre corps ? Découvrez ses vertus exceptionnelles.', img: '/images/plante-verveine.jpg', read: '3 min' },
    { slug: 'the-famille-enfants',        cat: 'Famille & Bien-être',     date: 'Avril 2026', title: "Thé naturel pour toute la famille : à partir de quel âge et comment ?",            excerpt: 'Le Thé Pio Pio est recommandé dès 2 ans. Mais comment le préparer pour un enfant ? Quelles précautions prendre ? On vous explique tout en détail.',                    img: '/images/tasse-dessus.jpg', read: '4 min' },
    { slug: 'distributeur-the-piopio',    cat: 'Business & Distribution', date: 'Avril 2026', title: "Pourquoi distribuer le Thé Pio Pio ? Une opportunité business à saisir au Bénin", excerpt: 'Le marché du bien-être naturel est en pleine explosion en Afrique. Le Thé Pio Pio représente une opportunité sérieuse pour tout revendeur.',                              img: '/images/produit-bois.jpg', read: '3 min' },
  ],

  // Partenaires
  partenaires: [
    { id: '1', nom: "World's Poultry Science Association", logo: '/images/partenaire-wpsa.jpg',     lien: 'https://wpsa.com/',      tag: 'Partenaire scientifique' },
    { id: '2', nom: 'ONG Rail Bénin',                     logo: '/images/partenaire-ong-rail.jpg', lien: 'https://ongrail.com/',   tag: 'Partenaire local' },
  ],

  // Annonces
  annonces: [
    '🚚 Livraison gratuite à partir de 5 000 FCFA — partout au Bénin',
    '⚡ Commandez avant 18h, livré dès demain',
    '📞 Commande rapide par WhatsApp : +229 01 95 96 77 62',
  ],

  // Footer
  footer_slogan:    '"Un sang qui circule, une vie qui rayonne."',
  footer_cta_pre:   'Prêt à prendre soin de vous ?',
  footer_cta_titre: 'Commandez votre Thé Pio Pio dès aujourd\'hui.',
  footer_cta_btn:   '🛒 Commander dès 2 500 FCFA',
  footer_adresse:   'Oganla Gare Nord, Porto-Novo, Bénin',
  footer_horaires:  'Lun – Sam : 8h00 – 18h00',
  footer_copyright: '© 2026 tropicanapiopio.com — Tous droits réservés 🇧🇯',

  // Contact
  contact_intro: 'Notre équipe est disponible du lundi au samedi, de 8h à 18h. Nous répondons sous 24h.',

  // Couleurs
  couleur_vert:  '#2D6A4F',
  couleur_or:    '#C9973A',
  couleur_creme: '#F5F0E8',
  couleur_fonce: '#1A3C2E',
}

// ─── Chargement serveur (Next.js Server Component) ───────────────────────────
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${API_BASE}/content-site/`, {
      next: { revalidate: 60 }, // cache 60s
    })
    if (!res.ok) return defaultContent
    const remote = await res.json()
    // Fusion : les valeurs remote écrasent les defaults
    return deepMerge(defaultContent, remote)
  } catch {
    return defaultContent
  }
}

function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = { ...base }
  for (const key in override) {
    const val = override[key]
    if (val !== undefined && val !== null && val !== '') {
      // Pour les tableaux non vides, on remplace
      if (Array.isArray(val) && (val as unknown[]).length > 0) {
        (result as Record<string, unknown>)[key] = val
      } else if (!Array.isArray(val) && typeof val === 'object') {
        (result as Record<string, unknown>)[key] = deepMerge(
          (base as Record<string, unknown>)[key] as object || {},
          val as object
        )
      } else if (!Array.isArray(val)) {
        (result as Record<string, unknown>)[key] = val
      }
    }
  }
  return result
}
