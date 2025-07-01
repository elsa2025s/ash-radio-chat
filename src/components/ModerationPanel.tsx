"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { User, UserRole } from "@/hooks/useSocket";
import { AlertCircle, AlertTriangle, Ban, UserX } from "lucide-react";
import { useState } from "react";

interface ModerationPanelProps {
  open: boolean;
  onClose: () => void;
  targetUser: User | null;
  currentUserRole: UserRole;
  onModerate: (
    userId: string,
    action: "warn" | "kick" | "ban",
    reason?: string,
  ) => void;
}

export default function ModerationPanel({
  open,
  onClose,
  targetUser,
  currentUserRole,
  onModerate,
}: ModerationPanelProps) {
  const [action, setAction] = useState<"warn" | "kick" | "ban">("warn");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const canModerate =
    currentUserRole === "admin" || currentUserRole === "moderator";
  const canBan = currentUserRole === "admin"; // Seuls les admins peuvent bannir

  const handleSubmit = async () => {
    if (!targetUser || !canModerate) return;

    setLoading(true);

    try {
      await onModerate(targetUser.id, action, reason.trim() || undefined);
      onClose();
      setAction("warn");
      setReason("");
    } catch (error) {
      console.error("Erreur lors de la modération:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionDetails = (action: string) => {
    switch (action) {
      case "warn":
        return {
          title: "Avertissement",
          description: "Envoie un avertissement à l'utilisateur",
          icon: AlertTriangle,
          color: "text-yellow-600",
        };
      case "kick":
        return {
          title: "Expulsion temporaire",
          description: "Expulse l'utilisateur du chat temporairement",
          icon: UserX,
          color: "text-orange-600",
        };
      case "ban":
        return {
          title: "Bannissement",
          description: "Bannit définitivement l'utilisateur du chat",
          icon: Ban,
          color: "text-red-600",
        };
      default:
        return {
          title: "Action",
          description: "",
          icon: AlertCircle,
          color: "text-gray-600",
        };
    }
  };

  if (!canModerate) {
    return null;
  }

  const actionDetails = getActionDetails(action);
  const IconComponent = actionDetails.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 ${actionDetails.color}`} />
            Modération - {targetUser?.username}
          </DialogTitle>
          <DialogDescription>
            En tant que{" "}
            {currentUserRole === "admin" ? "administrateur" : "modérateur"}{" "}
            d'Ash-Radio, vous pouvez sanctionner cet utilisateur.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Type de sanction</Label>
            <Select
              value={action}
              onValueChange={(value: "warn" | "kick" | "ban") =>
                setAction(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warn">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Avertissement
                  </div>
                </SelectItem>
                <SelectItem value="kick">
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-orange-600" />
                    Expulsion temporaire
                  </div>
                </SelectItem>
                {canBan && (
                  <SelectItem value="ban">
                    <div className="flex items-center gap-2">
                      <Ban className="h-4 w-4 text-red-600" />
                      Bannissement
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <Alert>
            <IconComponent className={`h-4 w-4 ${actionDetails.color}`} />
            <AlertDescription>
              <strong>{actionDetails.title}:</strong>{" "}
              {actionDetails.description}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="reason">Raison (optionnel)</Label>
            <Textarea
              id="reason"
              placeholder="Expliquez brièvement la raison de cette sanction..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {action === "ban" && (
            <Alert className="border-red-200 bg-red-50">
              <Ban className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Attention:</strong> Le bannissement est une action
                définitive. L'utilisateur ne pourra plus accéder au chat
                Ash-Radio.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`${
              action === "ban"
                ? "bg-red-600 hover:bg-red-700"
                : action === "kick"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
            } text-white`}
          >
            {loading
              ? "Application..."
              : `Appliquer ${actionDetails.title.toLowerCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
