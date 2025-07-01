import { useEffect, useState } from "react";
import type { User } from "./useSocket";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthActions {
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export interface UseAuthReturn extends AuthState, AuthActions {}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    // Vérifier si un token existe dans le localStorage
    const savedToken = localStorage.getItem("chat_token");
    const savedUser = localStorage.getItem("chat_user");

    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          token: savedToken,
          loading: false,
        });
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur sauvé:", error);
        localStorage.removeItem("chat_token");
        localStorage.removeItem("chat_user");
        setAuthState({ user: null, token: null, loading: false });
      }
    } else {
      setAuthState({ user: null, token: null, loading: false });
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("chat_token", data.token);
        localStorage.setItem("chat_user", JSON.stringify(data.user));

        setAuthState({
          user: data.user,
          token: data.token,
          loading: false,
        });

        return { success: true };
      } else {
        return { success: false, error: data.error || "Erreur de connexion" };
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return { success: false, error: "Erreur de réseau" };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("chat_token", data.token);
        localStorage.setItem("chat_user", JSON.stringify(data.user));

        setAuthState({
          user: data.user,
          token: data.token,
          loading: false,
        });

        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || "Erreur lors de l'inscription",
        };
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return { success: false, error: "Erreur de réseau" };
    }
  };

  const logout = () => {
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_user");
    setAuthState({
      user: null,
      token: null,
      loading: false,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
};
