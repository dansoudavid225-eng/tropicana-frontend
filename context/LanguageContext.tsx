'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Lang = 'fr' | 'en'
type LanguageContextType = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string }

const LanguageContext = createContext<LanguageContextType>({ lang: 'fr', setLang: () => {}, t: (k) => k })

export const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  'nav.accueil':          { fr: 'Accueil',          en: 'Home' },
  'nav.boutique':         { fr: 'Boutique',          en: 'Shop' },
  'nav.histoire':         { fr: 'Notre Histoire',    en: 'Our Story' },
  'nav.blog':             { fr: 'Blog',              en: 'Blog' },
  'nav.temoignages':      { fr: 'Avis clients',      en: 'Reviews' },
  'nav.faq':              { fr: 'FAQ',               en: 'FAQ' },
  'nav.contact':          { fr: 'Contact',           en: 'Contact' },
  'nav.connexion':        { fr: 'Connexion',         en: 'Login' },
  'nav.inscrire':         { fr: "S'inscrire",        en: 'Sign up' },
  'nav.monEspace':        { fr: 'Mon espace',        en: 'My account' },
  'nav.commander':        { fr: 'Commander',         en: 'Order now' },
  'nav.admin':            { fr: 'Administration',    en: 'Admin panel' },
  'nav.deconnexion':      { fr: 'Se déconnecter',    en: 'Log out' },
  'nav.fermer':           { fr: 'Fermer',            en: 'Close' },
  'nav.menu':             { fr: 'Menu',              en: 'Menu' },
  'nav.commanderMobile':  { fr: '🛒 Commander dès 1 000 FCFA', en: '🛒 Order from 1,000 FCFA' },
  'nav.modeJour':         { fr: 'Passer en mode jour', en: 'Switch to light mode' },
  'nav.modeNuit':         { fr: 'Passer en mode nuit', en: 'Switch to dark mode' },

  // AnnouncementBar
  'annonce.livraison':    { fr: '🚚 Livraison gratuite à partir de 5 000 FCFA — partout au Bénin', en: '🚚 Free delivery from 5,000 FCFA — across Benin' },
  'annonce.delai':        { fr: '⚡ Commandez avant 18h, livré dès demain', en: '⚡ Order before 6 PM, delivered tomorrow' },
  'annonce.whatsapp':     { fr: '📞 Commande rapide par WhatsApp', en: '📞 Quick order via WhatsApp' },

  // Footer
  'footer.newsletter':    { fr: 'Newsletter',          en: 'Newsletter' },
  'footer.newsletterSub': { fr: 'Recevez nos conseils santé et offres exclusives.', en: 'Get our health tips and exclusive offers.' },
  'footer.emailPh':       { fr: 'votre@email.com',     en: 'your@email.com' },
  'footer.souscrire':     { fr: "S'abonner",           en: 'Subscribe' },
  'footer.merci':         { fr: '✅ Merci ! Vérifiez votre boîte email.', en: '✅ Thank you! Check your inbox.' },
  'footer.droits':        { fr: '© 2026 tropicanapiopio.com — Tous droits réservés 🇧🇯', en: '© 2026 tropicanapiopio.com — All rights reserved 🇧🇯' },
  'footer.liens':         { fr: 'Liens utiles',        en: 'Useful links' },
  'footer.legal':         { fr: 'Légal',               en: 'Legal' },
  'footer.cgv':           { fr: 'CGV',                 en: 'Terms' },
  'footer.confidentialite':{ fr: 'Confidentialité',   en: 'Privacy' },
  'footer.suivez':        { fr: 'Suivez-nous',         en: 'Follow us' },
  'footer.contact':       { fr: 'Contact',             en: 'Contact' },
  'footer.fondateur':     { fr: 'Fondateur · Vétérinaire · Cuba', en: 'Founder · Veterinarian · Cuba' },

  // Commun
  'commun.charger':       { fr: 'Chargement…',         en: 'Loading…' },
  'commun.erreur':        { fr: 'Une erreur est survenue.', en: 'An error occurred.' },
  'commun.retour':        { fr: 'Retour',              en: 'Back' },
  'commun.voir':          { fr: 'Voir',                en: 'View' },
  'commun.fermer':        { fr: 'Fermer',              en: 'Close' },
  'commun.valider':       { fr: 'Valider',             en: 'Confirm' },
  'commun.annuler':       { fr: 'Annuler',             en: 'Cancel' },
  'commun.lireArticle':   { fr: "Lire l'article",      en: 'Read article' },
  'commun.tousAvis':      { fr: 'Tous les avis',       en: 'All reviews' },
  'commun.decouvrir':     { fr: 'Découvrir',           en: 'Discover' },
  'commun.enSavoirPlus':  { fr: 'En savoir plus',      en: 'Learn more' },

  // Auth
  'auth.email':           { fr: 'Adresse email',       en: 'Email address' },
  'auth.mdp':             { fr: 'Mot de passe',        en: 'Password' },
  'auth.mdpOublie':       { fr: 'Mot de passe oublié ?', en: 'Forgot password?' },
  'auth.seConnecter':     { fr: 'Se connecter',        en: 'Log in' },
  'auth.creerCompte':     { fr: 'Créer un compte',     en: 'Create account' },
  'auth.prenom':          { fr: 'Prénom',              en: 'First name' },
  'auth.nom':             { fr: 'Nom',                 en: 'Last name' },
  'auth.telephone':       { fr: 'Téléphone',           en: 'Phone' },
  'auth.ville':           { fr: 'Ville',               en: 'City' },
  'auth.confirmerMdp':    { fr: 'Confirmer le mot de passe', en: 'Confirm password' },
  'auth.dejaCpt':         { fr: 'Déjà un compte ?',   en: 'Already have an account?' },
  'auth.pasCpt':          { fr: 'Pas encore de compte ?', en: 'No account yet?' },
  'auth.connexionCours':  { fr: 'Connexion en cours…', en: 'Logging in…' },
  'auth.creationCours':   { fr: 'Création en cours…',  en: 'Creating account…' },
  'auth.google':          { fr: 'Continuer avec Google', en: 'Continue with Google' },
  'auth.ouAvec':          { fr: 'ou continuer avec',   en: 'or continue with' },
  'auth.sinscrire':       { fr: "S'inscrire",          en: 'Sign up' },
  'auth.afficherMdp':     { fr: 'Afficher le mot de passe', en: 'Show password' },
  'auth.masquerMdp':      { fr: 'Masquer le mot de passe', en: 'Hide password' },
  'auth.mdpOublieInfo':   { fr: 'Entrez votre email pour recevoir un lien de réinitialisation.', en: 'Enter your email to receive a reset link.' },
  'auth.envoyerLien':     { fr: 'Envoyer le lien',     en: 'Send reset link' },
  'auth.envoiCours':      { fr: 'Envoi en cours…',     en: 'Sending…' },
  'auth.lienEnvoye':      { fr: 'Lien envoyé ! Vérifiez votre boîte email.', en: 'Link sent! Check your inbox.' },
  'auth.nvMdp':           { fr: 'Nouveau mot de passe', en: 'New password' },
  'auth.confirmerNvMdp':  { fr: 'Confirmer le nouveau mot de passe', en: 'Confirm new password' },
  'auth.reinitialiser':   { fr: 'Réinitialiser',       en: 'Reset password' },
  'auth.reinitialisationCours': { fr: 'Réinitialisation en cours…', en: 'Resetting…' },
  'auth.mdpModifie':      { fr: 'Mot de passe modifié avec succès !', en: 'Password successfully changed!' },

  // Boutique
  'boutique.titre':       { fr: 'Notre Boutique',      en: 'Our Shop' },
  'boutique.sousTitre':   { fr: 'Thés aux plantes authentiques du Bénin', en: 'Authentic Beninese herbal teas' },
  'boutique.commander':   { fr: 'Commander',           en: 'Order' },
  'boutique.enRupture':   { fr: 'Rupture de stock',    en: 'Out of stock' },
  'boutique.ajouter':     { fr: 'Ajouter au panier',   en: 'Add to cart' },
  'boutique.panier':      { fr: 'Votre panier',        en: 'Your cart' },
  'boutique.total':       { fr: 'Total',               en: 'Total' },
  'boutique.valider':     { fr: 'Valider la commande', en: 'Checkout' },
  'boutique.vide':        { fr: 'Votre panier est vide.', en: 'Your cart is empty.' },
  'boutique.qty':         { fr: 'Qté :',               en: 'Qty:' },
  'boutique.livraison':   { fr: 'Livraison',           en: 'Delivery' },
  'boutique.offerte':     { fr: 'Offerte',             en: 'Free' },
  'boutique.supprimer':   { fr: '✕ Supprimer',         en: '✕ Remove' },
  'boutique.garantie':    { fr: '✅ Paiement sécurisé — Mobile Money accepté', en: '✅ Secure payment — Mobile Money accepted' },
  'boutique.livInfo':     { fr: '🚚 Livraison 24h partout au Bénin', en: '🚚 Delivery 24h across Benin' },
  'boutique.naturel':     { fr: '🌿 100% naturel, sans additif', en: '🌿 100% natural, no additives' },

  // Contact
  'contact.titre':        { fr: 'Nous sommes à votre écoute', en: 'We are here for you' },
  'contact.label':        { fr: 'Contact',             en: 'Contact' },
  'contact.coordonnees':  { fr: 'Nos coordonnées',     en: 'Our contact details' },
  'contact.adresse':      { fr: 'Adresse',             en: 'Address' },
  'contact.telephone':    { fr: 'Téléphone',           en: 'Phone' },
  'contact.email':        { fr: 'Email',               en: 'Email' },
  'contact.dispo':        { fr: 'Disponibilité',       en: 'Availability' },
  'contact.dispoVal':     { fr: 'Lundi – Samedi : 8h00 – 18h00', en: 'Mon – Sat: 8 AM – 6 PM' },
  'contact.livraison':    { fr: 'Livraison',           en: 'Delivery' },
  'contact.livVal':       { fr: 'Nationale — partout au Bénin', en: 'Nationwide — across Benin' },
  'contact.formTitre':    { fr: 'Envoyez-nous un message', en: 'Send us a message' },
  'contact.formSub':      { fr: 'Réponse garantie sous 24h — Lun–Sam 8h–18h', en: 'Response guaranteed within 24h — Mon–Sat 8am–6pm' },
  'contact.nomComplet':   { fr: 'Nom complet *',       en: 'Full name *' },
  'contact.nomPh':        { fr: 'Votre nom',           en: 'Your name' },
  'contact.emailLbl':     { fr: 'Email *',             en: 'Email *' },
  'contact.objet':        { fr: 'Objet',               en: 'Subject' },
  'contact.selectPh':     { fr: 'Sélectionner...',     en: 'Select...' },
  'contact.optCmd':       { fr: 'Commande',            en: 'Order' },
  'contact.optPart':      { fr: 'Partenariat / Distribution', en: 'Partnership / Distribution' },
  'contact.optRens':      { fr: 'Renseignement produit', en: 'Product inquiry' },
  'contact.optAutre':     { fr: 'Autre',               en: 'Other' },
  'contact.message':      { fr: 'Message *',           en: 'Message *' },
  'contact.msgPh':        { fr: 'Votre message...',    en: 'Your message...' },
  'contact.envoyer':      { fr: 'Envoyer ma demande →', en: 'Send my request →' },
  'contact.envoi':        { fr: '⏳ Envoi en cours...', en: '⏳ Sending...' },
  'contact.rgpd':         { fr: '🔒 Vos données ne sont jamais partagées à des tiers.', en: '🔒 Your data is never shared with third parties.' },
  'contact.envoye':       { fr: 'Message envoyé !',   en: 'Message sent!' },
  'contact.merci':        { fr: 'Merci pour votre message. Notre équipe vous répondra sous 24h.', en: 'Thank you for your message. Our team will respond within 24h.' },
  'contact.voirBoutique': { fr: 'Voir la boutique',   en: 'Visit the shop' },
  'contact.erreur':       { fr: "⚠️ Erreur d'envoi. Contactez-nous directement par WhatsApp ou par email.", en: '⚠️ Send error. Contact us directly via WhatsApp or email.' },
  'contact.whatsapp':     { fr: '→ Ouvrir WhatsApp',  en: '→ Open WhatsApp' },
  'contact.whatsappDirect': { fr: '📲 WhatsApp direct', en: '📲 WhatsApp direct' },
  'contact.emailDirect':  { fr: '📧 Email direct',    en: '📧 Direct email' },
  'contact.distTitre':    { fr: 'Vous êtes revendeur, grossiste ou hôtelier ?', en: 'Are you a reseller, wholesaler or hotelier?' },
  'contact.distBody':     { fr: 'Rejoignez notre réseau de distributeurs. Prix préférentiels à partir de 10 unités, livraison nationale, support commercial fourni.', en: 'Join our distribution network. Preferential pricing from 10 units, national delivery, commercial support provided.' },
  'contact.ouvrirMaps':   { fr: 'Ouvrir dans Google Maps →', en: 'Open in Google Maps →' },
  'contact.mobileMoney':  { fr: '💳 Paiement Mobile Money', en: '💳 Mobile Money Payment' },

  // FAQ
  'faq.titre':            { fr: 'FAQ',                 en: 'FAQ' },
  'faq.badge':            { fr: 'Questions fréquentes', en: 'Frequently asked questions' },
  'faq.heroTitre':        { fr: 'Tout ce que vous voulez', en: 'Everything you want to' },
  'faq.heroEm':           { fr: 'savoir',              en: 'know' },
  'faq.aucune':           { fr: 'Aucune question dans cette catégorie.', en: 'No questions in this category.' },
  'faq.pasTrouve':        { fr: "Vous n'avez pas trouvé votre réponse ?", en: "Haven't found your answer?" },
  'faq.reponse2h':        { fr: 'Notre équipe répond sous 2h sur WhatsApp.', en: 'Our team responds within 2h on WhatsApp.' },
  'faq.formulaire':       { fr: '📧 Formulaire',       en: '📧 Contact form' },

  // Témoignages
  'temo.titre':           { fr: 'Avis clients',        en: 'Customer Reviews' },
  'temo.badge':           { fr: 'Ils nous font confiance', en: 'They trust us' },
  'temo.sousTitre':       { fr: 'Des histoires vraies, des résultats réels', en: 'Real stories, real results' },
  'temo.partager':        { fr: 'Partager mon expérience', en: 'Share my experience' },
  'temo.charger':         { fr: "Charger plus d'avis", en: 'Load more reviews' },
  'temo.laisser':         { fr: '✍️ Laisser mon avis →', en: '✍️ Leave a review →' },
  'temo.voirTous':        { fr: 'Voir tous les avis · Laisser le mien →', en: 'All reviews · Leave mine →' },
  'temo.video':           { fr: 'Témoignage vidéo',   en: 'Video testimonial' },
  'temo.aucun':           { fr: 'Aucun avis pour le moment.', en: 'No reviews yet.' },
  'temo.filtreAll':       { fr: 'Tous',               en: 'All' },
  'temo.nom':             { fr: 'Votre prénom *',     en: 'Your first name *' },
  'temo.ville':           { fr: 'Votre ville *',      en: 'Your city *' },
  'temo.note':            { fr: 'Note *',             en: 'Rating *' },
  'temo.avis':            { fr: 'Votre avis *',       en: 'Your review *' },
  'temo.envoyerAvis':     { fr: 'Envoyer mon avis →', en: 'Submit review →' },
  'temo.envoiCours':      { fr: 'Envoi…',             en: 'Submitting…' },
  'temo.merci':           { fr: 'Merci pour votre avis !', en: 'Thank you for your review!' },
  'temo.erreur':          { fr: "Erreur d'envoi. Réessayez.", en: 'Submission error. Please try again.' },

  // Espace client
  'espace.titre':         { fr: 'Mon espace',         en: 'My account' },
  'espace.accueil':       { fr: 'Accueil',            en: 'Home' },
  'espace.commandes':     { fr: 'Mes commandes',      en: 'My orders' },
  'espace.profil':        { fr: 'Mon profil',         en: 'My profile' },
  'espace.fidelite':      { fr: 'Fidélité',           en: 'Loyalty' },
  'espace.deconnexion':   { fr: 'Se déconnecter',     en: 'Log out' },
  'espace.bienvenue':     { fr: 'Bienvenue',          en: 'Welcome' },
  'espace.commander':     { fr: 'Passer une commande', en: 'Place an order' },
  'espace.aucuneCmd':     { fr: 'Aucune commande pour le moment.', en: 'No orders yet.' },
  'espace.statEnAttente': { fr: 'En attente',         en: 'Pending' },
  'espace.statConfirmee': { fr: 'Confirmée',          en: 'Confirmed' },
  'espace.statExpediee':  { fr: 'Expédiée',           en: 'Shipped' },
  'espace.statLivree':    { fr: 'Livrée',             en: 'Delivered' },
  'espace.statAnnulee':   { fr: 'Annulée',            en: 'Cancelled' },
  'espace.chargement':    { fr: 'Chargement…',        en: 'Loading…' },

  // Histoire
  'histoire.label':       { fr: 'Notre Histoire',     en: 'Our Story' },
  'histoire.titre':       { fr: 'De la science à la nature', en: 'From science to nature' },
  'histoire.sous':        { fr: "une vocation née au cœur de l'Afrique", en: 'a vocation born in the heart of Africa' },
  'histoire.mission':     { fr: 'Notre Mission',      en: 'Our Mission' },
  'histoire.cta':         { fr: "Redécouvrez le plaisir d'un moment de calme", en: 'Rediscover the joy of a quiet moment' },
  'histoire.ctaBtn':      { fr: 'Découvrir notre thé', en: 'Discover our tea' },
  'histoire.fondateur':   { fr: 'Fondateur · Vétérinaire diplômé\nSpécialiste en biologie cellulaire, Cuba', en: 'Founder · Veterinarian\nCell biology specialist, Cuba' },
  'histoire.citation':    { fr: "Le plus grand laboratoire, c'est notre propre corps. Notre mission est de lui donner ce dont il a besoin pour fonctionner parfaitement.", en: "The greatest laboratory is our own body. Our mission is to give it what it needs to function perfectly." },

  // Blog
  'blog.badge':           { fr: 'Le Blog',            en: 'The Blog' },
  'blog.titre':           { fr: 'Santé naturelle &',  en: 'Natural health &' },
  'blog.titreEm':         { fr: 'plantes africaines', en: 'African plants' },
  'blog.sous':            { fr: 'Conseils, découvertes et actualités autour des plantes médicinales du Bénin.', en: 'Tips, discoveries and news about medicinal plants from Benin.' },
  'blog.articles':        { fr: 'Articles',           en: 'Articles' },
  'blog.categories':      { fr: 'Catégories',         en: 'Categories' },
  'blog.gratuit':         { fr: 'Gratuit',            en: 'Free' },
  'blog.vedette':         { fr: 'Article vedette',    en: 'Featured article' },
  'blog.autres':          { fr: 'Autres articles',    en: 'More articles' },
  'blog.lire':            { fr: "Lire l'article",     en: 'Read article' },
  'blog.ctaTitre':        { fr: 'Restez informé des', en: 'Stay informed of' },
  'blog.ctaEm':          { fr: 'nouveaux articles',   en: 'new articles' },
  'blog.ctaSub':          { fr: 'Conseils santé, actualités Tropicana Pio Pio directement dans votre boîte mail.', en: 'Health tips, Tropicana Pio Pio news straight to your inbox.' },
  'blog.ctaBtn':          { fr: 'Nous contacter →',   en: 'Contact us →' },

  // Accueil
  'home.planteLabel':     { fr: 'Notre ingrédient phare', en: 'Our star ingredient' },
  'home.planteTitre1':    { fr: 'La verveine blanche', en: 'White lemon' },
  'home.planteTitre2':    { fr: 'citronnée',           en: 'verbena' },
  'home.planteDesc':      { fr: "Cultivée depuis des siècles dans les cours royales d'Égypte, cette plante ancestrale pousse naturellement sur nos terres béninoises sans aucun engrais ni herbicide.", en: "Cultivated for centuries in the royal courts of Egypt, this ancestral plant grows naturally on our Beninese soil with no fertilizers or herbicides." },
  'home.bienfaitsLabel':  { fr: 'Bienfaits prouvés',  en: 'Proven benefits' },
  'home.bienfaitsTitre':  { fr: 'Ce que notre thé fait pour vous', en: 'What our tea does for you' },
  'home.fondateurLabel':  { fr: 'Notre fondateur',    en: 'Our founder' },
  'home.fondateurTitre':  { fr: 'De la science à la nature', en: 'From science to nature' },
  'home.fondateurCit':    { fr: "Le plus grand laboratoire, c'est notre propre corps. Notre mission est de lui donner ce dont il a besoin pour fonctionner parfaitement.", en: "The greatest laboratory is our own body. Our mission is to give it what it needs to function perfectly." },
  'home.lireHistoire':    { fr: 'Lire notre histoire', en: 'Read our story' },
  'home.boutiqueLabel':   { fr: 'Boutique',           en: 'Shop' },
  'home.produitTitre':    { fr: 'Notre produit',      en: 'Our product' },
  'home.produitDesc':     { fr: "Infusion de verveine blanche citronnée 100% naturelle. Livraison nationale incluse.", en: "100% natural lemon verbena infusion. Nationwide delivery included." },
  'home.prix':            { fr: 'dès 1 000 FCFA',     en: 'from 1,000 FCFA' },
  'home.commander':       { fr: 'Commander →',        en: 'Order →' },
  'home.ouTrouver':       { fr: 'Où nous trouver',    en: 'Where to find us' },
  'home.cultive':         { fr: 'Cultivé & produit à', en: 'Grown & produced in' },
  'home.location':        { fr: 'Porto-Novo, Bénin',  en: 'Porto-Novo, Benin' },
  'home.temoLabel':       { fr: 'Ils nous font confiance', en: 'They trust us' },
  'home.temoTitre':       { fr: 'Ce que disent nos clients', en: 'What our customers say' },
  'home.bannerTxt':       { fr: '🌿 Cultivé à Porto-Novo · Formulé par un vétérinaire · Livraison nationale au Bénin', en: '🌿 Grown in Porto-Novo · Formulated by a veterinarian · Nationwide delivery in Benin' },
  'home.ouvrirMaps':      { fr: 'Ouvrir dans Google Maps →', en: 'Open in Google Maps →' },
  // Clés manquantes — page connexion
  'page.connexion':           { fr: 'Connexion',                    en: 'Sign in' },

  // home.cta (citation tasse)
  'home.cta':                 { fr: 'Votre bien-être, notre mission.', en: 'Your wellbeing, our mission.' },

  // Boutique — textes inline manquants
  'boutique.panierTitre':     { fr: '🛒 Votre panier',              en: '🛒 Your cart' },
  'boutique.panierVide':      { fr: 'Votre panier est vide.',       en: 'Your cart is empty.' },
  'boutique.finaliser':       { fr: 'Finaliser la commande',        en: 'Checkout' },
  'boutique.nomComplet':      { fr: 'Nom complet *',                en: 'Full name *' },
  'boutique.votreNom':        { fr: 'Votre nom',                    en: 'Your name' },
  'boutique.telMM':           { fr: 'Téléphone Mobile Money *',     en: 'Mobile Money Phone *' },
  'boutique.ville':           { fr: 'Ville *',                      en: 'City *' },
  'boutique.villePh':         { fr: 'Porto-Novo, Cotonou…',         en: 'City…' },
  'boutique.modePaiement':    { fr: 'Mode de paiement *',           en: 'Payment method *' },
  'boutique.adresse':         { fr: 'Adresse de livraison',         en: 'Delivery address' },
  'boutique.adressePh':       { fr: 'Quartier, rue, point de repère…', en: 'District, street, landmark…' },
  'boutique.notes':           { fr: 'Notes (optionnel)',            en: 'Notes (optional)' },
  'boutique.notesPh':         { fr: 'Instructions particulières…',  en: 'Special instructions…' },
  'boutique.envoi':           { fr: '⏳ Envoi en cours…',           en: '⏳ Sending…' },
  'boutique.cmdConfirmee':    { fr: 'confirmée !',                  en: 'confirmed!' },
  'boutique.merciCmd':        { fr: 'Merci ! Un email de confirmation vous a été envoyé. Notre équipe vous contactera sous 2h.', en: 'Thank you! A confirmation email has been sent. Our team will contact you within 2h.' },
  'boutique.cnxRequise':      { fr: 'Connexion requise',            en: 'Login required' },
  'boutique.voirPanier':      { fr: '— Voir le panier',             en: '— View cart' },
  'boutique.label':           { fr: 'Notre Boutique',               en: 'Our Shop' },
  'boutique.labelSub':        { fr: '100% bio · Verveine blanche citronnée · Livraison nationale au Bénin', en: '100% organic · Lemon verbena · Nationwide delivery in Benin' },
  'boutique.nosProds':        { fr: 'Nos produits',                 en: 'Our products' },
  'boutique.cmderEnLigne':    { fr: 'Commandez en ligne',           en: 'Order online' },
  'boutique.liv2472':         { fr: 'Livraison nationale 24–72h',   en: 'Nationwide delivery 24–72h' },
  'boutique.naturelBio':      { fr: '100% Naturel & Bio',           en: '100% Natural & Organic' },
  'boutique.mobileMoney':     { fr: 'Paiement Mobile Money',        en: 'Mobile Money payment' },
  'boutique.satisfait':       { fr: 'Satisfait ou remboursé',       en: 'Satisfied or refunded' },
  'boutique.comment1':        { fr: 'Connectez-vous',               en: 'Log in' },
  'boutique.comment1d':       { fr: 'Créez un compte gratuit ou connectez-vous à votre espace client.', en: 'Create a free account or log in to your account.' },
  'boutique.comment2':        { fr: 'Ajoutez au panier',            en: 'Add to cart' },
  'boutique.comment2d':       { fr: 'Sélectionnez la quantité et ajoutez le produit à votre panier.', en: 'Select the quantity and add the product to your cart.' },
  'boutique.comment3':        { fr: 'Payez en Mobile Money',        en: 'Pay via Mobile Money' },
  'boutique.comment3d':       { fr: 'MTN Money, Moov Money, Wave ou Orange Money.', en: 'MTN Money, Moov Money, Wave or Orange Money.' },
  'boutique.comment4':        { fr: 'Recevez sous 24–72h',          en: 'Receive within 24–72h' },
  'boutique.comment4d':       { fr: 'Livraison partout au Bénin.',  en: 'Delivery across Benin.' },
  'boutique.errSession':      { fr: 'Votre session a expiré. Veuillez vous reconnecter et réessayer.', en: 'Your session has expired. Please log in again and retry.' },
  'boutique.errReseau':       { fr: 'Erreur réseau. Vérifiez votre connexion internet.', en: 'Network error. Please check your internet connection.' },
  'boutique.errGenerale':     { fr: 'Une erreur est survenue. Veuillez réessayer.', en: 'An error occurred. Please try again.' },
  'boutique.cmdNum':          { fr: 'Commande #',                   en: 'Order #' },

  // Témoignages — textes inline manquants
  'temo.textePh':             { fr: 'Partagez votre expérience avec le Thé Pio Pio…', en: 'Share your experience with Thé Pio Pio…' },
  'temo.publier':             { fr: 'Publier mon témoignage →',     en: 'Publish my review →' },
  'temo.sousTitreForme':      { fr: 'Texte, vidéo ou les deux — partagez votre expérience avec le Thé Pio Pio !', en: 'Text, video or both — share your experience with Thé Pio Pio!' },
  'temo.merciDetail':         { fr: 'Merci ! Votre témoignage a été soumis et sera publié après validation.', en: 'Thank you! Your testimonial has been submitted and will be published after review.' },

  // Espace client — textes inline manquants
  'espace.etapeRecue':        { fr: 'Reçue',                        en: 'Received' },
  'espace.etapeConfirmee':    { fr: 'Confirmée',                    en: 'Confirmed' },
  'espace.etapeLivraison':    { fr: 'En livraison',                 en: 'In transit' },
  'espace.etapeLivree':       { fr: 'Livrée',                       en: 'Delivered' },
  'espace.descRecue':         { fr: 'Votre commande a été reçue',   en: 'Your order has been received' },
  'espace.descConfirmee':     { fr: 'Notre équipe a confirmé votre commande', en: 'Our team has confirmed your order' },
  'espace.descLivraison':     { fr: 'Votre colis est en route',     en: 'Your package is on its way' },
  'espace.descLivree':        { fr: 'Commande livrée avec succès',  en: 'Order successfully delivered' },

  // FAQ — textes inline manquants
  'faq.questionsRepondues':   { fr: 'questions répondues',          en: 'questions answered' },
  'faq.toutesQuestions':      { fr: 'Toutes vos questions sur le Thé Pio Pio', en: 'All your questions about Thé Pio Pio' },
  'faq.whatsapp':             { fr: '💬 WhatsApp',                  en: '💬 WhatsApp' },
  'faq.repondre2h':           { fr: 'Notre équipe répond sous 2h sur WhatsApp.', en: 'Our team responds within 2h on WhatsApp.' },

}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pio-lang') as Lang | null
      if (saved === 'fr' || saved === 'en') setLangState(saved)
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('pio-lang', l) } catch {}
  }

  const t = (key: string): string => {
    const entry = translations[key]
    if (!entry) return key
    return entry[lang] ?? entry['fr'] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
