'use client';
import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function SuiviCommandePage() {
  const { lang, t } = useLang();
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';

  const STATUTS: Record<string, { label: string; icon: string; couleur: string; etape: number }> = {
    en_attente:   { label: t('suivi.statutEnAttente'),   icon: '⏳', couleur: '#F4A261', etape: 1 },
    confirmee:    { label: t('suivi.statutConfirmee'),   icon: '', couleur: '#457B9D', etape: 2 },
    en_livraison: { label: t('suivi.statutEnLivraison'), icon: '', couleur: '#2D6A4F', etape: 3 },
    livree:       { label: t('suivi.statutLivree'),      icon: '', couleur: '#40916C', etape: 4 },
    annulee:      { label: t('suivi.statutAnnulee'),     icon: '', couleur: '#E63946', etape: 0 },
  };

  const ETAPES = [
    { etape: 1, label: t('suivi.etapeRecue'),     icon: '' },
    { etape: 2, label: t('suivi.etapeConfirmee'), icon: '' },
    { etape: 3, label: t('suivi.etapeLivraison'), icon: '' },
    { etape: 4, label: t('suivi.etapeLivree'),    icon: '' },
  ];

  const [commandeId, setCommandeId] = useState('');
  const [email, setEmail]           = useState('');
  const [commande, setCommande]     = useState<any>(null);
  const [loading, setLoading]       = useState(false);
  const [erreur, setErreur]         = useState('');

  const chercher = async () => {
    if (!commandeId.trim() || !email.trim()) {
      setErreur(t('suivi.erreurChamps'));
      return;
    }
    setLoading(true);
    setErreur('');
    setCommande(null);
    try {
      // Chercher dans les commandes publiques via email + id
      const token = typeof window !== 'undefined' ? localStorage.getItem('pio_access') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/commandes/suivi/?id=${commandeId}&email=${encodeURIComponent(email)}`, { headers });
      if (!res.ok) {
        setErreur(t('suivi.erreurIntrouvable'));
        return;
      }
      const data = await res.json();
      setCommande(data);
    } catch {
      setErreur(t('suivi.erreurReseau'));
    } finally {
      setLoading(false);
    }
  };

  const statut = commande ? STATUTS[commande.statut] : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-section)', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}></div>
          <h1 style={{ color: 'var(--green-mid)', fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>{t('suivi.titre')}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{t('suivi.sousTitre')}</p>
        </div>

        {/* Formulaire */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow-card)', marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 700, color: 'var(--green-mid)', marginBottom: 6, fontSize: '.9rem' }}>
              {t('suivi.numCommande')}
            </label>
            <input
              type="number"
              value={commandeId}
              onChange={e => setCommandeId(e.target.value)}
              placeholder={t('suivi.numCommandePh')}
              style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border-light)', borderRadius: 10, fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 700, color: 'var(--green-mid)', marginBottom: 6, fontSize: '.9rem' }}>
              {t('suivi.emailUtilise')}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('suivi.emailPh')}
              style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border-light)', borderRadius: 10, fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          {erreur && (
            <div style={{ background: 'var(--bg-error)', border: '1px solid var(--border-error)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-error)', fontSize: '.875rem', marginBottom: 16 }}>
              {erreur}
            </div>
          )}
          <button
            onClick={chercher}
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? 'var(--text-muted)' : 'var(--green-mid)', color: 'var(--text-inverse)', border: 'none', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? t('suivi.recherche') : t('suivi.suivreBtn')}
          </button>
        </div>

        {/* Résultat */}
        {commande && statut && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow-card)' }}>

            {/* Statut principal */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>{statut.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: statut.couleur }}>{statut.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '.875rem', marginTop: 4 }}>{t('suivi.commandeNum')}{commande.id}</div>
            </div>

            {/* Barre de progression */}
            {commande.statut !== 'annulee' && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {/* Ligne de fond */}
                  <div style={{ position: 'absolute', top: 20, left: '12%', right: '12%', height: 4, background: 'var(--border-light)', borderRadius: 2 }} />
                  {/* Ligne de progression */}
                  <div style={{
                    position: 'absolute', top: 20, left: '12%', height: 4, background: 'var(--green-mid)', borderRadius: 2,
                    width: `${Math.max(0, (statut.etape - 1) / 3 * 76)}%`,
                    transition: 'width .5s ease'
                  }} />
                  {ETAPES.map(e => (
                    <div key={e.etape} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', fontWeight: 700,
                        background: statut.etape >= e.etape ? 'var(--green-mid)' : 'var(--border-light)',
                        color: statut.etape >= e.etape ? 'var(--text-inverse)' : 'var(--text-muted)',
                        transition: 'all .3s',
                      }}>
                        {e.icon}
                      </div>
                      <div style={{ fontSize: '.7rem', color: statut.etape >= e.etape ? 'var(--green-mid)' : 'var(--text-muted)', marginTop: 6, fontWeight: statut.etape >= e.etape ? 700 : 400, textAlign: 'center' }}>
                        {e.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Détails commande */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{t('suivi.client')}</div>
                <div style={{ fontWeight: 700 }}>{commande.nom_client}</div>
                <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>{commande.telephone_client}</div>
              </div>
              <div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{t('suivi.livraison')}</div>
                <div style={{ fontWeight: 700 }}>{commande.ville_livraison}</div>
                <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>{commande.adresse_livraison || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{t('suivi.total')}</div>
                <div style={{ fontWeight: 800, color: 'var(--green-mid)', fontSize: '1.1rem' }}>{Number(commande.total).toLocaleString(locale)} FCFA</div>
              </div>
              <div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{t('suivi.paiement')}</div>
                <div style={{ fontWeight: 700 }}>{commande.mode_paiement}</div>
                <div style={{ fontSize: '.875rem', color: commande.payee ? 'var(--green-mid)' : 'var(--text-error)' }}>
                  {commande.payee ? t('suivi.payee') : t('suivi.enAttentePaiement')}
                </div>
              </div>
            </div>

            {/* Produits */}
            {commande.lignes && commande.lignes.length > 0 && (
              <div style={{ marginTop: 20, borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>{t('suivi.produitsCommandes')}</div>
                {commande.lignes.map((l: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '.9rem' }}>
                    <span>{l.produit_nom} <span style={{ color: 'var(--text-muted)' }}>×{l.quantite}</span></span>
                    <span style={{ fontWeight: 700 }}>{Number(l.sous_total).toLocaleString(locale)} FCFA</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contact */}
            <div style={{ marginTop: 20, background: 'var(--bg-section)', borderRadius: 10, padding: 14, textAlign: 'center', fontSize: '.85rem', color: 'var(--text-secondary)' }}>
              {t('suivi.question')}{' '}
              <a href="tel:+2290195967762" style={{ color: 'var(--green-mid)', fontWeight: 700 }}>+229 01 95 96 77 62</a>
              {' '}{t('suivi.ou')}{' '}
              <a href="https://wa.me/2290195967762" target="_blank" style={{ color: 'var(--green-mid)', fontWeight: 700 }}>WhatsApp</a>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
