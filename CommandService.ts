import { PrismaClient } from "@prisma/client";
import ChannelService from "./ChannelService";
import XPService from "./XPService";

const prisma = new PrismaClient();

export interface CommandContext {
  userId: string;
  username: string;
  channelId: string;
  userRole: "ADMIN" | "MODERATOR" | "USER";
  message: string;
  args: string[];
}

export interface CommandResult {
  success: boolean;
  message: string;
  systemMessage?: boolean;
  broadcastToChannel?: boolean;
}

export class CommandService {
  private static commands: Map<
    string,
    (ctx: CommandContext) => Promise<CommandResult>
  > = new Map();

  // Initialiser toutes les commandes
  static initialize() {
    // Commandes de modération
    this.registerCommand("ban", this.banCommand);
    this.registerCommand("kick", this.kickCommand);
    this.registerCommand("mute", this.muteCommand);
    this.registerCommand("unmute", this.unmuteCommand);
    this.registerCommand("warn", this.warnCommand);

    // Commandes de channel
    this.registerCommand("join", this.joinCommand);
    this.registerCommand("part", this.partCommand);
    this.registerCommand("leave", this.partCommand); // Alias
    this.registerCommand("topic", this.topicCommand);
    this.registerCommand("invite", this.inviteCommand);

    // Commandes de gestion des rôles
    this.registerCommand("promote", this.promoteCommand);
    this.registerCommand("demote", this.demoteCommand);

    // Commandes d'information
    this.registerCommand("who", this.whoCommand);
    this.registerCommand("whois", this.whoisCommand);
    this.registerCommand("stats", this.statsCommand);
    this.registerCommand("level", this.levelCommand);
    this.registerCommand("leaderboard", this.leaderboardCommand);
    this.registerCommand("top", this.leaderboardCommand); // Alias

    // Commandes utilitaires
    this.registerCommand("help", this.helpCommand);
    this.registerCommand("time", this.timeCommand);
    this.registerCommand("uptime", this.uptimeCommand);

    console.log(`🎮 ${this.commands.size} commandes IRC chargées`);
  }

  // Registrer une commande
  static registerCommand(
    name: string,
    handler: (ctx: CommandContext) => Promise<CommandResult>,
  ) {
    this.commands.set(name.toLowerCase(), handler);
  }

  // Exécuter une commande
  static async executeCommand(
    message: string,
    userId: string,
    username: string,
    channelId: string,
    userRole: "ADMIN" | "MODERATOR" | "USER",
  ): Promise<CommandResult | null> {
    if (!message.startsWith("/")) {
      return null; // Pas une commande
    }

    const parts = message.slice(1).split(" ");
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const handler = this.commands.get(commandName);
    if (!handler) {
      return {
        success: false,
        message: `❌ Commande '/${commandName}' inconnue. Tapez /help pour voir les commandes disponibles.`,
      };
    }

    try {
      const context: CommandContext = {
        userId,
        username,
        channelId,
        userRole,
        message,
        args,
      };

      return await handler(context);
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur lors de l'exécution de la commande: ${error}`,
      };
    }
  }

  // ===== COMMANDES DE MODÉRATION =====

  static async banCommand(ctx: CommandContext): Promise<CommandResult> {
    if (ctx.userRole !== "ADMIN") {
      return {
        success: false,
        message:
          "❌ Seuls les administrateurs peuvent bannir des utilisateurs.",
      };
    }

    if (ctx.args.length < 1) {
      return {
        success: false,
        message: "❌ Usage: /ban <utilisateur> [raison]",
      };
    }

    const targetUsername = ctx.args[0];
    const reason = ctx.args.slice(1).join(" ") || "Aucune raison spécifiée";

    try {
      const targetUser = await prisma.user.findUnique({
        where: { username: targetUsername },
      });

      if (!targetUser) {
        return {
          success: false,
          message: `❌ Utilisateur '${targetUsername}' introuvable.`,
        };
      }

      if (targetUser.role === "ADMIN" || targetUser.role === "MODERATOR") {
        return {
          success: false,
          message: "❌ Impossible de bannir un administrateur ou modérateur.",
        };
      }

      // Bannir l'utilisateur
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: "BANNED" },
      });

      // Log de modération
      await prisma.moderationLog.create({
        data: {
          action: "BAN",
          reason,
          moderatorId: ctx.userId,
          userId: targetUser.id,
          channelId: ctx.channelId,
        },
      });

      return {
        success: true,
        message: `🔨 ${targetUsername} a été banni définitivement par ${ctx.username}. Raison: ${reason}`,
        systemMessage: true,
        broadcastToChannel: true,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur lors du bannissement: ${error}`,
      };
    }
  }

  static async kickCommand(ctx: CommandContext): Promise<CommandResult> {
    if (ctx.userRole === "USER") {
      return {
        success: false,
        message: "❌ Permissions insuffisantes pour expulser des utilisateurs.",
      };
    }

    if (ctx.args.length < 1) {
      return {
        success: false,
        message: "❌ Usage: /kick <utilisateur> [raison]",
      };
    }

    const targetUsername = ctx.args[0];
    const reason = ctx.args.slice(1).join(" ") || "Aucune raison spécifiée";

    try {
      const targetUser = await prisma.user.findUnique({
        where: { username: targetUsername },
      });

      if (!targetUser) {
        return {
          success: false,
          message: `❌ Utilisateur '${targetUsername}' introuvable.`,
        };
      }

      // Les modérateurs ne peuvent pas kicker d'autres modérateurs ou admins
      if (
        ctx.userRole === "MODERATOR" &&
        (targetUser.role === "ADMIN" || targetUser.role === "MODERATOR")
      ) {
        return {
          success: false,
          message: "❌ Permissions insuffisantes.",
        };
      }

      // Retirer l'utilisateur du channel
      await ChannelService.leaveChannel(ctx.channelId, targetUser.id);

      // Log de modération
      await prisma.moderationLog.create({
        data: {
          action: "KICK",
          reason,
          moderatorId: ctx.userId,
          userId: targetUser.id,
          channelId: ctx.channelId,
        },
      });

      return {
        success: true,
        message: `🚫 ${targetUsername} a été expulsé par ${ctx.username}. Raison: ${reason}`,
        systemMessage: true,
        broadcastToChannel: true,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur lors de l'expulsion: ${error}`,
      };
    }
  }

  static async muteCommand(ctx: CommandContext): Promise<CommandResult> {
    if (ctx.userRole === "USER") {
      return {
        success: false,
        message:
          "❌ Permissions insuffisantes pour rendre muet des utilisateurs.",
      };
    }

    if (ctx.args.length < 1) {
      return {
        success: false,
        message: "❌ Usage: /mute <utilisateur> [durée_en_minutes] [raison]",
      };
    }

    const targetUsername = ctx.args[0];
    const duration = Number.parseInt(ctx.args[1]) || 10; // 10 minutes par défaut
    const reason = ctx.args.slice(2).join(" ") || "Aucune raison spécifiée";

    try {
      const targetUser = await prisma.user.findUnique({
        where: { username: targetUsername },
      });

      if (!targetUser) {
        return {
          success: false,
          message: `❌ Utilisateur '${targetUsername}' introuvable.`,
        };
      }

      if (
        ctx.userRole === "MODERATOR" &&
        (targetUser.role === "ADMIN" || targetUser.role === "MODERATOR")
      ) {
        return {
          success: false,
          message: "❌ Permissions insuffisantes.",
        };
      }

      const muteUntil = new Date();
      muteUntil.setMinutes(muteUntil.getMinutes() + duration);

      await ChannelService.muteUser(ctx.channelId, targetUser.id, muteUntil);

      // Log de modération
      await prisma.moderationLog.create({
        data: {
          action: "MUTE",
          reason,
          duration: duration * 60, // En secondes
          moderatorId: ctx.userId,
          userId: targetUser.id,
          channelId: ctx.channelId,
          expiresAt: muteUntil,
        },
      });

      return {
        success: true,
        message: `🔇 ${targetUsername} a été rendu muet pour ${duration} minutes par ${ctx.username}. Raison: ${reason}`,
        systemMessage: true,
        broadcastToChannel: true,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur lors du mute: ${error}`,
      };
    }
  }

  static async unmuteCommand(ctx: CommandContext): Promise<CommandResult> {
    if (ctx.userRole === "USER") {
      return {
        success: false,
        message: "❌ Permissions insuffisantes.",
      };
    }

    if (ctx.args.length < 1) {
      return {
        success: false,
        message: "❌ Usage: /unmute <utilisateur>",
      };
    }

    const targetUsername = ctx.args[0];

    try {
      const targetUser = await prisma.user.findUnique({
        where: { username: targetUsername },
      });

      if (!targetUser) {
        return {
          success: false,
          message: `❌ Utilisateur '${targetUsername}' introuvable.`,
        };
      }

      await ChannelService.unmuteUser(ctx.channelId, targetUser.id);

      // Log de modération
      await prisma.moderationLog.create({
        data: {
          action: "UNMUTE",
          moderatorId: ctx.userId,
          userId: targetUser.id,
          channelId: ctx.channelId,
        },
      });

      return {
        success: true,
        message: `🔊 ${targetUsername} peut de nouveau parler grâce à ${ctx.username}.`,
        systemMessage: true,
        broadcastToChannel: true,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur lors de l'unmute: ${error}`,
      };
    }
  }

  static async warnCommand(ctx: CommandContext): Promise<CommandResult> {
    if (ctx.userRole === "USER") {
      return {
        success: false,
        message: "❌ Permissions insuffisantes.",
      };
    }

    if (ctx.args.length < 1) {
      return {
        success: false,
        message: "❌ Usage: /warn <utilisateur> [raison]",
      };
    }

    const targetUsername = ctx.args[0];
    const reason = ctx.args.slice(1).join(" ") || "Aucune raison spécifiée";

    try {
      const targetUser = await prisma.user.findUnique({
        where: { username: targetUsername },
      });

      if (!targetUser) {
        return {
          success: false,
          message: `❌ Utilisateur '${targetUsername}' introuvable.`,
        };
      }

      // Log de modération
      await prisma.moderationLog.create({
        data: {
          action: "WARN",
          reason,
          moderatorId: ctx.userId,
          userId: targetUser.id,
          channelId: ctx.channelId,
        },
      });

      return {
        success: true,
        message: `⚠️ ${targetUsername} a reçu un avertissement de ${ctx.username}. Raison: ${reason}`,
        systemMessage: true,
        broadcastToChannel: true,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur lors de l'avertissement: ${error}`,
      };
    }
  }

  // ===== COMMANDES DE CHANNEL =====

  static async joinCommand(ctx: CommandContext): Promise<CommandResult> {
    if (ctx.args.length < 1) {
      return {
        success: false,
        message: "❌ Usage: /join <#channel> [mot_de_passe]",
      };
    }

    const channelName = ctx.args[0].startsWith("#")
      ? ctx.args[0]
      : `#${ctx.args[0]}`;
    const password = ctx.args[1];

    try {
      const channel = await prisma.channel.findUnique({
        where: { name: channelName },
      });

      if (!channel) {
        return {
          success: false,
          message: `❌ Channel '${channelName}' introuvable.`,
        };
      }

      await ChannelService.joinChannel(channel.id, ctx.userId, password);

      return {
        success: true,
        message: `✅ Vous avez rejoint ${channelName}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Impossible de rejoindre ${channelName}: ${error}`,
      };
    }
  }

  static async partCommand(ctx: CommandContext): Promise<CommandResult> {
    try {
      await ChannelService.leaveChannel(ctx.channelId, ctx.userId);

      return {
        success: true,
        message: `👋 ${ctx.username} a quitté le channel.`,
        systemMessage: true,
        broadcastToChannel: true,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur lors de la sortie: ${error}`,
      };
    }
  }

  // ===== COMMANDES D'INFORMATION =====

  static async whoCommand(ctx: CommandContext): Promise<CommandResult> {
    try {
      const members = await ChannelService.getChannelMembers(ctx.channelId);
      const channel = await prisma.channel.findUnique({
        where: { id: ctx.channelId },
      });

      const membersList = members
        .map((member) => {
          const roleEmoji =
            member.role === "ADMIN"
              ? "👑"
              : member.role === "MODERATOR"
                ? "🛡️"
                : "👤";
          const statusEmoji = member.channelPermissions?.isMuted ? "🔇" : "";
          return `${roleEmoji} ${member.username} (niveau ${member.level}) ${statusEmoji}`;
        })
        .join("\n");

      return {
        success: true,
        message: `📋 **${channel?.name}** (${members.length} membres):\n${membersList}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur: ${error}`,
      };
    }
  }

  static async statsCommand(ctx: CommandContext): Promise<CommandResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: ctx.userId },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      });

      if (!user) {
        return { success: false, message: "❌ Utilisateur introuvable." };
      }

      const nextLevelXP = XPService.getXPForLevel(user.level + 1);
      const currentLevelXP = XPService.getXPForLevel(user.level);
      const progress = user.xp - currentLevelXP;
      const needed = nextLevelXP - currentLevelXP;

      return {
        success: true,
        message:
          `📊 **Statistiques de ${user.username}**\n` +
          `Niveau: ${user.level} (${user.xp} XP)\n` +
          `Progrès: ${progress}/${needed} XP vers le niveau ${user.level + 1}\n` +
          `Messages envoyés: ${user._count.messages}\n` +
          `Réputation: ${user.reputation}\n` +
          `Membre depuis: ${user.joinedAt.toLocaleDateString("fr-FR")}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur: ${error}`,
      };
    }
  }

  static async leaderboardCommand(ctx: CommandContext): Promise<CommandResult> {
    try {
      const topUsers = await prisma.user.findMany({
        where: {
          role: { not: "BANNED" },
        },
        orderBy: [{ level: "desc" }, { xp: "desc" }],
        take: 10,
        select: {
          username: true,
          level: true,
          xp: true,
          role: true,
        },
      });

      const leaderboard = topUsers
        .map((user, index) => {
          const medal =
            index === 0
              ? "🥇"
              : index === 1
                ? "🥈"
                : index === 2
                  ? "🥉"
                  : `${index + 1}.`;
          const roleEmoji =
            user.role === "ADMIN" ? "👑" : user.role === "MODERATOR" ? "🛡️" : "";
          return `${medal} ${user.username} ${roleEmoji} - Niveau ${user.level} (${user.xp} XP)`;
        })
        .join("\n");

      return {
        success: true,
        message: `🏆 **Classement Ash-Radio**\n${leaderboard}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Erreur: ${error}`,
      };
    }
  }

  static async helpCommand(ctx: CommandContext): Promise<CommandResult> {
    const userCommands = [
      "/help - Affiche cette aide",
      "/who - Liste les membres du channel",
      "/stats - Vos statistiques",
      "/level - Votre niveau actuel",
      "/top - Classement des utilisateurs",
      "/join <#channel> - Rejoindre un channel",
      "/part - Quitter le channel actuel",
    ];

    const modCommands = [
      "/warn <user> [raison] - Avertir un utilisateur",
      "/mute <user> [minutes] [raison] - Rendre muet",
      "/unmute <user> - Lever le mute",
      "/kick <user> [raison] - Expulser du channel",
    ];

    const adminCommands = [
      "/ban <user> [raison] - Bannir définitivement",
      "/promote <user> - Promouvoir modérateur",
      "/demote <user> - Rétrograder utilisateur",
    ];

    let helpText = `📖 **Commandes Ash-Radio**\n\n**Commandes utilisateur:**\n${userCommands.join("\n")}`;

    if (ctx.userRole === "MODERATOR" || ctx.userRole === "ADMIN") {
      helpText += `\n\n**Commandes modérateur:**\n${modCommands.join("\n")}`;
    }

    if (ctx.userRole === "ADMIN") {
      helpText += `\n\n**Commandes administrateur:**\n${adminCommands.join("\n")}`;
    }

    return {
      success: true,
      message: helpText,
    };
  }

  static async timeCommand(ctx: CommandContext): Promise<CommandResult> {
    const now = new Date();
    return {
      success: true,
      message: `🕐 Il est actuellement ${now.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
        dateStyle: "full",
        timeStyle: "medium",
      })}`,
    };
  }

  static async levelCommand(ctx: CommandContext): Promise<CommandResult> {
    return await this.statsCommand(ctx);
  }

  static async uptimeCommand(ctx: CommandContext): Promise<CommandResult> {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return {
      success: true,
      message: `⏰ Serveur Ash-Radio en ligne depuis ${hours}h ${minutes}m ${seconds}s`,
    };
  }
}

export default CommandService;
