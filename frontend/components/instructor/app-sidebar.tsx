"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    href: "/instructor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-4">
        <Link
          href="/instructor/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold leading-none">
              LMS
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Instructor Panel
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          

          <SidebarGroupContent className="flex flex-row">
            <SidebarMenu className="mt-2 gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  (
                    item.href === "/instructor/courses" &&
                    pathname.startsWith("/instructor/courses/")
                  );

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                     
                      isActive={isActive}
                      className="h-11 rounded-lg flex flex-row items-center gap-3 px-3"
                    >
                      <Link href={item.href} className="flex flex-row items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}