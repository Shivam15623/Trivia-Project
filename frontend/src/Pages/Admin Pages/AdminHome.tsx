import DashboardCards from "@/CustomComponent/DashboardCategory";
import { useFetchDashboardCategoryDataQuery } from "@/services";

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
      <DashboardCards data={data} />
    </>
  );
};

export default AdminHome;
