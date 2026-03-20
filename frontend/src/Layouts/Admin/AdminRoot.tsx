import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/AuthSlice/authSlice";

const AdminRoot = () => {
  const { user } = useSelector(selectAuth);

  const today = new Date();
  const shortDate = today.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
  const fullDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <SidebarInset className="bg-black">
        <div className="relative flex min-h-fit flex-1 flex-col gap-4 overflow-auto bg-black px-3 sm:gap-6 sm:px-6 lg:px-12 xl:px-[72px]">
          {/* ── Header ── */}
          <header className="flex min-h-[64px] shrink-0 items-center sm:min-h-[90px] lg:min-h-[106px]">
            <div className="flex w-full flex-row items-center justify-between gap-2 text-white sm:gap-4">
              {/* Left — trigger + avatar + welcome */}
              <div className="flex min-w-0 flex-1 flex-row items-center gap-2 sm:gap-4">
                {/* Sidebar trigger — mobile only */}
                <SidebarTrigger className="shrink-0 text-white lg:hidden" />

                {/* Avatar */}
                <img
                  src={user?.profilePic}
                  alt="avatar"
                  className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-11 sm:w-11 lg:h-14 lg:w-14"
                />

                {/* Welcome text */}
                <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1.5">
                  <p className="truncate font-outfit text-sm font-semibold leading-tight sm:text-lg lg:text-2xl">
                    <span className="sm:hidden">Welcome, Admin!</span>
                    <span className="hidden sm:inline">
                      Welcome back, Admin!
                    </span>
                  </p>
                  <p className="hidden font-outfit text-xs font-normal opacity-60 sm:block sm:text-sm lg:text-base">
                    Manage and monitor all trivia games from here.
                  </p>
                </div>
              </div>

              {/* Right — date */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-outfit text-xs font-normal opacity-60 sm:text-sm">
                  Today
                </span>
                <span className="font-outfit text-xs font-semibold leading-tight sm:text-sm lg:text-base">
                  {/* Short on mobile/tablet, full on desktop */}
                  <span className="lg:hidden">{shortDate}</span>
                  <span className="hidden lg:inline">{fullDate}</span>
                </span>
              </div>
            </div>
          </header>

          {/* ── Page content ── */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminRoot;
