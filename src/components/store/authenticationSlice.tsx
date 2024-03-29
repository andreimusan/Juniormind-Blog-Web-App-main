import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Axios from "axios";
import jwt from "jsonwebtoken";

const baseURL = process.env.REACT_APP_BASE_URL;

type initialStateType = {
  isLoggedIn: boolean;
  username: string;
  isAdmin: boolean;
  userId: number;
  userImage: string;
  accessToken: string;
  issuedAt: number;
  expiresIn: number;
  loginStatus: string;
  loginError: string;
};

type loginToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type IToken = {
  username: string;
  email: string;
  userId: number;
  userImage: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
};

type localStorageTokenType = {
  accessToken: string;
  username: string;
  userId: number;
  userImage: string;
  isAdmin: boolean;
  issuedAt: number;
  expiresIn: number;
};

const initialState: initialStateType = {
  isLoggedIn: false,
  username: "",
  userId: 0,
  userImage: "",
  isAdmin: false,
  accessToken: "",
  issuedAt: 0,
  expiresIn: 0,
  loginStatus: "",
  loginError: "",
};

export const login = createAsyncThunk(
  "login",
  async (params: string, { rejectWithValue }) => {
    try {
      const response = await Axios.post<loginToken, any>(
        `${baseURL}login`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response;
    } catch (error: any) {
      if (Axios.isAxiosError(error)) {
        if (error.response === undefined)
          return rejectWithValue("Unexpected server error");
        return rejectWithValue(JSON.parse(error.request.response));
      }
    }
  }
);

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    isAlreadyLoggedIn: (state, action) => {
      let localStorageToken: localStorageTokenType = {
        accessToken: "",
        username: "",
        userId: 0,
        userImage: "",
        isAdmin: false,
        issuedAt: 0,
        expiresIn: 0,
      };
      const isLoggedIn = checkTokenInLocalStorage(localStorageToken);

      state.isLoggedIn = isLoggedIn;
      state.username = localStorageToken.username;
      state.userId = localStorageToken.userId;
      state.userImage = localStorageToken.userImage;
      state.isAdmin = localStorageToken.isAdmin;
      state.accessToken = localStorageToken.accessToken;
      state.issuedAt = localStorageToken.issuedAt;
      state.expiresIn = localStorageToken.expiresIn;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.username = "";
      state.userId = 0;
      state.userImage = "";
      state.isAdmin = false;
      state.accessToken = "";
      state.issuedAt = 0;
      state.expiresIn = 0;
      localStorage.removeItem("tokenDetails");
    },
    updateUserInfo: (
      state,
      action: { payload: { username: string; userImage: string } }
    ) => {
      state.username = action.payload.username;
      state.userImage = action.payload.userImage;

      setTokenInLocalStorage({
        accessToken: state.accessToken,
        username: state.username,
        userId: state.userId,
        userImage: state.userImage,
        isAdmin: state.isAdmin,
        issuedAt: state.issuedAt,
        expiresIn: state.expiresIn,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.loginStatus = "pending";
    });

    builder.addCase(login.fulfilled, (state, action) => {
      const token = action.payload.data;
      const secret = process.env.REACT_APP_JWT_SECRET;
      if (!secret) throw new Error("No secret provided!");
      const decoded = jwt.verify(token.access_token, secret) as IToken;

      state.accessToken = token.access_token;
      state.issuedAt = decoded.iat;
      state.expiresIn = decoded.exp;
      state.isLoggedIn = true;
      state.username = decoded.username;
      state.userId = decoded.userId;
      state.userImage = decoded.userImage;
      state.isAdmin = decoded.isAdmin;
      state.loginStatus = "success";

      setTokenInLocalStorage({
        accessToken: token.access_token,
        username: decoded.username,
        userId: decoded.userId,
        userImage: decoded.userImage,
        isAdmin: decoded.isAdmin,
        issuedAt: decoded.iat,
        expiresIn: decoded.exp,
      });
    });

    builder.addCase(
      login.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.loginStatus = "rejected";
        state.loginError = action.payload.error_description;
      }
    );
  },
});

const checkTokenInLocalStorage = (localStorageToken: localStorageTokenType) => {
  const tokenStr = localStorage.getItem("tokenDetails");
  if (!tokenStr) return false;

  const token = JSON.parse(tokenStr);
  if (Date.now() / 1000 > token.expiresIn) {
    localStorage.removeItem("tokenDetails");
    return false;
  }

  localStorageToken.accessToken = token.accessToken;
  localStorageToken.username = token.username;
  localStorageToken.userId = token.userId;
  localStorageToken.userImage = token.userImage;
  localStorageToken.isAdmin = token.isAdmin;
  localStorageToken.issuedAt = token.issuedAt;
  localStorageToken.expiresIn = token.expiresIn;
  return true;
};

const setTokenInLocalStorage = (localStorageToken: localStorageTokenType) =>
  localStorage.setItem("tokenDetails", JSON.stringify(localStorageToken));

export const getLoginStatus = (state: any) => state.authenticationStore;

export const { isAlreadyLoggedIn, logout, updateUserInfo } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
