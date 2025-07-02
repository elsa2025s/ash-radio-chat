"use client";

import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/hooks/useSocket";
import { Crown, Shield, User } from "lucide-react";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export default function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case "admin":
        return {
          label: "Admin",
          icon: Crown,
          className: "bg-red-600 text-white hover:bg-red-700",
          description: "Administrateur Ash-Radio",
        };
      case "moderator":
        return {
          label: "Mod",
          icon: Shield,
          className: "bg-purple-600 text-white hover:bg-purple-700",
          description: "Modérateur Ash-Radio",
        };
      case "user":
        return {
          label: "Auditeur",
          icon: User,
          className: "bg-blue-600 text-white hover:bg-blue-700",
          description: "Auditeur Ash-Radio",
        };
      default:
        return {
          label: "Auditeur",
          icon: User,
          className: "bg-gray-600 text-white hover:bg-gray-700",
          description: "Auditeur",
        };
    }
  };

  const config = getRoleConfig(role);
  const IconComponent = config.icon;

  return (
    <Badge
      className={`${config.className} ${className} text-xs font-medium flex items-center gap-1`}
      title={config.description}
    >
      <IconComponent className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
