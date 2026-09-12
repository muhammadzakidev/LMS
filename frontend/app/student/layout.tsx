import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import StudentSidebar from "@/components/student/studentSidebar";
import StudentHeader from "@/components/student/studentHeader";
export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "Students") {
    redirect("/403");
  }

  return (
    <SidebarProvider>
      <StudentSidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <StudentHeader
          name={session.user.name}
          email={session.user.email}
        />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}