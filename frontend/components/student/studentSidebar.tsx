"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LayoutDashboard, BookOpen, GraduationCap , LogOut} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Explore Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    title: "My Courses",
    href: "/student/myCourse",
    icon: GraduationCap,
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.log("Logout failed");
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/student/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold leading-none">LMS</p>

            <p className="mt-1 text-xs text-muted-foreground">Student Panel</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  (item.href === "/student/courses" &&
                    pathname.startsWith("/student/courses/"));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      className="h-11 rounded-lg"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-11 cursor-pointer rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
