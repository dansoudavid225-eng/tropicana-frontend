# 📧 Configuration EmailJS — Formulaire Contact

## Étapes pour activer l'envoi d'emails réels

### 1. Créer un compte EmailJS (gratuit)
→ https://www.emailjs.com  
Le plan gratuit permet 200 emails/mois, suffisant pour débuter.

### 2. Connecter votre compte Gmail
- Dans EmailJS : Email Services → Add New Service → Gmail
- Autorisez l'accès à `tropicanapiopio.officiel@gmail.com`
- Notez le **Service ID** (ex: `service_abc123`)

### 3. Créer un template d'email
- Templates → Create New Template
- Copiez ce contenu :

```
Sujet : Nouveau message depuis le site — {{objet}}

Nom : {{from_name}}
Email : {{from_email}}
Téléphone : {{telephone}}
Objet : {{objet}}

Message :
{{message}}
```

- Notez le **Template ID** (ex: `template_xyz789`)

### 4. Récupérer votre clé publique
- Account → API Keys → Public Key
- Notez la **Public Key** (ex: `user_ABCDEF123456`)

### 5. Mettre à jour le code
Dans `app/contact/page.tsx`, remplacez :

```javascript
const SERVICE_ID = 'YOUR_SERVICE_ID'    // ← votre Service ID
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'  // ← votre Template ID
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'    // ← votre Public Key
```

### 6. Tester
Remplissez le formulaire sur le site → vous devriez recevoir un email sur `tropicanapiopio.officiel@gmail.com`.

---
✅ Configuration terminée — les emails arrivent directement dans votre boite Gmail.
