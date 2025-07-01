import { auth, database } from "@/lib/firebase";
import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, serverTimestamp, set } from "firebase/database";
import { useEffect, useState } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  color: string;
  role: "admin" | "moderator" | "user";
  token?: string;
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

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Utilisateur connecté
          const username =
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Utilisateur";
          const role = getUserRole(username);
          const color = getUserColor(role);

          const userData: User = {
            id: firebaseUser.uid,
            username,
            email: firebaseUser.email || "",
            avatar: username.charAt(0).toUpperCase(),
            color,
            role,
            token: await firebaseUser.getIdToken(),
          };

          // Sauvegarder les données utilisateur dans Realtime Database
          await set(ref(database, `users/${firebaseUser.uid}`), {
            ...userData,
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp(),
          });

          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Utilisateur déconnecté
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);

      // Créer le compte Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      // Mettre à jour le profil avec le nom d'utilisateur
      await updateProfile(firebaseUser, {
        displayName: username,
      });

      const role = getUserRole(username);
      const color = getUserColor(role);

      const userData = {
        id: firebaseUser.uid,
        username,
        email,
        avatar: username.charAt(0).toUpperCase(),
        color,
        role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };

      // Sauvegarder dans Realtime Database
      await set(ref(database, `users/${firebaseUser.uid}`), userData);

      console.log(`📝 Nouvelle inscription Ash-Radio: ${username} (${role})`);

      return {
        success: true,
        user: userData,
      };
    } catch (error: any) {
      console.error("Erreur inscription:", error);
      let errorMessage = "Erreur lors de l'inscription";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Cette adresse email est déjà utilisée";
          break;
        case "auth/weak-password":
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
          break;
        case "auth/invalid-email":
          errorMessage = "Adresse email invalide";
          break;
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      const username = firebaseUser.displayName || email.split("@")[0];
      const role = getUserRole(username);

      // Mettre à jour la dernière connexion
      await set(
        ref(database, `users/${firebaseUser.uid}/lastLogin`),
        serverTimestamp(),
      );

      console.log(`🎧 Connexion Ash-Radio: ${username} (${role})`);

      return {
        success: true,
        user: user,
      };
    } catch (error: any) {
      console.error("Erreur connexion:", error);
      let errorMessage = "Erreur lors de la connexion";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Utilisateur non trouvé";
          break;
        case "auth/wrong-password":
          errorMessage = "Mot de passe incorrect";
          break;
        case "auth/invalid-email":
          errorMessage = "Adresse email invalide";
          break;
        case "auth/too-many-requests":
          errorMessage = "Trop de tentatives. Réessayez plus tard";
          break;
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      console.log("👋 Déconnexion Ash-Radio");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
  };
};
