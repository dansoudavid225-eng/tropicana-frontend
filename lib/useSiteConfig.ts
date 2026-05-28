'use client'
import { useState, useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export type SiteConfig = {
  telephone: string
  telephone_raw: string
  email: string
  adresse: string
  description_footer: string
  tiktok_url: string
  facebook_url: string
  paiements_liste: string[]
  prix_affiche: string
  prix_mini: string
  arguments: { icone: string; titre: string; sous: string }[]
  stats: { icone: string; num: string; label: string; desc: string }[]
}

const defaults: SiteConfig = {
  telephone: '+229 01 95 96 77 62',
  telephone_raw: '+2290195967762',
  email: 'tropicanapiopio@gmail.com',
  adresse: 'Oganla Gare Nord, Porto-Novo, Bénin',
  description_footer: 'Thé 100% naturel à base de verveine blanche citronnée. Cultivé et produit à Porto-Novo, Bénin.',
  tiktok_url: 'https://www.tiktok.com/@thepio08',
  facebook_url: 'https://facebook.com/profile.php?id=61569744814995',
  paiements_liste: ['MTN Money', 'Moov Money', 'Wave', 'Orange'],
  prix_affiche: 'dès 2 500 FCFA',
  prix_mini: '1 000 FCFA',
  arguments: [
    { icone: '🌱', titre: '100 % Bio',            sous: 'Sans engrais ni herbicides' },
    { icone: '🔬', titre: 'Fondé sur la science', sous: 'Formulé par un vétérinaire' },
    { icone: '👨‍👩‍👧', titre: 'Toute la famille',    sous: 'Recommandé dès 2 ans' },
    { icone: '🇧🇯', titre: 'Made in Bénin',        sous: 'Livraison nationale' },
  ],
  stats: [
    { icone: '👨‍👩‍👧‍👦', num: '500+',      label: 'Familles béninoises satisfaites', desc: 'Partout au Bénin' },
    { icone: '🌱',    num: '100%',      label: 'Bio, zéro additif',              desc: 'Sans engrais ni herbicide' },
    { icone: '👶',    num: 'Dès 2 ans', label: 'Pour toute la famille',          desc: 'Enfants, adultes, seniors' },
    { icone: '📦',    num: '24h',       label: 'Délai de livraison',             desc: 'Partout au Bénin' },
  ],
}

let cache: SiteConfig | null = null

export function useSiteConfig(): SiteConfig {
  const [cfg, setCfg] = useState<SiteConfig>(cache ?? defaults)

  useEffect(() => {
    if (cache) { setCfg(cache); return }
    fetch(`${API_BASE}/config-site/`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) { cache = { ...defaults, ...data }; setCfg(cache) }
      })
      .catch(() => {})
  }, [])

  return cfg
}
