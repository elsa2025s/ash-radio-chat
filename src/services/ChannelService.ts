import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  THEMATIC = "THEMATIC",
  VOICE = "VOICE",
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  topic?: string;
  type: ChannelType;
  isPrivate: boolean;
  ownerId: string;
  maxMembers?: number;
  slowMode?: number;
  memberCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelMember {
  userId: string;
  channelId: string;
  canWrite: boolean;
  canInvite: boolean;
  isMuted: boolean;
  muteUntil?: Date;
  joinedAt: Date;
}

export class ChannelService {
  // Channels par défaut d'Ash-Radio
  static readonly DEFAULT_CHANNELS = [
    {
      name: "#general",
      description: "Canal principal de la communauté Ash-Radio",
      topic:
        "🎧 Bienvenue sur Ash-Radio ! Discutez, partagez et profitez de la musique ensemble !",
      type: ChannelType.PUBLIC,
      isPrivate: false,
    },
    {
      name: "#musique",
      description: "Partagez vos découvertes musicales et coups de cœur",
      topic: "🎵 Tout sur la musique : découvertes, recommandations, clips !",
      type: ChannelType.THEMATIC,
      isPrivate: false,
    },
    {
      name: "#radio",
      description: "Discussions sur les émissions et contenus radio",
      topic: "📻 Parlons radio ! Émissions, programmation, suggestions...",
      type: ChannelType.THEMATIC,
      isPrivate: false,
    },
    {
      name: "#détente",
      description: "Canal pour discussions détendues et hors-sujet",
      topic: "☕ Zone détente pour papoter de tout et de rien !",
      type: ChannelType.PUBLIC,
      isPrivate: false,
    },
    {
      name: "#vocal",
      description: "Messages vocaux et discussions audio",
      topic: "🎤 Exprimez-vous avec des messages vocaux !",
      type: ChannelType.VOICE,
      isPrivate: false,
    },
  ];

  // Créer un nouveau channel
  static async createChannel(data: {
    name: string;
    description?: string;
    topic?: string;
    type: ChannelType;
    isPrivate: boolean;
    ownerId: string;
    password?: string;
    maxMembers?: number;
  }): Promise<Channel> {
    try {
      const channel = await prisma.channel.create({
        data: {
          name: data.name.startsWith("#") ? data.name : `#${data.name}`,
          description: data.description,
          topic: data.topic,
          type: data.type,
          isPrivate: data.isPrivate,
          ownerId: data.ownerId,
          password: data.password,
          maxMembers: data.maxMembers || 100,
        },
      });

      // Ajouter automatiquement le créateur comme membre
      await this.addMember(channel.id, data.ownerId, {
        canWrite: true,
        canInvite: true,
        isMuted: false,
      });

      return channel;
    } catch (error) {
      throw new Error(`Erreur lors de la création du channel: ${error}`);
    }
  }

  // Obtenir tous les channels publics
  static async getPublicChannels(): Promise<Channel[]> {
    try {
      const channels = await prisma.channel.findMany({
        where: {
          isPrivate: false,
          isActive: true,
        },
        include: {
          _count: {
            select: { members: true },
          },
        },
        orderBy: { name: "asc" },
      });

      return channels.map((channel) => ({
        ...channel,
        memberCount: channel._count.members,
      }));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des channels: ${error}`);
    }
  }

  // Obtenir les channels d'un utilisateur
  static async getUserChannels(userId: string): Promise<Channel[]> {
    try {
      const memberChannels = await prisma.channelMember.findMany({
        where: { userId },
        include: {
          channel: {
            include: {
              _count: {
                select: { members: true },
              },
            },
          },
        },
      });

      return memberChannels
        .filter((member) => member.channel.isActive)
        .map((member) => ({
          ...member.channel,
          memberCount: member.channel._count.members,
        }));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des channels utilisateur: ${error}`,
      );
    }
  }

  // Rejoindre un channel
  static async joinChannel(
    channelId: string,
    userId: string,
    password?: string,
  ): Promise<ChannelMember> {
    try {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: { _count: { select: { members: true } } },
      });

      if (!channel || !channel.isActive) {
        throw new Error("Channel introuvable ou inactif");
      }

      // Vérifier le mot de passe si nécessaire
      if (channel.password && channel.password !== password) {
        throw new Error("Mot de passe incorrect");
      }

      // Vérifier la limite de membres
      if (channel.maxMembers && channel._count.members >= channel.maxMembers) {
        throw new Error("Channel plein");
      }

      // Vérifier si l'utilisateur n'est pas déjà membre
      const existingMember = await prisma.channelMember.findUnique({
        where: {
          userId_channelId: {
            userId,
            channelId,
          },
        },
      });

      if (existingMember) {
        throw new Error("Utilisateur déjà membre du channel");
      }

      return await this.addMember(channelId, userId);
    } catch (error) {
      throw new Error(`Erreur lors de l'adhésion au channel: ${error}`);
    }
  }

  // Ajouter un membre
  static async addMember(
    channelId: string,
    userId: string,
    permissions?: Partial<ChannelMember>,
  ): Promise<ChannelMember> {
    try {
      return await prisma.channelMember.create({
        data: {
          userId,
          channelId,
          canWrite: permissions?.canWrite ?? true,
          canInvite: permissions?.canInvite ?? false,
          isMuted: permissions?.isMuted ?? false,
          muteUntil: permissions?.muteUntil,
        },
      });
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout du membre: ${error}`);
    }
  }

  // Quitter un channel
  static async leaveChannel(channelId: string, userId: string): Promise<void> {
    try {
      await prisma.channelMember.delete({
        where: {
          userId_channelId: {
            userId,
            channelId,
          },
        },
      });
    } catch (error) {
      throw new Error(`Erreur lors de la sortie du channel: ${error}`);
    }
  }

  // Obtenir les membres d'un channel
  static async getChannelMembers(channelId: string): Promise<any[]> {
    try {
      const members = await prisma.channelMember.findMany({
        where: { channelId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              role: true,
              level: true,
              lastSeen: true,
            },
          },
        },
        orderBy: [
          { user: { role: "asc" } }, // Admins d'abord
          { user: { level: "desc" } }, // Puis par niveau
          { joinedAt: "asc" }, // Puis par ancienneté
        ],
      });

      return members.map((member) => ({
        ...member.user,
        channelPermissions: {
          canWrite: member.canWrite,
          canInvite: member.canInvite,
          isMuted: member.isMuted,
          muteUntil: member.muteUntil,
        },
        joinedAt: member.joinedAt,
      }));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des membres: ${error}`);
    }
  }

  // Créer une invitation
  static async createInvitation(
    channelId: string,
    senderId: string,
    receiverUsername: string,
    message?: string,
    expiresInHours = 24,
  ): Promise<any> {
    try {
      // Trouver l'utilisateur destinataire
      const receiver = await prisma.user.findUnique({
        where: { username: receiverUsername },
      });

      if (!receiver) {
        throw new Error("Utilisateur destinataire introuvable");
      }

      // Vérifier que le sender peut inviter
      const senderMember = await prisma.channelMember.findUnique({
        where: {
          userId_channelId: {
            userId: senderId,
            channelId,
          },
        },
      });

      if (!senderMember || !senderMember.canInvite) {
        throw new Error("Permissions insuffisantes pour inviter");
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      return await prisma.channelInvitation.create({
        data: {
          channelId,
          senderId,
          receiverId: receiver.id,
          message,
          expiresAt,
        },
        include: {
          sender: { select: { username: true } },
          receiver: { select: { username: true } },
          channel: { select: { name: true, description: true } },
        },
      });
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'invitation: ${error}`);
    }
  }

  // Initialiser les channels par défaut
  static async initializeDefaultChannels(ownerId: string): Promise<void> {
    try {
      for (const channelData of this.DEFAULT_CHANNELS) {
        const existingChannel = await prisma.channel.findUnique({
          where: { name: channelData.name },
        });

        if (!existingChannel) {
          await this.createChannel({
            ...channelData,
            ownerId,
          });
          console.log(`✅ Channel ${channelData.name} créé`);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des channels:", error);
    }
  }

  // Mettre à jour les permissions d'un membre
  static async updateMemberPermissions(
    channelId: string,
    userId: string,
    permissions: Partial<ChannelMember>,
  ): Promise<ChannelMember> {
    try {
      return await prisma.channelMember.update({
        where: {
          userId_channelId: {
            userId,
            channelId,
          },
        },
        data: permissions,
      });
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour des permissions: ${error}`,
      );
    }
  }

  // Mute/Unmute un utilisateur dans un channel
  static async muteUser(
    channelId: string,
    userId: string,
    muteUntil?: Date,
  ): Promise<void> {
    try {
      await this.updateMemberPermissions(channelId, userId, {
        isMuted: true,
        muteUntil,
      });
    } catch (error) {
      throw new Error(`Erreur lors du mute: ${error}`);
    }
  }

  static async unmuteUser(channelId: string, userId: string): Promise<void> {
    try {
      await this.updateMemberPermissions(channelId, userId, {
        isMuted: false,
        muteUntil: null,
      });
    } catch (error) {
      throw new Error(`Erreur lors de l'unmute: ${error}`);
    }
  }
}

export default ChannelService;
