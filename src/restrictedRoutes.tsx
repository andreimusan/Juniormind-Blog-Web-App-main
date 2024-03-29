import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getLoginStatus } from "./components/store/authenticationSlice";

const RestrictedRoutes = () => {
  const { isLoggedIn } = useSelector(getLoginStatus);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default RestrictedRoutes;
