import { NavHeader } from "@/CustomComponent/layout components/PublicNav";

import { Outlet } from "react-router-dom";

const PublicRoot = () => {
  return (
    <>
      <NavHeader />
      <Outlet />
    </>
  );
};

export default PublicRoot;
