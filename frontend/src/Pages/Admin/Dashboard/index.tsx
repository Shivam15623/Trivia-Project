import WelcomeSection from "@/components/WelcomeSection";

import { useFetchDashboardCategoryDataQuery } from "@/services";
import DashboardCards from "./components/DashboardCategory";

const AdminHome = () => {
  // Fetch dashboard data using the custom hook
  const {
    data: dashboardCategory,
    isLoading,
    isError,
  } = useFetchDashboardCategoryDataQuery();

  // Loading and Error handling
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data.</div>;
  }

  // Edge case: Check if dashboard data exists and has the necessary properties
  const data = dashboardCategory?.data;
  if (!data) {
    return <>No data</>;
  }

  return (
    <>
      <WelcomeSection />
      <DashboardCards data={data} />
    </>
  );
};

export default AdminHome;
