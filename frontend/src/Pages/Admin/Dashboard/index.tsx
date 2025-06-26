import WelcomeSection from "@/components/WelcomeSection";

import { useFetchDashboardCategoryDataQuery } from "@/services";
import DashboardCards from "./components/DashboardCategory";
import Loader from "@/components/Loader";

const AdminHome = () => {
  const {
    data: dashboardCategory,
    isLoading,
    isError,
  } = useFetchDashboardCategoryDataQuery();


  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading data.</div>;
  }

  // Edge case: Check if dashboard data exists and has the necessary properties
  const data = dashboardCategory?.data;
  if (!data) {
    return <div className="text-center text-2xl">No data</div>;
  }

  return (
    <>
      <WelcomeSection />
      <DashboardCards data={data} />
    </>
  );
};

export default AdminHome;
