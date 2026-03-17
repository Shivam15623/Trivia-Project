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

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <SidebarInset className="bg-black">
        <div className="relative flex min-h-fit flex-1 flex-col gap-4 overflow-auto bg-black px-4 sm:gap-6 sm:px-8 md:px-12 lg:px-[72px]">
          {/* ── Header ── */}
          <header className="flex min-h-[80px] shrink-0 items-center gap-2 border-b-0 bg-transparent pt-3 sm:min-h-[106px] sm:pt-4">
            <div className="flex w-full flex-row items-center justify-between gap-3 text-white">
              {/* ✅ Left — hamburger (mobile) + avatar + welcome text */}
              <div className="flex min-w-0 flex-1 flex-row items-center gap-3 sm:gap-5">
                {/* ✅ Sidebar trigger — visible on mobile only */}
                <SidebarTrigger className="shrink-0 text-white md:hidden" />

                {/* Avatar */}
                <img
                  src={user?.profilePic}
                  className="h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full sm:h-[60px] sm:w-[60px]"
                />

                {/* Welcome text */}
                <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
                  <p className="truncate font-outfit text-[16px] font-semibold leading-[100%] sm:text-[20px] md:text-[24px]">
                    {/* ✅ Shorter on mobile */}
                    <span className="sm:hidden">Welcome, Admin!</span>
                    <span className="hidden sm:inline">
                      Welcome back, Admin!
                    </span>
                  </p>
                  <p className="hidden font-outfit text-[13px] font-normal leading-[100%] opacity-70 sm:block sm:text-[14px] md:text-[16px]">
                    Manage and monitor all trivia game from here.
                  </p>
                </div>
              </div>

              {/* ✅ Right — date (hidden on small mobile) */}
              <div className="hidden flex-col items-end gap-1.5 sm:flex sm:gap-2">
                <span className="font-outfit text-[13px] font-normal leading-[100%] opacity-60 sm:text-[16px]">
                  Today
                </span>
                <span className="font-outfit text-[13px] font-semibold leading-[100%] sm:text-base md:text-lg">
                  {/* ✅ Short date on tablet, full date on desktop */}
                  
                  <span className="hidden md:inline">
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
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
