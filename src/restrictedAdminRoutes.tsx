import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getLoginStatus } from "./components/store/authenticationSlice";

const RestrictedAdminRoutes = () => {
  const { isLoggedIn, isAdmin } = useSelector(getLoginStatus);

  return isLoggedIn && isAdmin ? <Outlet /> : <Navigate to="/error/403" />;
};

export default RestrictedAdminRoutes;
