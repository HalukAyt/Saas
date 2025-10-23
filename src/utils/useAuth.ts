// src/utils/useAuth.ts
import { useContext } from "react";
import { useAuth as useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { user, loading, signIn, signOut, refreshProfile } = useAuthContext();
  return { user, loading, signIn, signOut, refreshProfile };
};
