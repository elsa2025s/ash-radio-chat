const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://*.same-app.com", "https://*.netlify.app", "https://ashradio-direct.com"],
    methods: ["GET", "POST"]
  }
});

// Base de données en mémoire pour Ash-Radio
const users = new Map();
const activeUsers = new Map();

// Système de channels multi-canaux
const channels = new Map();
const channelMessages = new Map(); // Messages par channel
const channelUsers = new Map(); // Utilisateurs par channel

// Initialiser les channels par défaut d'Ash-Radio
const DEFAULT_CHANNELS = [
  {
    id: 'general',
    name: '#general',
    description: 'Canal principal de la communauté Ash-Radio',
    topic: '🎧 Bienvenue sur Ash-Radio ! Discutez, partagez et profitez de la musique ensemble !',
    isDefault: true,
    color: '#3B82F6'
  },
  {
    id: 'musique',
    name: '#musique',
    description: 'Partagez vos découvertes musicales et coups de cœur',
    topic: '🎵 Tout sur la musique : découvertes, recommandations, clips !',
    isDefault: false,
    color: '#10B981'
  },
  {
    id: 'radio',
    name: '#radio',
    description: 'Discussions sur les émissions et contenus radio',
    topic: '📻 Parlons radio ! Émissions, programmation, suggestions...',
    isDefault: false,
    color: '#F59E0B'
  },
  {
    id: 'detente',
    name: '#détente',
    description: 'Canal pour discussions détendues et hors-sujet',
    topic: '☕ Zone détente pour papoter de tout et de rien !',
    isDefault: false,
    color: '#8B5CF6'
  },
  {
    id: 'vocal',
    name: '#vocal',
    description: 'Messages vocaux et discussions audio',
    topic: '🎤 Exprimez-vous avec des messages vocaux !',
    isDefault: false,
    color: '#EF4444'
  }
];

// Initialiser les channels
DEFAULT_CHANNELS.forEach(channel => {
  channels.set(channel.id, {
    ...channel,
    createdAt: new Date(),
    memberCount: 0
  });
  channelMessages.set(channel.id, []);
  channelUsers.set(channel.id, new Set());
});

// Configuration des rôles Ash-Radio
const ASH_RADIO_STAFF = {
  // Admins
  'ashley': 'admin',
  'elsa': 'admin',
  'zoe': 'admin',
  'chloe': 'admin',
  'ludomix': 'admin',

  // Modérateurs
  'dj fredj': 'moderator',
  'kisslove': 'moderator'
};

const getUserRole = (username) => {
  const lowerUsername = username.toLowerCase();
  return ASH_RADIO_STAFF[lowerUsername] || 'user';
};

const getUserColor = (role) => {
  switch(role) {
    case 'admin': return '#DC2626'; // Rouge pour les admins
    case 'moderator': return '#7C3AED'; // Violet pour les modérateurs
    default: return '#3B82F6'; // Bleu pour les utilisateurs
  }
};

// Middleware d'authentification
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Token manquant'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    socket.username = decoded.username;
    socket.userRole = getUserRole(decoded.username);
    socket.currentChannel = 'general'; // Channel par défaut
    next();
  } catch (err) {
    next(new Error('Token invalide'));
  }
};

io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`🎧 Auditeur Ash-Radio connecté: ${socket.username} (${socket.userRole}) - ${socket.id}`);

  // Ajouter l'utilisateur aux utilisateurs actifs
  const user = {
    id: socket.userId,
    username: socket.username,
    socketId: socket.id,
    status: 'online',
    role: socket.userRole,
    avatar: socket.username.charAt(0).toUpperCase(),
    color: getUserColor(socket.userRole),
    currentChannel: socket.currentChannel,
    joinedAt: new Date()
  };

  activeUsers.set(socket.userId, user);

  // Rejoindre le channel par défaut
  socket.join(socket.currentChannel);
  channelUsers.get(socket.currentChannel).add(socket.userId);

  // Envoyer les informations des channels
  socket.emit('channels_list', Array.from(channels.values()).map(channel => ({
    ...channel,
    memberCount: channelUsers.get(channel.id).size
  })));

  // Message de bienvenue système dans le channel général
  const welcomeMessage = {
    id: Date.now(),
    userId: 'system',
    username: 'Ash-Radio',
    content: `🎧 ${socket.username} vient de rejoindre la radio ! Bienvenue dans la communauté !`,
    type: 'system',
    timestamp: new Date(),
    channel: socket.currentChannel
  };

  const generalMessages = channelMessages.get(socket.currentChannel);
  generalMessages.push(welcomeMessage);
  io.to(socket.currentChannel).emit('new_message', welcomeMessage);

  // Envoyer la liste des utilisateurs connectés au channel actuel
  const channelUsersList = Array.from(channelUsers.get(socket.currentChannel))
    .map(userId => activeUsers.get(userId))
    .filter(Boolean);
  socket.emit('channel_users_update', channelUsersList);

  // Envoyer l'historique des messages du channel actuel
  socket.emit('message_history', generalMessages.slice(-50));

  // Gestion du changement de channel
  socket.on('join_channel', (data) => {
    const { channelId } = data;

    if (!channels.has(channelId)) {
      socket.emit('error', { message: 'Channel inexistant' });
      return;
    }

    // Quitter l'ancien channel
    const oldChannel = socket.currentChannel;
    socket.leave(oldChannel);
    channelUsers.get(oldChannel).delete(socket.userId);

    // Rejoindre le nouveau channel
    socket.currentChannel = channelId;
    socket.join(channelId);
    channelUsers.get(channelId).add(socket.userId);

    // Mettre à jour l'utilisateur actif
    const user = activeUsers.get(socket.userId);
    if (user) {
      user.currentChannel = channelId;
    }

    // Envoyer l'historique du nouveau channel
    const channelMsgs = channelMessages.get(channelId);
    socket.emit('message_history', channelMsgs.slice(-50));
    socket.emit('channel_changed', {
      channelId,
      channelName: channels.get(channelId).name
    });

    // Mettre à jour les compteurs de membres pour tous les clients
    io.emit('channels_list', Array.from(channels.values()).map(channel => ({
      ...channel,
      memberCount: channelUsers.get(channel.id).size
    })));

    // Notifier les utilisateurs du nouveau channel
    const channelUsersList = Array.from(channelUsers.get(channelId))
      .map(userId => activeUsers.get(userId))
      .filter(Boolean);
    io.to(channelId).emit('channel_users_update', channelUsersList);

    console.log(`🔄 ${socket.username} a rejoint ${channels.get(channelId).name}`);
  });

  // Gestion des nouveaux messages (maintenant par channel)
  socket.on('send_message', (data) => {
    const message = {
      id: Date.now(),
      userId: socket.userId,
      username: socket.username,
      content: data.content,
      type: data.type || 'text',
      timestamp: new Date(),
      channel: socket.currentChannel,
      userRole: socket.userRole
    };

    if (data.imageUrl) {
      message.imageUrl = data.imageUrl;
    }

    // Ajouter le message aux messages du channel
    const channelMsgs = channelMessages.get(socket.currentChannel);
    channelMsgs.push(message);

    // Envoyer uniquement aux utilisateurs du même channel
    io.to(socket.currentChannel).emit('new_message', message);

    console.log(`💬 Message de ${socket.username} dans ${channels.get(socket.currentChannel).name}: ${data.content}`);
  });

  // Gestion du typing indicator (par channel)
  socket.on('typing_start', (data) => {
    socket.to(socket.currentChannel).emit('user_typing', {
      userId: socket.userId,
      username: socket.username,
      channel: socket.currentChannel
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(socket.currentChannel).emit('user_stop_typing', {
      userId: socket.userId,
      username: socket.username,
      channel: socket.currentChannel
    });
  });

  // Gestion de la modération (admins et modérateurs)
  socket.on('moderate_user', (data) => {
    const { userId, action, reason, channel } = data;
    const moderator = activeUsers.get(socket.userId);
    const targetUser = activeUsers.get(userId);

    if (!moderator || !targetUser) return;

    // Vérifier les permissions
    const canModerate = moderator.role === 'admin' ||
                       (moderator.role === 'moderator' && targetUser.role === 'user');

    if (!canModerate) {
      socket.emit('error', { message: 'Permissions insuffisantes' });
      return;
    }

    let actionMessage = '';
    switch(action) {
      case 'warn':
        actionMessage = `⚠️ ${targetUser.username} a reçu un avertissement de ${moderator.username}`;
        break;
      case 'kick':
        actionMessage = `🚫 ${targetUser.username} a été expulsé par ${moderator.username}`;
        // Déconnecter l'utilisateur
        const targetSocket = io.sockets.sockets.get(targetUser.socketId);
        if (targetSocket) {
          targetSocket.disconnect();
        }
        break;
      case 'ban':
        if (moderator.role !== 'admin') {
          socket.emit('error', { message: 'Seuls les admins peuvent bannir' });
          return;
        }
        actionMessage = `🔨 ${targetUser.username} a été banni définitivement par ${moderator.username}`;
        // Déconnecter et marquer comme banni
        const bannedSocket = io.sockets.sockets.get(targetUser.socketId);
        if (bannedSocket) {
          bannedSocket.disconnect();
        }
        break;
    }

    if (reason) {
      actionMessage += ` - Raison: ${reason}`;
    }

    const moderationMessage = {
      id: Date.now(),
      userId: 'system',
      username: 'Ash-Radio',
      content: actionMessage,
      type: 'system',
      timestamp: new Date(),
      channel: channel || socket.currentChannel
    };

    const channelMsgs = channelMessages.get(socket.currentChannel);
    channelMsgs.push(moderationMessage);
    io.to(socket.currentChannel).emit('new_message', moderationMessage);

    console.log(`🛡️ Modération par ${moderator.username}: ${actionMessage}`);
  });

  // Gestion de la déconnexion
  socket.on('disconnect', () => {
    console.log(`👋 Auditeur Ash-Radio déconnecté: ${socket.username}`);

    const user = activeUsers.get(socket.userId);
    if (user) {
      // Retirer des channels
      channelUsers.get(socket.currentChannel).delete(socket.userId);

      const disconnectMessage = {
        id: Date.now(),
        userId: 'system',
        username: 'Ash-Radio',
        content: `👋 ${socket.username} a quitté la radio. À bientôt !`,
        type: 'system',
        timestamp: new Date(),
        channel: socket.currentChannel
      };

      const channelMsgs = channelMessages.get(socket.currentChannel);
      channelMsgs.push(disconnectMessage);
      io.to(socket.currentChannel).emit('new_message', disconnectMessage);

      // Mettre à jour les compteurs
      io.emit('channels_list', Array.from(channels.values()).map(channel => ({
        ...channel,
        memberCount: channelUsers.get(channel.id).size
      })));
    }

    activeUsers.delete(socket.userId);
  });
});

// Configuration Express pour les routes d'authentification
const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "https://*.same-app.com", "https://*.netlify.app", "https://ashradio-direct.com"]
}));
app.use(express.json());

// Route d'inscription
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    for (const [id, user] of users) {
      if (user.username.toLowerCase() === username.toLowerCase() || user.email === email) {
        return res.status(400).json({ error: 'Utilisateur ou email déjà existant' });
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userId = Date.now().toString();
    const userRole = getUserRole(username);
    const user = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      avatar: username.charAt(0).toUpperCase(),
      color: getUserColor(userRole),
      role: userRole,
      createdAt: new Date()
    };

    users.set(userId, user);

    // Générer le token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`📝 Nouvelle inscription Ash-Radio: ${username} (${userRole})`);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        color: user.color,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    // Trouver l'utilisateur
    let user = null;
    for (const [id, u] of users) {
      if (u.username.toLowerCase() === username.toLowerCase() || u.email === username) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    // Mettre à jour le rôle au cas où il aurait changé
    user.role = getUserRole(user.username);
    user.color = getUserColor(user.role);

    // Générer le token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`🎧 Connexion Ash-Radio: ${user.username} (${user.role})`);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        color: user.color,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Ash-Radio Multi-Channel Chat Server',
    users: activeUsers.size,
    channels: channels.size,
    totalMessages: Array.from(channelMessages.values()).reduce((total, msgs) => total + msgs.length, 0)
  });
});

// Ajouter Express au serveur HTTP
httpServer.on('request', app);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log('🎧🔥 =======================================');
  console.log('🎧🔥  ASH-RADIO MULTI-CHANNEL CHAT       ');
  console.log('🎧🔥 =======================================');
  console.log(`🎧   Port: ${PORT}`);
  console.log(`🎧   Channels: ${Array.from(channels.keys()).join(', ')}`);
  console.log(`🎧   Site: ashradio-direct.com`);
  console.log(`🎧   Admins: ashley, elsa, zoe, chloe, ludomix`);
  console.log(`🎧   Modérateurs: dj fredj, kisslove`);
  console.log('🎧🔥 =======================================');
});

module.exports = { io, app };
