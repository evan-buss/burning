import { v4 } from "uuid";
import create from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  clientId: string;
  userId: number | null;
}

export const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      clientId: v4(),
      userId: null,
    }),
    {
      name: "auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        clientId: state.clientId,
        userId: state.userId,
      }),
    }
  )
);

export const setAccessToken = (token: string) =>
  useAuthState.setState(() => ({ accessToken: token }));

export const setUserId = (userId: number | null) =>
  useAuthState.setState(() => ({ userId }));

export const signOut = () =>
  useAuthState.setState(() => {
    localStorage.removeItem("auth");
    return { accessToken: null, userId: null, clientId: v4() };
  });
