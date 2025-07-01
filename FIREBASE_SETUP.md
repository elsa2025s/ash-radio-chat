# 🔥 Configuration Firebase pour Ash-Radio Chat

## 🚀 Étape 1: Création du projet Firebase

### 1.1 Créer le projet
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur **"Créer un projet"**
3. Nom du projet: `ash-radio-chat` ou `votre-nom-préféré`
4. **Activez Google Analytics** (recommandé)
5. Sélectionnez **région Europe** (europe-west1)

### 1.2 Configurer Authentication
1. Dans Firebase Console → **Authentication**
2. Onglet **"Sign-in method"**
3. Activez **Email/Mot de passe**
4. Activez **"Lien email (connexion sans mot de passe)"** (optionnel)

### 1.3 Configurer Realtime Database
1. Dans Firebase Console → **Realtime Database**
2. Cliquez **"Créer une base de données"**
3. Choisissez **région Europe** (europe-west1)
4. Commencez en **mode test** (règles de sécurité ajoutées plus tard)

### 1.4 Configurer Storage
1. Dans Firebase Console → **Storage**
2. Cliquez **"Commencer"**
3. Commencez en **mode test**
4. Région: **europe-west1**

### 1.5 Configurer Hosting
1. Dans Firebase Console → **Hosting**
2. Cliquez **"Commencer"**
3. Suivez les étapes (on configurera plus tard)

## 🔧 Étape 2: Configuration locale

### 2.1 Récupérer la configuration
1. Firebase Console → **Paramètres du projet** (icône ⚙️)
2. Onglet **"Général"**
3. Section **"Vos applications"** → **"Config"**
4. Copiez la configuration

### 2.2 Créer le fichier .env.local
Créez le fichier `.env.local` avec votre configuration :

\`\`\`env
# Firebase Configuration - Remplacez par vos vraies valeurs
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ash-radio-chat.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://ash-radio-chat-default-rtdb.europe-west1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ash-radio-chat
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ash-radio-chat.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Ash-Radio Configuration
NEXT_PUBLIC_SITE_NAME=Ash-Radio
NEXT_PUBLIC_SITE_URL=https://ashradio-direct.com
\`\`\`

## 📋 Étape 3: Déploiement

### 3.1 Connexion Firebase CLI
\`\`\`bash
# Installer Firebase CLI (si pas déjà fait)
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser le projet (dans le dossier tchat-communautaire)
firebase init
\`\`\`

### 3.2 Configuration Firebase Init
Sélectionnez :
- ✅ **Hosting**: Configure files for Firebase Hosting
- ✅ **Database**: Configure a security rules file for Realtime Database
- ✅ **Storage**: Configure a security rules file for Cloud Storage

**Réponses aux questions :**
- Use existing project: **ash-radio-chat** (votre projet)
- Database rules file: **database.rules.json** ✅
- Storage rules file: **storage.rules** ✅
- Public directory: **out** ✅
- Configure as SPA: **Yes** ✅
- GitHub deploys: **No** ❌

### 3.3 Build et déploiement
\`\`\`bash
# Build du projet
bun run build

# Déploiement Firebase
firebase deploy
\`\`\`

## 🌐 Étape 4: Domaine personnalisé (ashradio-direct.com)

### 4.1 Ajouter le domaine
1. Firebase Console → **Hosting**
2. Onglet **"Domaines personnalisés"**
3. Cliquez **"Ajouter un domaine personnalisé"**
4. Entrez : `ashradio-direct.com` ou `chat.ashradio-direct.com`

### 4.2 Configuration DNS (chez Ionos)
Ajoutez ces enregistrements DNS :

**Pour ashradio-direct.com/chat :**
\`\`\`
Type: A
Nom: @
Valeur: [IP fournie par Firebase]

Type: TXT
Nom: @
Valeur: [Valeur fournie par Firebase]
\`\`\`

**Pour chat.ashradio-direct.com :**
\`\`\`
Type: A
Nom: chat
Valeur: [IP fournie par Firebase]

Type: TXT
Nom: chat
Valeur: [Valeur fournie par Firebase]
\`\`\`

## 🔐 Étape 5: Sécurité (Production)

### 5.1 Règles Database
Les règles sont déjà dans `database.rules.json` :
\`\`\`bash
firebase deploy --only database
\`\`\`

### 5.2 Règles Storage
Les règles sont déjà dans `storage.rules` :
\`\`\`bash
firebase deploy --only storage
\`\`\`

## 📊 Étape 6: Monitoring

### 6.1 Quotas à surveiller
- **Realtime Database**: 100 connexions simultanées (gratuit)
- **Hosting**: 360 MB/jour transfert (gratuit)
- **Storage**: 5 GB stockage (gratuit)

### 6.2 Analytics
1. Firebase Console → **Analytics**
2. Surveillez l'utilisation quotidienne
3. Configurez des alertes si besoin

## 🚀 Étape 7: Go Live !

Une fois configuré :
1. **Testez** : `https://votre-projet.web.app`
2. **Domaine** : `https://ashradio-direct.com`
3. **SSL** : Automatique avec Firebase ✅
4. **CDN** : Mondial automatique ✅

## 🛠️ Scripts utiles

\`\`\`bash
# Développement local
bun run dev

# Build production
bun run build

# Déploiement complet
firebase deploy

# Déploiement hosting uniquement
firebase deploy --only hosting

# Voir les logs
firebase functions:log
\`\`\`

## 📞 Support

En cas de problème :
1. Vérifiez la console Firebase pour les erreurs
2. Regardez les règles de sécurité
3. Testez avec les quotas gratuits

**Votre chat Ash-Radio sera 100x plus rapide et stable avec Firebase !** 🎧🔥
