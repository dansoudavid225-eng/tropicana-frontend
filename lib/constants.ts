// ── Constantes partagées Tropicana Pio Pio ─────────────────────────────────
// Modifier ici une seule fois pour mettre à jour toute l'application

export const CONTACT_PHONE     = '+229 01 95 96 77 62'
export const CONTACT_PHONE_RAW = '+2290195967762'   // pour les liens tel: et wa.me
export const CONTACT_EMAIL     = 'tropicanapiopio@gmail.com'
export const WHATSAPP_MESSAGE  = encodeURIComponent(
  "Bonjour ! Je souhaite commander le Thé Pio Pio. Pouvez-vous m'aider ?"
)
export const WHATSAPP_URL      = `https://wa.me/${CONTACT_PHONE_RAW}?text=${WHATSAPP_MESSAGE}`
