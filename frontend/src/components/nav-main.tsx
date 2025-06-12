

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icon } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#e34b4b] text-white" // Active styles (Deep red background for active items)
                    : "text-gray-800 hover:bg-[#fff6f0] hover:text-[#e34b4b]" // Inactive styles (Light peach background on hover, red text)
                }
              >
                {({ isActive }) => (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    className="flex items-center space-x-2 p-2 rounded-md transition-colors"
                  >
                    {item.icon && <item.icon className="text-xl" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
