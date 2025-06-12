import { createBrowserRouter } from "react-router-dom";
// import AdminMainRoutes from "./AdminRoutes/AdminMainRoutes";
// import CustomerMainRoutes from "./CustomerRoutes/CustomerMainRoutes";
// import PublicRoutes, { PublicMinimalRoutes } from "./PublicRoutes/PublicRoutes";

// import CustomerMinimalRoutes from "./CustomerRoutes/CustomerMinimalRoutes";
// import AdminMiniMalRoutes from "./AdminRoutes/AdminMiniMalRoutes";
import { AllRoutes } from "./AllRoutes";

// const router = createBrowserRouter([
//   AdminMainRoutes,
//   CustomerMainRoutes,
//   PublicRoutes,
//   CustomerMinimalRoutes,
//   ...PublicMinimalRoutes,
//   AdminMiniMalRoutes,
// ]);
const router = createBrowserRouter(AllRoutes);
export default router;
