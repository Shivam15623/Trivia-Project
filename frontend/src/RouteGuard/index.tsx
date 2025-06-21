import { useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { selectAuth } from "@/redux/AuthSlice/authSlice";
import { LoaderCircle } from "lucide-react";

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
  const { isLoggedIn, user } = useSelector(selectAuth);

  const role = user?.role;
  const isVerified = user?.isVerified;

  // 🧠 1. Prevent rendering too early
  const isUserReady = isLoggedIn !== undefined && user !== undefined;

  useEffect(() => {
    // ⏳ 2. Wait until auth is initialized
    if (!isUserReady) return;

    if (isPublic && isLoggedIn && role) {
      const redirectPath = role === "admin" ? "/admin" : "/customer";
      navigate(redirectPath, { replace: true });
    }

    if (!isPublic) {
      if (!isLoggedIn || !user) {
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
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
    isUserReady,
  ]);

  // ⛔ 3. Wait until auth state is known
  if (!isUserReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-gray-700">
        <LoaderCircle className="w-6 h-6 animate-spin mr-2" />
        Checking authentication...
      </div>
    );
  }

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
