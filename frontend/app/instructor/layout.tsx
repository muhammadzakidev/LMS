import {redirect} from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import { SidebarInset , SidebarProvider } from '@/components/ui/sidebar'

import AppSidebar from "@/components/instructor/app-sidebar"
import InstructorHeader from "@/components/instructor/instructor-header"

export default async function InstructorLayout({
    children,
}: {
    children: React.ReactNode
})
{
    const session = await getAuthSession();
    if(!session?.user)
    {
        redirect("/login")
    }
    if(session.user.role !== "Instructor")
    {
        redirect("/403");
    }

    return (
        <SidebarProvider>
        <AppSidebar/>
          <SidebarInset>
            <InstructorHeader name={session.user.name} email={session.user.email}/>
            <main className='flex-1 p-6'>
                 {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
    )
}
