import {redirect} from "next/navigation"
import { getAuthSession } from "@/lib/auth";
export default async function StudentDashboard(){
      const session = await getAuthSession();
      if(!session?.user)
      {
        redirect('/login');
      }
      if(session.user.role !== 'Students')
      {
        redirect('/403');
      }
    return(
        <>
        <main className="p-4">
            <h1 className="text-6xl font-bold text-center">Welcome to Student Dashboard</h1>
            <h3 className="mt-6 text-3xl text-center">
                Welcome, {session.user.name}! You are logged in as a {session.user.role}.
            </h3>

        </main>
        </>
    )
}