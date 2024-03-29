import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getLoginStatus } from "./components/store/authenticationSlice";

const RestrictedAfterLogin = () => {
  const { isLoggedIn } = useSelector(getLoginStatus);

  return !isLoggedIn ? <Outlet /> : <Navigate to="" replace={true} />;
};

export default RestrictedAfterLogin;
