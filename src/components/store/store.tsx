import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import postsReducer from "./postSlice";
import usersReducer from "./userSlice";
import commentsReducer from "./commentSlice";
import authenticationReducer from "./authenticationSlice";
import imagesReducer from "./imageSlice";

const store = configureStore({
  reducer: {
    usersState: usersReducer,
    postsStore: postsReducer,
    comments: commentsReducer,
    authenticationStore: authenticationReducer,
    imagesState: imagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
