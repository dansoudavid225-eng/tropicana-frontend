'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export type User = {
  id: number
  prenom: string
  nom: string
  nom_complet: string
  email: string
  telephone: string
  ville: string
  date_inscription: string
  photo_url?: string | null
  google_id?: string | null
  is_staff?: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  inscrire: (data: {
    prenom: string; nom: string; email: string;
    telephone: string; ville: string;
    mot_de_passe: string; confirmation: string
  }) => Promise<{ ok: boolean; message: string }>
  connecter: (email: string, mot_de_passe: string) => Promise<{ ok: boolean; message: string }>
  connecterGoogle: (googleData?: {
    credential: string; google_id: string; email: string;
    prenom: string; nom: string; photo_url?: string
  }) => Promise<{ ok: boolean; message: string }>
  deconnecter: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// ── Helpers tokens ────────────────────────────────────────────────────────────

function sauvegarderTokens(access: string, refresh: string) {
  localStorage.setItem('pio_access', access)
  localStorage.setItem('pio_refresh', refresh)
}

function supprimerTokens() {
  localStorage.removeItem('pio_access')
  localStorage.removeItem('pio_refresh')
  localStorage.removeItem('pio_user')
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem('pio_refresh')
  if (!refresh) return null
  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return null
    const data = await res.json()
    localStorage.setItem('pio_access', data.access)
    return data.access
  } catch {
    return null
  }
}

export async function fetchAvecAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let access = localStorage.getItem('pio_access')
  let res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${access}` },
  })
  // Si 401 → essayer de rafraîchir le token
  if (res.status === 401) {
    access = await refreshAccessToken()
    if (access) {
      res = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${access}` },
      })
    }
  }
  return res
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Charger la session au démarrage
  useEffect(() => {
    const chargerSession = async () => {
      const access = localStorage.getItem('pio_access')
      if (!access) { setLoading(false); return }

      try {
        const res = await fetchAvecAuth(`${API_BASE}/auth/profil/`)
        if (res.ok) {
          const data = await res.json()
          setUser(data)
          localStorage.setItem('pio_user', JSON.stringify(data))
        } else {
          supprimerTokens()
        }
      } catch {
        // Réseau indisponible — charger depuis le cache local
        const cached = localStorage.getItem('pio_user')
        if (cached) setUser(JSON.parse(cached))
      } finally {
        setLoading(false)
      }
    }
    chargerSession()
  }, [])

  const refreshUser = async () => {
    try {
      const res = await fetchAvecAuth(`${API_BASE}/auth/profil/`)
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        localStorage.setItem('pio_user', JSON.stringify(data))
      }
    } catch {}
  }

  // ── Inscription classique ────────────────────────────────────────────────
  const inscrire = async (formData: {
    prenom: string; nom: string; email: string;
    telephone: string; ville: string;
    mot_de_passe: string; confirmation: string
  }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/inscription/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        const labels: Record<string, string> = {
          prenom: 'Prénom', nom: 'Nom', email: 'Email',
          telephone: 'Téléphone', ville: 'Ville',
          mot_de_passe: 'Mot de passe', confirmation: 'Confirmation',
          non_field_errors: '',
        }
        const lignes = Object.entries(data as Record<string, unknown>).map(([champ, errs]) => {
          const label = labels[champ] !== undefined ? labels[champ] : champ
          const msgs = Array.isArray(errs) ? (errs as string[]).join(' ') : String(errs)
          return label ? `${label} : ${msgs}` : msgs
        })
        return { ok: false, message: lignes.join(' | ') || 'Erreur lors de la création du compte.' }
      }
      sauvegarderTokens(data.access, data.refresh)
      setUser(data.utilisateur)
      localStorage.setItem('pio_user', JSON.stringify(data.utilisateur))
      return { ok: true, message: data.message }
    } catch {
      return { ok: false, message: 'Erreur réseau. Vérifiez votre connexion.' }
    }
  }

  // ── Connexion classique ──────────────────────────────────────────────────
  const connecter = async (email: string, mot_de_passe: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/connexion/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { ok: false, message: data.detail || 'Email ou mot de passe incorrect.' }
      }
      sauvegarderTokens(data.access, data.refresh)
      setUser(data.utilisateur)
      localStorage.setItem('pio_user', JSON.stringify(data.utilisateur))
      return { ok: true, message: data.message }
    } catch {
      return { ok: false, message: 'Erreur réseau. Vérifiez votre connexion.' }
    }
  }

  // ── Connexion Google ─────────────────────────────────────────────────────
  const connecterGoogle = async (googleData?: {
    credential: string; google_id: string; email: string;
    prenom: string; nom: string; photo_url?: string
  }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData),
      })
      const data = await res.json()
      if (!res.ok) {
        return { ok: false, message: data.detail || 'Connexion Google impossible.' }
      }
      sauvegarderTokens(data.access, data.refresh)
      setUser(data.utilisateur)
      localStorage.setItem('pio_user', JSON.stringify(data.utilisateur))
      return { ok: true, message: data.message }
    } catch {
      return { ok: false, message: 'Erreur réseau. Vérifiez votre connexion.' }
    }
  }

  // ── Déconnexion ──────────────────────────────────────────────────────────
  const deconnecter = async () => {
    const refresh = localStorage.getItem('pio_refresh')
    try {
      if (refresh) {
        await fetchAvecAuth(`${API_BASE}/auth/deconnexion/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        })
      }
    } catch {}
    supprimerTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, inscrire, connecter, connecterGoogle, deconnecter, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
