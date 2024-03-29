import axios from "axios";
import store from "./components/store/store";

export default function Instance() {
  const state = store.getState();
  const authToken = state.authenticationStore.accessToken;

  return axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  });
}
