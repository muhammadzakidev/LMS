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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Mange your courses or content.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex  flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground"/>

          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              0
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Published
            </CardTitle>
            <CircleCheck className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
              0
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-center">
            <CardTitle className="text-sm font-medium">
              Draft
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
              0
            </div>
          </CardContent>
        </Card>

      </div>
     
    </div>
   )
}