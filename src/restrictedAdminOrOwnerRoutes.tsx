import { useSelector } from "react-redux";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { getLoginStatus } from "./components/store/authenticationSlice";

const RestrictedAdminOrOwnerRoutes = () => {
  const urlId = useParams().id;
  if (!urlId) throw Error("invalid id");

  const { isLoggedIn, isAdmin, userId } = useSelector(getLoginStatus);

  let isOwner: boolean;
  isOwner = parseInt(urlId, 10) === userId;

  return isLoggedIn && (isAdmin || isOwner) ? (
    <Outlet />
  ) : (
    <Navigate to="/error/403" />
  );
};

export default RestrictedAdminOrOwnerRoutes;
