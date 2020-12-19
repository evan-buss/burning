import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import userReducer, { saveUserState } from "./slices/userSlice";
import plexReducer from "./slices/plexSlice";

export const store = configureStore({
  reducer: {
    plex: plexReducer,
    user: userReducer,
  },
});

saveUserState(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
