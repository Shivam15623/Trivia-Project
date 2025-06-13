import { CustomerNavHeader } from "@/Layouts/Customer Layouts/Components/CustomerNav";
import { Outlet } from "react-router-dom";

const CustomRoot = () => {
  return (
    <div className="min-h-screen h-screen">
      <CustomerNavHeader />
      <Outlet />
    </div>
  );
};

export default CustomRoot;
