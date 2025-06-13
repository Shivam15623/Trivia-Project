

import { Outlet } from "react-router-dom";
import AdminNav from "./Components/AdminNav";

const AdminRoot = () => {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  );
};

export default AdminRoot;
