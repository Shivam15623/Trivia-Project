import { Outlet } from "react-router-dom";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const AdminRoot = () => {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <SidebarInset className="bg-black">
        <div className="relative flex min-h-fit flex-1 flex-col gap-6 overflow-auto bg-black px-[72px]">
          <header className="flex h-[106px] shrink-0 items-center gap-2 border-b-0 bg-transparent pt-4">
            {/* <SidebarTrigger className="-ml-1" /> */}
            {/* <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          /> */}
            <div className="flex w-full flex-row justify-between text-white">
              <div className="flex flex-row gap-5">
                <img
                  src="/4ac54796-8655-45b3-9a34-3922864b7bab.jpg"
                  className="h-[60px] w-[60px] overflow-hidden rounded-full"
                />
                <div className="flex flex-col gap-2">
                  <p className="font-outfit text-[24px] font-semibold leading-[100%]">
                    Welcome back, Admin!
                  </p>
                  <p className="font-outfit text-[16px] font-normal leading-[100%]">
                    Manage and monitor all trivia game from here.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <span className="font-outfit text-[16px] font-normal leading-[100%]">
                  Today
                </span>
                <span className="font-outfit text-lg font-semibold leading-[100%]">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </header>

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminRoot;
