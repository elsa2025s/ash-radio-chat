# 🚀 Déploiement Ash-Radio Chat sur Ionos

## 📋 Instructions de déploiement

### 🔧 Méthode 1: Test hébergement mutualisé

1. **Upload des fichiers statiques:**
   ```
   - Uploadez tous les fichiers de ce dossier via SFTP
   - Placez-les dans votre dossier web (généralement `/` ou `/public_html/`)
   ```

2. **Configuration:**
   - Renommez `index.html` en `chatroom.html`
   - Créez un lien depuis ashradio-direct.com/chatroom

### 🛠️ Méthode 2: VPS Ionos (Recommandé)

Si l'hébergement mutualisé ne supporte pas Node.js:

1. **Commandez un VPS Ionos** (5-10€/mois)
2. **Installation Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Déploiement complet:**
   ```bash
   cd /var/www/
   # Uploadez tous les fichiers
   npm install
   node server.js
   ```

### 🌐 Configuration DNS

Pour `chat.ashradio-direct.com`:
- Type: A
- Nom: chat
- Valeur: IP de votre serveur

### ⚡ Test rapide

Ouvrez `index.html` dans un navigateur pour tester l'interface !

## 📞 Support

Si vous avez des questions, contactez-moi ! 🎧
