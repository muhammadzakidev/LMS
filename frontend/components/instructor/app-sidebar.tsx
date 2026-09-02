"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard ,BookOpen } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu ,SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"


const menuItems = [
    {
        title: "Dashboard",
        href: "/instructor/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Courses",
        href: "/instructor/courses",
        icon: BookOpen
    },
];

export default function AppSidebar()
{
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Instructor Panel
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item)=>{
                                const Icon =item.icon;
                                const isActive = pathname === item.href || (
                                   item.href === "/instructor/courses" &&
                                   pathname.startsWith("instructor/courses/")
                                );

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton isActive={isActive} asChild>
                                            <Link href={item.href}>
                                                <Icon />
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
    )
}