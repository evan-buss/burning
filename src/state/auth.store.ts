import { v4 } from "uuid";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  clientId: string;
  userId: string | null;
}

export const useAuthState = create<AuthState>()(
  devtools(
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
  )
);

export const setAccessToken = (token: string) =>
  useAuthState.setState(() => ({ accessToken: token }));

export const setUserId = (userId: string | null) =>
  useAuthState.setState(() => ({ userId }));

export const signOut = () =>
  useAuthState.setState(() => {
    return { accessToken: null, userId: null };
  });
