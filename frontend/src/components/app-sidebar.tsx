import * as React from "react";
import { IconDashboard, IconGoGame } from "@tabler/icons-react";
import { IconCategory, IconPlus } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Category",
      url: "/admin/categories",
      icon: IconCategory,
    },
    {
      title: "MyGames",
      url: "/admin/mygames",
      icon: IconGoGame,
    },
    {
      title: "Create Game",
      url: "/admin/CreateGame",
      icon: IconPlus,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (user) {
    const userPayload = {
      name: user.firstname + " " + user.lastname,
      email: user.email,
      avatar: user.profilePic,
    };
    data.user = userPayload;
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="bg-[#fff6f0] text-gray-800 border-r-2"
    >
      <SidebarHeader>{/* Sidebar Header (optional) */}</SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
