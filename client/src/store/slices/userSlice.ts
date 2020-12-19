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
} from "../../services/auth";
import { loadState, saveState } from "../../services/utils";
import { AppThunk, RootState } from "../store";

export interface UserState {
  clientId: string;
  accessToken?: string;
  pins?: PinResponse;
}

export interface PinResponse {
  id?: string;
  code?: string;
}

const initialState: UserState = {
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
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setPins(state, action: PayloadAction<PinResponse>) {
      state.pins = action.payload;
    },
  },
});

export const saveUserState = (store: Store<RootState>) => {
  store.subscribe(
    throttle(() => {
      saveState("accessToken", store.getState().user.accessToken);
      saveState("clientId", store.getState().user.clientId);
      saveState("pinId", store.getState().user.pins?.id, true);
      saveState("pinCode", store.getState().user.pins?.code, true);
    }, 1000)
  );
};

export const authLinkSelector = createSelector(
  (state: RootState) => state.user,
  (user) => getAuthURL(user.clientId, user.pins?.code)
);

export const checkTokenValidity = createAsyncThunk(
  "user/getTokenFromPin",
  async (_, thunkAPI): Promise<boolean> => {
    const user = (thunkAPI.getState() as RootState).user as UserState;
    return await isTokenValid(user.clientId, user.accessToken!);
  }
);

export const fetchPins = (): AppThunk => async (dispatch, getStore) => {
  const clientId = getStore().user.clientId;
  dispatch(setPins(await getPin(clientId)));
};

export const tokenToPin = (): AppThunk => async (dispatch, getStore) => {
  const state = getStore().user;
  const token = await getTokenFromPin(
    state.clientId,
    state.pins?.id!,
    state.pins?.code!
  );
  dispatch(setAccessToken(token));
};

const { setAccessToken, setPins } = userSlice.actions;

export default userSlice.reducer;
