import { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";

interface RouteGuardProps {
  children: ReactNode;
  requireRole?: "admin" | "customer";
  requireAnyRole?: ("admin" | "customer")[];
  isPublic?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requireRole,
  requireAnyRole,
  isPublic = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  const role = user?.role;
  const isVerified = user?.isVerified;

  useEffect(() => {
    if (isPublic && isLoggedIn && role) {
      const redirectPath = role === "admin" ? "/admin" : "/customer";
      navigate(redirectPath, { replace: true });
    }

    if (!isPublic) {
      if (!isLoggedIn || !user) {
        navigate("/login", { state: { from: location.pathname }, replace: true });
        return;
      }

      if (!isVerified) {
        navigate("/login", { replace: true });
        return;
      }

      if (requireRole && role !== requireRole) {
        navigate("/unauthorized", { replace: true });
        return;
      }

      if (requireAnyRole && (!role || !requireAnyRole.includes(role))) {
        navigate("/unauthorized", { replace: true });
        return;
      }
    }
  }, [
    isLoggedIn,
    user,
    isVerified,
    role,
    isPublic,
    requireRole,
    requireAnyRole,
    location.pathname,
    navigate,
  ]);

  const allowAccess =
    isPublic ||
    (isLoggedIn &&
      user &&
      isVerified &&
      (!requireRole || role === requireRole) &&
      (!requireAnyRole || (role && requireAnyRole.includes(role))));

  return allowAccess ? <>{children}</> : null;
};

export default RouteGuard;
