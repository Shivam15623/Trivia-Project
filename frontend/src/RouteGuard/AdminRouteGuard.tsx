import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
interface AdminProtectedRoutesProps {
  children: ReactNode;
}
const AdminRouteGuard: React.FC<AdminProtectedRoutesProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isAdmin =
    isLoggedIn && user && user.role === "admin" && user.isVerified === true;
  useEffect(() => {
    if (!isLoggedIn || !user) {
      // ✅ If not logged in, redirect to login
      navigate("/login", { state: { from: location.pathname }, replace: true });
    } else if (!isAdmin) {
      // ✅ If not admin, redirect to home or employee dashboard
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, user, navigate, location.pathname,isAdmin]);
  if (isAdmin) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default AdminRouteGuard;
