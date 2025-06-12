import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "@/redux/store";

interface PublicRouteGuardProps {
  children: ReactNode;
}

const PublicRouteGuard: React.FC<PublicRouteGuardProps> = ({ children }) => {
  const navigate = useNavigate();
 

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  useEffect(() => {
    if (isLoggedIn && user?.role) {
      const redirectPath = user.role === "admin" ? "/admin" : "/customer";
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, user?.role, navigate]);
  return !isLoggedIn ? <>{children}</> : null;
};
export default PublicRouteGuard;
