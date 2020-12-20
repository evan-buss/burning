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

const userSlice = createSlice({
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
      saveState("accessToken", store.getState().user.accessToken);
      saveState("clientId", store.getState().user.clientId);
      saveState("pinId", store.getState().user.pins?.id, true);
      saveState("pinCode", store.getState().user.pins?.code, true);
    }, 1000)
  );
};

const { setAccessToken, setPins } = userSlice.actions;
export default userSlice.reducer;

export const isAuthenticatedSelector = createSelector(
  (state: RootState) => state.user,
  (user) => user.accessToken && user.tokenValid
);

export const authLinkSelector = createSelector(
  (state: RootState) => state.user,
  (user) => getAuthURL(user.clientId, user.pins?.code)
);

export const checkTokenValidity = createAsyncThunk(
  "user/getTokenFromPin",
  async (_, thunkAPI): Promise<boolean> => {
    const user = (thunkAPI.getState() as RootState).user as UserState;
    const valid = await isTokenValid(user.clientId, user.accessToken!);
    thunkAPI.dispatch(userSlice.actions.setValid(valid));
    return valid;
  }
);

export const fetchPins = (): AppThunk => async (dispatch, getStore) => {
  const clientId = getStore().user.clientId;
  const pins = await getPin(clientId);
  dispatch(setPins(pins));
};

export const tokenToPin = createAsyncThunk(
  "user/tokenToPin",
  async (_, thunkAPI) => {
    const state = (thunkAPI.getState() as RootState).user;
    const token = await getTokenFromPin(
      state.clientId,
      state.pins?.id!,
      state.pins?.code!
    );
    thunkAPI.dispatch(setAccessToken(token));
  }
);
