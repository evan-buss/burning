import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  Store,
} from "@reduxjs/toolkit";
import { throttle } from "lodash";
import { v4 } from "uuid";
import {
  getAuthURL,
  getPin,
  getTokenFromPin,
  isTokenValid,
} from "../../services/auth.service";
import { loadState, saveState } from "../../services/utils";
import { PinResponse } from "../models/plex.model";
import { AppThunk, RootState } from "../store";
import { getUsers } from "./plexSlice";

export interface UserState {
  tokenValid: boolean;
  clientId: string;
  accessToken?: string;
  pins?: PinResponse;
}

const initialState: UserState = {
  tokenValid: false,
  accessToken: loadState("accessToken"),
  clientId: loadState("clientId") ?? v4(),
  pins: {
    id: loadState("pinId", true),
    code: loadState("pinCode", true),
  },
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setValid(state, action: PayloadAction<boolean>) {
      state.tokenValid = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.tokenValid = true;
    },
    setPins(state, action: PayloadAction<PinResponse>) {
      state.pins = action.payload;
    },
  },
});

export const persistUserState = (store: Store<RootState>) => {
  store.subscribe(
    throttle(() => {
      // TODO: Find out how to subscribe to specific reducer state.
      saveState("accessToken", store.getState().auth.accessToken);
      saveState("clientId", store.getState().auth.clientId);
      saveState("pinId", store.getState().auth.pins?.id, true);
      saveState("pinCode", store.getState().auth.pins?.code, true);
    }, 1000)
  );
};

const { setAccessToken, setPins } = authSlice.actions;
export default authSlice.reducer;

export const isAuthenticatedSelector = createSelector(
  (state: RootState) => state.auth,
  (user) => user.accessToken && user.tokenValid
);

export const authLinkSelector = createSelector(
  (state: RootState) => state.auth,
  (user) => getAuthURL(user.clientId, user.pins?.code)
);

export const checkTokenValidity = createAsyncThunk(
  "user/getTokenFromPin",
  async (_, thunkAPI): Promise<boolean> => {
    const user = (thunkAPI.getState() as RootState).auth as UserState;
    const valid = await isTokenValid(user.clientId, user.accessToken!);
    thunkAPI.dispatch(authSlice.actions.setValid(valid));
    if (valid) thunkAPI.dispatch(getUsers());
    return valid;
  }
);

export const fetchPins = (): AppThunk => async (dispatch, getStore) => {
  const clientId = getStore().auth.clientId;
  const pins = await getPin(clientId);
  dispatch(setPins(pins));
};

export const tokenToPin = createAsyncThunk(
  "user/tokenToPin",
  async (_, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).auth;
    const token = await getTokenFromPin(
      state.clientId,
      state.pins?.id!,
      state.pins?.code!
    );
    // Set the access token
    thunkAPI.dispatch(setAccessToken(token));
    thunkAPI.dispatch(getUsers());
  }
);
