# Modifications effectuées

## 1. Suppression du mode sombre
- `app/globals.css` — supprimé tout le bloc `[data-theme="dark"]` (variables CSS), la transition fluide entre modes, et le `[data-theme="dark"] .card-green`
- `context/ThemeContext.tsx` — simplifié : retourne toujours `theme='light'`, plus de logique de bascule
- `app/layout.tsx` — supprimé le script anti-flash et le wrapper `<ThemeProvider>`
- `components/Navbar.tsx` — supprimé le bouton de bascule jour/nuit (desktop + mobile)
- `context/LanguageContext.tsx` — supprimé les clés `nav.modeJour` / `nav.modeNuit`

## 2. Navbar blanche
- `components/Navbar.tsx` — fond navbar passé en `#ffffff` (défaut) / `rgba(255,255,255,0.92)` (scroll). Logo sans fond ni ombre pour se fondre. Couleurs des liens/icônes/textes adaptées pour lisibilité sur fond blanc.

## 3. Boutique — ajout au panier sans connexion
- `app/boutique/page.tsx` — supprimé le blocage `if (!estConnecte)` dans `ajouterAuPanier()` : on peut ajouter au panier sans être connecté
- Remplacé la modale de connexion par une redirection vers `/inscription` quand on clique sur "Passer la commande" sans être connecté
- Supprimé l'état `showAuthModal` et la modale associée
