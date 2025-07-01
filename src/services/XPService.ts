import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface LevelInfo {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressToNext: number;
  progressPercent: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: any;
  unlockedAt?: Date;
}

export class XPService {
  // Configuration XP
  static readonly BASE_XP = 100;
  static readonly XP_MULTIPLIER = 1.5;
  static readonly MAX_LEVEL = 100;

  // XP par action
  static readonly XP_REWARDS = {
    MESSAGE: 1,
    VOICE_SECOND: 0.1,
    DAILY_LOGIN: 10,
    FIRST_MESSAGE_DAY: 5,
    LONG_MESSAGE: 2, // Messages > 50 caractères
    IMAGE_SHARE: 3,
    VOICE_MESSAGE: 5,
    REACTION_RECEIVED: 0.5,
    CHANNEL_JOIN: 2,
  };

  // Multiplicateurs de rôle
  static readonly ROLE_MULTIPLIERS = {
    ADMIN: 1.5,
    MODERATOR: 1.2,
    USER: 1.0,
  };

  // Calcul de l'XP nécessaire pour un niveau
  static getXPForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.floor(this.BASE_XP * Math.pow(this.XP_MULTIPLIER, level - 1));
  }

  // Calcul du niveau basé sur l'XP
  static getLevelFromXP(xp: number): number {
    let level = 1;
    while (level < this.MAX_LEVEL && xp >= this.getXPForLevel(level + 1)) {
      level++;
    }
    return level;
  }

  // Obtenir les informations de niveau d'un utilisateur
  static getLevelInfo(xp: number): LevelInfo {
    const currentLevel = this.getLevelFromXP(xp);
    const xpForCurrentLevel = this.getXPForLevel(currentLevel);
    const xpForNextLevel = this.getXPForLevel(currentLevel + 1);
    const progressToNext = xp - xpForCurrentLevel;
    const totalNeeded = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = Math.round((progressToNext / totalNeeded) * 100);

    return {
      currentLevel,
      currentXP: xp,
      xpForCurrentLevel,
      xpForNextLevel,
      progressToNext,
      progressPercent: Math.min(progressPercent, 100),
    };
  }

  // Ajouter de l'XP à un utilisateur
  static async addXP(
    userId: string,
    amount: number,
    source = "unknown",
    applyMultiplier = true,
  ): Promise<{
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
    totalXP: number;
    xpGained: number;
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("Utilisateur introuvable");
      }

      const oldLevel = user.level;
      let xpToAdd = amount;

      // Appliquer le multiplicateur de rôle
      if (applyMultiplier) {
        const multiplier =
          this.ROLE_MULTIPLIERS[
            user.role as keyof typeof this.ROLE_MULTIPLIERS
          ] || 1.0;
        xpToAdd = Math.floor(amount * multiplier);
      }

      const newXP = user.xp + xpToAdd;
      const newLevel = this.getLevelFromXP(newXP);
      const leveledUp = newLevel > oldLevel;

      // Mettre à jour l'utilisateur
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXP,
          level: newLevel,
        },
      });

      // Si l'utilisateur a gagné un niveau, vérifier les achievements
      if (leveledUp) {
        await this.checkLevelAchievements(userId, newLevel);
      }

      console.log(`📈 ${user.username} a gagné ${xpToAdd} XP (${source})`);

      return {
        oldLevel,
        newLevel,
        leveledUp,
        totalXP: newXP,
        xpGained: xpToAdd,
      };
    } catch (error) {
      console.error("Erreur lors de l'ajout d'XP:", error);
      throw error;
    }
  }

  // XP pour envoyer un message
  static async awardMessageXP(
    userId: string,
    messageContent: string,
  ): Promise<any> {
    let xp = this.XP_REWARDS.MESSAGE;

    // Bonus pour les messages longs
    if (messageContent.length > 50) {
      xp += this.XP_REWARDS.LONG_MESSAGE;
    }

    return await this.addXP(userId, xp, "message");
  }

  // XP pour partager une image
  static async awardImageXP(userId: string): Promise<any> {
    return await this.addXP(userId, this.XP_REWARDS.IMAGE_SHARE, "image_share");
  }

  // XP pour message vocal
  static async awardVoiceXP(userId: string, duration: number): Promise<any> {
    const xp =
      Math.floor(duration * this.XP_REWARDS.VOICE_SECOND) +
      this.XP_REWARDS.VOICE_MESSAGE;
    return await this.addXP(userId, xp, "voice_message");
  }

  // XP pour connexion quotidienne
  static async awardDailyLoginXP(userId: string): Promise<any> {
    const today = new Date().toDateString();

    // Vérifier si l'utilisateur s'est déjà connecté aujourd'hui
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    const lastSeen = user.lastSeen.toDateString();

    if (lastSeen !== today) {
      // Première connexion du jour
      await prisma.user.update({
        where: { id: userId },
        data: { lastSeen: new Date() },
      });

      return await this.addXP(
        userId,
        this.XP_REWARDS.DAILY_LOGIN,
        "daily_login",
      );
    }

    return null;
  }

  // XP pour rejoindre un channel
  static async awardChannelJoinXP(userId: string): Promise<any> {
    return await this.addXP(
      userId,
      this.XP_REWARDS.CHANNEL_JOIN,
      "channel_join",
    );
  }

  // Obtenir le classement général
  static async getLeaderboard(limit = 10): Promise<any[]> {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: { not: "BANNED" },
        },
        orderBy: [{ level: "desc" }, { xp: "desc" }],
        take: limit,
        select: {
          id: true,
          username: true,
          level: true,
          xp: true,
          role: true,
          avatar: true,
          messagesCount: true,
          joinedAt: true,
        },
      });

      return users.map((user, index) => ({
        ...user,
        rank: index + 1,
        levelInfo: this.getLevelInfo(user.xp),
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération du classement:", error);
      return [];
    }
  }

  // Initialiser les achievements par défaut
  static async initializeAchievements(): Promise<void> {
    const achievements = [
      // Achievements de messages
      {
        name: "Premier Pas",
        description: "Envoyer votre premier message",
        icon: "🎯",
        xpReward: 10,
        condition: { type: "messages", count: 1 },
      },
      {
        name: "Bavard",
        description: "Envoyer 100 messages",
        icon: "💬",
        xpReward: 50,
        condition: { type: "messages", count: 100 },
      },
      {
        name: "Causeur",
        description: "Envoyer 500 messages",
        icon: "🗣️",
        xpReward: 100,
        condition: { type: "messages", count: 500 },
      },
      {
        name: "Orateur",
        description: "Envoyer 1000 messages",
        icon: "🎤",
        xpReward: 200,
        condition: { type: "messages", count: 1000 },
      },

      // Achievements de niveaux
      {
        name: "Niveau 5",
        description: "Atteindre le niveau 5",
        icon: "⭐",
        xpReward: 25,
        condition: { type: "level", count: 5 },
      },
      {
        name: "Niveau 10",
        description: "Atteindre le niveau 10",
        icon: "🌟",
        xpReward: 50,
        condition: { type: "level", count: 10 },
      },
      {
        name: "Niveau 25",
        description: "Atteindre le niveau 25",
        icon: "✨",
        xpReward: 100,
        condition: { type: "level", count: 25 },
      },
      {
        name: "Niveau 50",
        description: "Atteindre le niveau 50",
        icon: "🏆",
        xpReward: 250,
        condition: { type: "level", count: 50 },
      },

      // Achievements de fidélité
      {
        name: "Fidèle Auditeur",
        description: "Être membre depuis 7 jours",
        icon: "🎧",
        xpReward: 50,
        condition: { type: "days", count: 7 },
      },
      {
        name: "Vétéran",
        description: "Être membre depuis 30 jours",
        icon: "🎖️",
        xpReward: 150,
        condition: { type: "days", count: 30 },
      },
      {
        name: "Légende",
        description: "Être membre depuis 100 jours",
        icon: "👑",
        xpReward: 500,
        condition: { type: "days", count: 100 },
      },

      // Achievements spéciaux
      {
        name: "Première Image",
        description: "Partager votre première image",
        icon: "📸",
        xpReward: 15,
        condition: { type: "images", count: 1 },
      },
      {
        name: "Première Voix",
        description: "Envoyer votre premier message vocal",
        icon: "🎙️",
        xpReward: 20,
        condition: { type: "voice", count: 1 },
      },
      {
        name: "Explorateur",
        description: "Rejoindre 3 channels différents",
        icon: "🗺️",
        xpReward: 30,
        condition: { type: "channels", count: 3 },
      },
      {
        name: "Influenceur",
        description: "Recevoir 100 réactions sur vos messages",
        icon: "⭐",
        xpReward: 75,
        condition: { type: "reactions", count: 100 },
      },
    ];

    for (const achievement of achievements) {
      try {
        await prisma.achievement.upsert({
          where: { name: achievement.name },
          update: achievement,
          create: achievement,
        });
      } catch (error) {
        console.error(
          `Erreur lors de la création de l'achievement ${achievement.name}:`,
          error,
        );
      }
    }

    console.log(`🏆 ${achievements.length} achievements initialisés`);
  }

  // Vérifier les achievements pour un utilisateur
  static async checkAchievements(userId: string): Promise<Achievement[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userAchievements: true,
          _count: {
            select: { messages: true },
          },
        },
      });

      if (!user) return [];

      const unlockedAchievements = user.userAchievements.map(
        (ua) => ua.achievementId,
      );
      const availableAchievements = await prisma.achievement.findMany({
        where: {
          id: { notIn: unlockedAchievements },
        },
      });

      const newAchievements: Achievement[] = [];

      for (const achievement of availableAchievements) {
        const condition = achievement.condition as any;
        let earned = false;

        switch (condition.type) {
          case "messages":
            earned = user._count.messages >= condition.count;
            break;
          case "level":
            earned = user.level >= condition.count;
            break;
          case "days":
            const daysSinceJoin = Math.floor(
              (new Date().getTime() - user.joinedAt.getTime()) /
                (1000 * 60 * 60 * 24),
            );
            earned = daysSinceJoin >= condition.count;
            break;
          // Ajouter d'autres types de conditions selon les besoins
        }

        if (earned) {
          // Débloquer l'achievement
          await prisma.userAchievement.create({
            data: {
              userId,
              achievementId: achievement.id,
            },
          });

          // Donner l'XP de récompense
          await this.addXP(
            userId,
            achievement.xpReward,
            `achievement_${achievement.name}`,
            false,
          );

          newAchievements.push({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            xpReward: achievement.xpReward,
            condition: achievement.condition,
            unlockedAt: new Date(),
          });

          console.log(
            `🏆 ${user.username} a débloqué l'achievement "${achievement.name}"`,
          );
        }
      }

      return newAchievements;
    } catch (error) {
      console.error("Erreur lors de la vérification des achievements:", error);
      return [];
    }
  }

  // Vérifier spécifiquement les achievements de niveau
  static async checkLevelAchievements(
    userId: string,
    newLevel: number,
  ): Promise<void> {
    try {
      const achievements = await prisma.achievement.findMany({
        where: {
          condition: {
            path: ["type"],
            equals: "level",
          },
        },
      });

      for (const achievement of achievements) {
        const condition = achievement.condition as any;
        if (newLevel >= condition.count) {
          const existing = await prisma.userAchievement.findUnique({
            where: {
              userId_achievementId: {
                userId,
                achievementId: achievement.id,
              },
            },
          });

          if (!existing) {
            await prisma.userAchievement.create({
              data: {
                userId,
                achievementId: achievement.id,
              },
            });

            await this.addXP(
              userId,
              achievement.xpReward,
              `level_achievement_${achievement.name}`,
              false,
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification des achievements de niveau:",
        error,
      );
    }
  }

  // Obtenir les achievements d'un utilisateur
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
      });

      return userAchievements.map((ua) => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        xpReward: ua.achievement.xpReward,
        condition: ua.achievement.condition,
        unlockedAt: ua.unlockedAt,
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des achievements utilisateur:",
        error,
      );
      return [];
    }
  }

  // Obtenir les statistiques XP d'un utilisateur
  static async getUserXPStats(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              messages: true,
              userAchievements: true,
            },
          },
        },
      });

      if (!user) return null;

      const levelInfo = this.getLevelInfo(user.xp);
      const rank = await this.getUserRank(userId);

      return {
        ...user,
        levelInfo,
        rank,
        achievementCount: user._count.userAchievements,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des stats XP:", error);
      return null;
    }
  }

  // Obtenir le rang d'un utilisateur
  static async getUserRank(userId: string): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return 0;

      const rank = await prisma.user.count({
        where: {
          OR: [
            { level: { gt: user.level } },
            {
              AND: [{ level: user.level }, { xp: { gt: user.xp } }],
            },
          ],
          role: { not: "BANNED" },
        },
      });

      return rank + 1;
    } catch (error) {
      console.error("Erreur lors de la récupération du rang:", error);
      return 0;
    }
  }
}

export default XPService;
