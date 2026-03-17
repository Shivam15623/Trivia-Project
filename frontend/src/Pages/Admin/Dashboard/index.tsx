import Loader from "@/components/Loader";
import HeatMap from "./components/HeatMap";
import ModeBarCard from "./components/ModeBarCard";
import { useAnalyticDashboardQuery } from "@/services/dashboardApi";
import TopCategories from "./components/TopCategories";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import DashboardCard from "./components/Dashboardcard";

const AdminHome = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useAnalyticDashboardQuery();
  const socket = useSocket();
  const [liveUsers, setLiveUsers] = useState<number>(0);

  useEffect(() => {
    if (!socket) return;
    const handleLiveUsersUpdate = (count: number) => setLiveUsers(count);
    socket.on("live-users-update", handleLiveUsersUpdate);
    return () => {
      socket.off("live-users-update", handleLiveUsersUpdate);
    };
  }, [socket]);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data.</div>;

  function formatSecondsToMinutes(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
  }

  const data = dashboardData?.data;
  if (!data) return <div className="text-center text-2xl">No data</div>;

  return (
    <>
      {/* ✅ Responsive grid: 1 col mobile → 2 col tablet → 4 col desktop */}
      <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        <DashboardCard
          title="Total Categories"
          value={data.totalCategories}
          icon="heroicons:document"
        />
        <DashboardCard
          title="Active Categories"
          value={data.activeCategories}
          icon="charm:tick"
        />
        <DashboardCard
          title="Active Users Today"
          value={data.activeUsersToday}
          icon="hugeicons:ai-user"
        />
        <DashboardCard
          title="Live User Now"
          value={liveUsers || data.liveUsers}
          icon="proicons:graph"
        />
        <DashboardCard
          title="Total Games Created"
          value={data.totalGames}
          icon="hugeicons:ai-game"
        />
        <DashboardCard
          title="Game Played Today"
          value={data.gamesToday}
          icon="icon-park-outline:play"
        />
        <DashboardCard
          title="Live Session Running"
          value={data.liveRunningGames}
          icon="pepicons-pencil:camera"
        />
        <DashboardCard
          title="Average Game Duration"
          value={formatSecondsToMinutes(data.averageGameDuration.today)}
          icon="prime:stopwatch"
        />
      </div>

      {/* ✅ HeatMap + ModeBar: stacked on mobile, side by side on lg+ */}
      <div className="relative z-10 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:gap-2.5">
        <HeatMap usersByCountry={data.usersByCountry} />
        <ModeBarCard modeUsage={data.modeUsage} />
      </div>

      {/* ✅ TopCategories full width */}
      <div className="relative z-10 flex w-full flex-col gap-2.5">
        <TopCategories topCategories={data.topCategories} />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-0 top-[27.5%] h-[813px] w-[914px] rotate-[150.39deg] rounded-[132px] bg-[linear-gradient(180deg,#72FDFD99_0%,#02184299_100%)] opacity-60 blur-[100px]" />
        <div className="absolute right-0 top-[52%] h-[597px] w-[918px] rotate-[17.68deg] rounded-[40px] bg-[linear-gradient(180deg,#FE852099_0%,#FED55499_100%)] opacity-60 blur-[100px]" />
      </div>
    </>
  );
};

export default AdminHome;
