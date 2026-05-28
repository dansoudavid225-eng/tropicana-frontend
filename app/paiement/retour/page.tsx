import { Suspense } from 'react'
import RetourPaiementClient from './RetourPaiementClient'

export default function RetourPaiementPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Vérification du paiement…</p>
      </div>
    }>
      <RetourPaiementClient />
    </Suspense>
  )
}
