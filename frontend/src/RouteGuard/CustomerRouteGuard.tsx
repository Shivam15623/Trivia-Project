import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
interface CustomerRouteGuardProp {
  children: ReactNode;
}
const CustomerRouteGuard: React.FC<CustomerRouteGuardProp> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isCustomer =
    isLoggedIn && user && user.isVerified === true && user.role === "customer";
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    } else if (!isCustomer) {
      navigate("/login", { replace: true }); // Redirect unauthorized users to home or other page
    }
  }, [isLoggedIn, user, navigate, location.pathname,isCustomer]);
  if (isCustomer) {
    return <>{children}</>; // Render Employee protected content
  } else {
    return null;
  }
};

export default CustomerRouteGuard;
