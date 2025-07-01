import { database } from "@/lib/firebase";
import {
  child,
  get,
  limitToLast,
  off,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { useCallback, useEffect, useState } from "react";

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: "admin" | "moderator" | "user";
  color: string;
  status: "online" | "away" | "offline";
  currentChannel?: string;
  lastSeen?: number;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  type: "text" | "image" | "system";
  timestamp: number;
  channel: string;
  userRole?: "admin" | "moderator" | "user";
  imageUrl?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  topic: string;
  isDefault?: boolean;
  color: string;
  memberCount: number;
  createdAt?: number;
}

export interface TypingUser {
  userId: string;
  username: string;
  channel: string;
  timestamp: number;
}

// Configuration des rôles Ash-Radio
const ASH_RADIO_STAFF = {
  ashley: "admin",
  elsa: "admin",
  zoe: "admin",
  chloe: "admin",
  ludomix: "admin",
  "dj fredj": "moderator",
  kisslove: "moderator",
};

const getUserRole = (username: string): "admin" | "moderator" | "user" => {
  const lowerUsername = username.toLowerCase();
  return (
    ASH_RADIO_STAFF[lowerUsername as keyof typeof ASH_RADIO_STAFF] || "user"
  );
};

const getUserColor = (role: "admin" | "moderator" | "user"): string => {
  switch (role) {
    case "admin":
      return "#DC2626";
    case "moderator":
      return "#7C3AED";
    default:
      return "#3B82F6";
  }
};

// Channels par défaut
const DEFAULT_CHANNELS: Omit<Channel, "memberCount">[] = [
  {
    id: "general",
    name: "#general",
    description: "Canal principal de la communauté Ash-Radio",
    topic:
      "🎧 Bienvenue sur Ash-Radio ! Discutez, partagez et profitez de la musique ensemble !",
    isDefault: true,
    color: "#3B82F6",
  },
  {
    id: "musique",
    name: "#musique",
    description: "Partagez vos découvertes musicales et coups de cœur",
    topic: "🎵 Tout sur la musique : découvertes, recommandations, clips !",
    isDefault: false,
    color: "#10B981",
  },
  {
    id: "radio",
    name: "#radio",
    description: "Discussions sur les émissions et contenus radio",
    topic: "📻 Parlons radio ! Émissions, programmation, suggestions...",
    isDefault: false,
    color: "#F59E0B",
  },
  {
    id: "detente",
    name: "#détente",
    description: "Canal pour discussions détendues et hors-sujet",
    topic: "☕ Zone détente pour papoter de tout et de rien !",
    isDefault: false,
    color: "#8B5CF6",
  },
  {
    id: "vocal",
    name: "#vocal",
    description: "Messages vocaux et discussions audio",
    topic: "🎤 Exprimez-vous avec des messages vocaux !",
    isDefault: false,
    color: "#EF4444",
  },
];

export const useFirebaseChat = (
  user: { id: string; username: string; role: string } | null,
) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string>("general");
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  // Initialiser les channels par défaut
  const initializeChannels = useCallback(async () => {
    try {
      const channelsRef = ref(database, "channels");
      const snapshot = await get(channelsRef);

      if (!snapshot.exists()) {
        // Créer les channels par défaut
        for (const channel of DEFAULT_CHANNELS) {
          await set(ref(database, `channels/${channel.id}`), {
            ...channel,
            createdAt: serverTimestamp(),
            memberCount: 0,
          });
        }
      }
    } catch (error) {
      console.error("Erreur initialisation channels:", error);
    }
  }, []);

  // Écouter les channels
  useEffect(() => {
    initializeChannels();

    const channelsRef = ref(database, "channels");
    const unsubscribe = onValue(channelsRef, (snapshot) => {
      if (snapshot.exists()) {
        const channelsData = snapshot.val();
        const channelsList = Object.keys(channelsData).map((key) => ({
          ...channelsData[key],
          id: key,
          memberCount: channelsData[key].memberCount || 0,
        }));
        setChannels(channelsList);
        setConnected(true);
      }
    });

    return () => off(channelsRef, "value", unsubscribe);
  }, [initializeChannels]);

  // Écouter les messages du channel actuel
  useEffect(() => {
    if (!currentChannel) return;

    const messagesRef = query(
      ref(database, `messages/${currentChannel}`),
      orderByChild("timestamp"),
      limitToLast(50),
    );

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesList = Object.keys(messagesData)
          .map((key) => ({
            ...messagesData[key],
            id: key,
            timestamp: messagesData[key].timestamp || Date.now(),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => off(messagesRef, "value", unsubscribe);
  }, [currentChannel]);

  // Écouter les utilisateurs du channel actuel
  useEffect(() => {
    if (!currentChannel) return;

    const usersRef = ref(database, `channelUsers/${currentChannel}`);
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersList = Object.keys(usersData).map((key) => ({
          ...usersData[key],
          id: key,
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
    });

    return () => off(usersRef, "value", unsubscribe);
  }, [currentChannel]);

  // Gérer la présence utilisateur
  useEffect(() => {
    if (!user) return;

    const userRole = getUserRole(user.username);
    const userColor = getUserColor(userRole);

    const userPresence = {
      id: user.id,
      username: user.username,
      avatar: user.username.charAt(0).toUpperCase(),
      role: userRole,
      color: userColor,
      status: "online" as const,
      currentChannel,
      lastSeen: serverTimestamp(),
    };

    // Ajouter l'utilisateur au channel actuel
    const userRef = ref(database, `channelUsers/${currentChannel}/${user.id}`);
    set(userRef, userPresence);

    // Message de bienvenue
    if (currentChannel === "general") {
      const welcomeMessage = {
        userId: "system",
        username: "Ash-Radio",
        content: `🎧 ${user.username} vient de rejoindre la radio ! Bienvenue dans la communauté !`,
        type: "system" as const,
        timestamp: serverTimestamp(),
        channel: currentChannel,
      };

      push(ref(database, `messages/${currentChannel}`), welcomeMessage);
    }

    // Cleanup à la déconnexion
    return () => {
      if (user) {
        set(ref(database, `channelUsers/${currentChannel}/${user.id}`), null);
      }
    };
  }, [user, currentChannel]);

  // Écouter les indicateurs de frappe
  useEffect(() => {
    if (!currentChannel) return;

    const typingRef = ref(database, `typing/${currentChannel}`);
    const unsubscribe = onValue(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const typingData = snapshot.val();
        const now = Date.now();
        const activeTyping = Object.keys(typingData)
          .filter((userId) => {
            const typingInfo = typingData[userId];
            return typingInfo && now - typingInfo.timestamp < 3000; // 3 secondes
          })
          .map((userId) => ({
            ...typingData[userId],
            userId,
          }));
        setTypingUsers(activeTyping);
      } else {
        setTypingUsers([]);
      }
    });

    return () => off(typingRef, "value", unsubscribe);
  }, [currentChannel]);

  // Fonctions d'action
  const joinChannel = useCallback(
    (channelId: string) => {
      if (!user || channelId === currentChannel) return;

      // Retirer l'utilisateur de l'ancien channel
      set(ref(database, `channelUsers/${currentChannel}/${user.id}`), null);

      // Changer de channel
      setCurrentChannel(channelId);
    },
    [user, currentChannel],
  );

  const sendMessage = useCallback(
    (content: string, type: "text" | "image" = "text", imageUrl?: string) => {
      if (!user || !content.trim()) return;

      const message = {
        userId: user.id,
        username: user.username,
        content: content.trim(),
        type,
        timestamp: serverTimestamp(),
        channel: currentChannel,
        userRole: getUserRole(user.username),
        ...(imageUrl && { imageUrl }),
      };

      push(ref(database, `messages/${currentChannel}`), message);
    },
    [user, currentChannel],
  );

  const startTyping = useCallback(() => {
    if (!user) return;

    const typingInfo = {
      userId: user.id,
      username: user.username,
      channel: currentChannel,
      timestamp: Date.now(),
    };

    set(ref(database, `typing/${currentChannel}/${user.id}`), typingInfo);
  }, [user, currentChannel]);

  const stopTyping = useCallback(() => {
    if (!user) return;

    set(ref(database, `typing/${currentChannel}/${user.id}`), null);
  }, [user, currentChannel]);

  const moderateUser = useCallback(
    (userId: string, action: "warn" | "kick" | "ban", reason?: string) => {
      if (!user) return;

      const moderator = users.find((u) => u.id === user.id);
      const targetUser = users.find((u) => u.id === userId);

      if (!moderator || !targetUser) return;

      // Vérifier les permissions
      const canModerate =
        moderator.role === "admin" ||
        (moderator.role === "moderator" && targetUser.role === "user");

      if (!canModerate) return;

      let actionMessage = "";
      switch (action) {
        case "warn":
          actionMessage = `⚠️ ${targetUser.username} a reçu un avertissement de ${moderator.username}`;
          break;
        case "kick":
          actionMessage = `🚫 ${targetUser.username} a été expulsé par ${moderator.username}`;
          // Retirer l'utilisateur du channel
          set(ref(database, `channelUsers/${currentChannel}/${userId}`), null);
          break;
        case "ban":
          if (moderator.role !== "admin") return;
          actionMessage = `🔨 ${targetUser.username} a été banni définitivement par ${moderator.username}`;
          // Retirer l'utilisateur et l'ajouter à la liste des bannis
          set(ref(database, `channelUsers/${currentChannel}/${userId}`), null);
          set(ref(database, `banned/${userId}`), {
            username: targetUser.username,
            bannedBy: moderator.username,
            reason,
            timestamp: serverTimestamp(),
          });
          break;
      }

      if (reason) {
        actionMessage += ` - Raison: ${reason}`;
      }

      const moderationMessage = {
        userId: "system",
        username: "Ash-Radio",
        content: actionMessage,
        type: "system" as const,
        timestamp: serverTimestamp(),
        channel: currentChannel,
      };

      push(ref(database, `messages/${currentChannel}`), moderationMessage);
    },
    [user, users, currentChannel],
  );

  // Utilitaires
  const getCurrentChannelInfo = useCallback((): Channel | undefined => {
    return channels.find((channel) => channel.id === currentChannel);
  }, [channels, currentChannel]);

  const getTypingUsernames = useCallback((): string[] => {
    return typingUsers
      .filter((user) => user.channel === currentChannel)
      .map((user) => user.username);
  }, [typingUsers, currentChannel]);

  return {
    connected,
    messages,
    users,
    channels,
    currentChannel,
    typingUsers: typingUsers.filter((user) => user.channel === currentChannel),

    // Actions
    sendMessage,
    joinChannel,
    startTyping,
    stopTyping,
    moderateUser,

    // Utilities
    getCurrentChannelInfo,
    getTypingUsernames,
  };
};
