import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: "fa7-solid:home",
    },
    {
      title: "Category",
      url: "/admin/categories",
      icon: "mage:dashboard-plus-fill",
    },
    {
      title: "User Management",
      url: "/admin/user-management",
      icon: "solar:user-bold",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  return (
    <Sidebar
      className="border-0 group-data-[side=left]:border-r-0 group-data-[side=right]:border-l-0"
      {...props}
    >
      <SidebarHeader className="items-center justify-center py-4">
        <img src="/heroTrivvy.png" className="h-[100px] w-[100px]" />
      </SidebarHeader>
      <SidebarContent className="list-none px-6">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => {
          const isActive =
            item.url === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.url);

          return (
            <SidebarMenuItem
              key={item.title}
              className="relative font-outfit text-[14px] font-semibold"
            >
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="relative flex h-11 items-center overflow-visible rounded-xl px-4 py-3 transition-all before:absolute before:-left-2 before:top-1/2 before:h-10 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-[hsla(26,80%,65%,1)] before:opacity-0 data-[active=true]:bg-[hsla(0,0%,100%,0.06)] data-[active=true]:before:opacity-100"
              >
                <NavLink
                  to={item.url}
                  className="flex items-center gap-2 px-4 py-3"
                >
                  <Icon icon={item.icon} className="!h-5 !w-5 " width={20} />
                  {item.title}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarContent>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
