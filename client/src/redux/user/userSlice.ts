import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserState {
  currentUser: {
    username: string;
    email: string;
    avatar: string;
    _id: string;
  } | null;
  error: string | null;
  loading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action: PayloadAction<{ username: string; email: string; avatar: string; _id: string }>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action: PayloadAction<{ username: string; email: string; avatar: string; _id: string }>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});


export const { signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess } = userSlice.actions;

export default userSlice.reducer;
