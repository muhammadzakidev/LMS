import {redirect} from "next/navigation"
import { getAuthSession } from "@/lib/auth";
import { BookOpen ,FileText , CircleCheck } from "lucide-react";
import {Card , CardContent , CardHeader, CardTitle } from "@/components/ui/card"
export default async function InstructorDashboard()
{
  const session = await getAuthSession();
  if(!session?.user)
  {
    redirect('/login');
  }
  if(session.user.role !== 'Instructor')
  {
    redirect('/403');
  }
   return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">
        Instructor Dashboard
      </h1>

      <p className="text-muted-foreground">
        Manage your courses and course content.
      </p>
    </div>
  );
}