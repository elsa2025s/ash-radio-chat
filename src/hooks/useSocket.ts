import { useEffect, useRef, useState } from "react";
import io, { type Socket } from "socket.io-client";

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: "admin" | "moderator" | "user";
  color: string;
  status: "online" | "away" | "offline";
  currentChannel?: string;
}

export interface Message {
  id: number;
  userId: string;
  username: string;
  content: string;
  type: "text" | "image" | "system";
  timestamp: Date;
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
  createdAt?: Date;
}

export interface TypingUser {
  userId: string;
  username: string;
  channel: string;
}

export const useSocket = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string>("general");
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:3001", {
        auth: { token },
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("🎧 Connecté au serveur Ash-Radio");
        setConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("👋 Déconnecté du serveur Ash-Radio");
        setConnected(false);
      });

      // Gestion des channels
      newSocket.on("channels_list", (channelsList: Channel[]) => {
        console.log("📺 Channels reçus:", channelsList);
        setChannels(channelsList);
      });

      newSocket.on(
        "channel_changed",
        (data: { channelId: string; channelName: string }) => {
          console.log(`🔄 Channel changé vers: ${data.channelName}`);
          setCurrentChannel(data.channelId);
          setMessages([]); // Vider les messages précédents
          setTypingUsers([]); // Vider les utilisateurs en train de taper
        },
      );

      // Gestion des messages
      newSocket.on("message_history", (history: Message[]) => {
        console.log(`📜 Historique reçu: ${history.length} messages`);
        setMessages(
          history.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        );
      });

      newSocket.on("new_message", (message: Message) => {
        console.log("💬 Nouveau message:", message);
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            timestamp: new Date(message.timestamp),
          },
        ]);
      });

      // Gestion des utilisateurs par channel
      newSocket.on("channel_users_update", (channelUsers: User[]) => {
        console.log(`👥 Utilisateurs du channel: ${channelUsers.length}`);
        setUsers(channelUsers);
      });

      // Gestion du typing
      newSocket.on("user_typing", (data: TypingUser) => {
        setTypingUsers((prev) => {
          const filtered = prev.filter((u) => u.userId !== data.userId);
          return [...filtered, data];
        });
      });

      newSocket.on("user_stop_typing", (data: TypingUser) => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      });

      // Gestion des erreurs
      newSocket.on("error", (error: { message: string }) => {
        console.error("❌ Erreur WebSocket:", error.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  // Fonction pour rejoindre un channel
  const joinChannel = (channelId: string) => {
    if (socket && channelId !== currentChannel) {
      console.log(`🔄 Changement vers le channel: ${channelId}`);
      socket.emit("join_channel", { channelId });
    }
  };

  // Fonction pour envoyer un message
  const sendMessage = (
    content: string,
    type: "text" | "image" = "text",
    imageUrl?: string,
  ) => {
    if (socket && content.trim()) {
      const messageData = {
        content: content.trim(),
        type,
        channel: currentChannel,
        ...(imageUrl && { imageUrl }),
      };

      console.log("📤 Envoi message:", messageData);
      socket.emit("send_message", messageData);
    }
  };

  // Fonction pour démarrer le typing
  const startTyping = () => {
    if (socket) {
      socket.emit("typing_start", { channel: currentChannel });

      // Auto-stop après 3 secondes
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    }
  };

  // Fonction pour arrêter le typing
  const stopTyping = () => {
    if (socket) {
      socket.emit("typing_stop", { channel: currentChannel });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  // Fonction pour modérer un utilisateur
  const moderateUser = (
    userId: string,
    action: "warn" | "kick" | "ban",
    reason?: string,
  ) => {
    if (socket) {
      console.log(`🛡️ Modération: ${action} sur ${userId}`);
      socket.emit("moderate_user", {
        userId,
        action,
        reason,
        channel: currentChannel,
      });
    }
  };

  // Obtenir les informations du channel actuel
  const getCurrentChannelInfo = (): Channel | undefined => {
    return channels.find((channel) => channel.id === currentChannel);
  };

  // Obtenir le nombre d'utilisateurs en train de taper
  const getTypingCount = (): number => {
    return typingUsers.filter((user) => user.channel === currentChannel).length;
  };

  // Obtenir les noms des utilisateurs en train de taper
  const getTypingUsernames = (): string[] => {
    return typingUsers
      .filter((user) => user.channel === currentChannel)
      .map((user) => user.username);
  };

  return {
    socket,
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
    getTypingCount,
    getTypingUsernames,
  };
};
