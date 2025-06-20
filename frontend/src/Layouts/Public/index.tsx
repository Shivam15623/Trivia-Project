


import { Outlet } from "react-router-dom";
import { PublicHeader } from "./Components/PublicNav";
import HomeFooter from "./Components/HomeFooter";

const PublicRoot = () => {
  return (
    <>
      <PublicHeader />
      <Outlet />
      <HomeFooter/>
    </>
  );
};

export default PublicRoot;
