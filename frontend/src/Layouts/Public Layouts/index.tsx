import HomeFooter from "@/Layouts/Public Layouts/Components/HomeFooter";
import { PublicHeader } from "@/Layouts/Public Layouts/Components/PublicNav";


import { Outlet } from "react-router-dom";

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
