import { Outlet } from "react-router-dom";
import AdminNav from "./Components/AdminNav";

const AdminRoot = () => {
  return (
    <div className="min-h-screen h-auto bg-[#fff8f0]">
      <AdminNav />
      <Outlet />
    </div>
  );
};

export default AdminRoot;
