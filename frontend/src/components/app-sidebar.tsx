import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";

import { selectAuth, setLoggedOut } from "@/redux/AuthSlice/authSlice";
import { handleApiError } from "@/utills/handleApiError";
import { useLogoutMutation } from "@/services";

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

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const onLogout = async () => {
    try {
      const res = await logout(undefined).unwrap();
      if (res.statuscode === 200) {
        dispatch(setLoggedOut());
      }
    } catch (err) {
      handleApiError(err);
    }
  };
  // pull user from your auth slice — adjust selector to match your state shape
  const { user } = useSelector(selectAuth);

  return (
    <Sidebar
      className="border-0 group-data-[side=left]:border-r-0 group-data-[side=right]:border-l-0"
      {...props}
    >
      {/* ── Logo ── */}
      <SidebarHeader className="items-center justify-center py-4">
        <img src="/heroTrivvy.png" className="h-[100px] w-[100px]" />
      </SidebarHeader>

      {/* ── Nav items ── */}
      <SidebarContent className="list-none px-6">
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
                  <Icon icon={item.icon} className="!h-5 !w-5" width={20} />
                  {item.title}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarContent>

      {/* ── Footer: profile + logout ── */}
      <SidebarFooter className="px-4 pb-6 pt-2">
        {/* divider */}
        <div className="mb-3 h-px w-full bg-[hsla(0,0%,100%,0.08)]" />

        {/* User profile row */}
        <NavLink
          to={`/${user?.role}/userProfile/${user?.slug}`}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 font-outfit text-[13px] font-medium transition-all hover:bg-[hsla(0,0%,100%,0.06)] ${
              isActive ? "bg-[hsla(0,0%,100%,0.06)]" : ""
            }`
          }
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover ring-1 ring-[hsla(0,0%,100%,0.15)]"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsla(26,80%,65%,0.2)] ring-1 ring-[hsla(26,80%,65%,0.4)]">
                <Icon
                  icon="solar:user-bold"
                  className="h-4 w-4 text-[hsla(26,80%,65%,1)]"
                />
              </div>
            )}
          </div>

          {/* Name + email */}
          <div className="min-w-0 flex-1">
            <p className="truncate leading-tight">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="truncate text-[11px] font-normal opacity-40">
              {user?.email}
            </p>
          </div>

          {/* Edit icon */}
          <Icon
            icon="solar:pen-2-linear"
            className="h-4 w-4 flex-shrink-0 opacity-30"
          />
        </NavLink>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-outfit text-[13px] font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
        >
          <Icon icon="solar:logout-2-bold" className="h-5 w-5 flex-shrink-0" />
          Log out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
