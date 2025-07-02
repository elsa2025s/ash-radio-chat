"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Headphones, Loader2, Music, Radio } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(loginForm.username, loginForm.password);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Erreur de connexion");
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    const result = await register(
      registerForm.username,
      registerForm.email,
      registerForm.password,
    );

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Erreur lors de l'inscription");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center">
            <div className="flex items-center space-x-2">
              <Radio className="h-6 w-6 text-red-500" />
              <div className="text-center">
                <span className="font-bold text-xl text-red-600">
                  Ash-Radio
                </span>
                <p className="text-xs text-slate-500 font-normal">
                  ashradio-direct.com
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-4 text-red-400 mb-2">
            <Music className="h-5 w-5" />
            <Headphones className="h-5 w-5" />
            <Radio className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-600">
            Rejoignez la communauté Ash-Radio et discutez en direct avec les
            auditeurs !
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Se connecter</CardTitle>
                <CardDescription>
                  Connectez-vous pour participer au chat d'Ash-Radio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Nom d'utilisateur</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Votre pseudo radio"
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, username: e.target.value })
                      }
                      className="focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Votre mot de passe"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className="focus:border-red-500"
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      <>
                        <Radio className="mr-2 h-4 w-4" />
                        Rejoindre Ash-Radio
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">S'inscrire</CardTitle>
                <CardDescription>
                  Créez votre compte pour devenir membre de la communauté
                  Ash-Radio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Nom d'utilisateur</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Choisissez votre pseudo radio"
                      value={registerForm.username}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          username: e.target.value,
                        })
                      }
                      className="focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      className="focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Au moins 6 caractères"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      className="focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">
                      Confirmer le mot de passe
                    </Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Répétez votre mot de passe"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="focus:border-red-500"
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      <>
                        <Headphones className="mr-2 h-4 w-4" />
                        Rejoindre la communauté
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-center text-slate-500 mt-4 border-t pt-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Radio className="h-3 w-3 text-red-400" />
            <span className="font-medium">Ash-Radio Community</span>
          </div>
          <p>
            En vous connectant, vous acceptez de respecter les règles de notre
            communauté radio.
          </p>
          <p className="mt-1">Écoutez ashradio-direct.com en direct !</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
