"use client"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema , type loginInput} from "../../lib/validation/authValidation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card , CardContent , CardDescription  , CardHeader , CardTitle} from "@/components/ui/card";
import Link from "next/link";
export default function LoginPage(){
    const {register , handleSubmit , reset,formState: {errors, isSubmitting}} = useForm<loginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email:"",
            password: ""
        }
});

const onSubmit = async (data: loginInput) =>{
    try{
      const response = await fetch("http://localhost:5000/api/auth/sign-in/email",
        {
            method: "POST",
            headers: {
                "content-type": "application/json" 
            },
            body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("Login result" , result);
      reset();
    }
    catch(error)
    {
      console.log("Login Error" , error);
    }
}
return (
    <main className="flex items-center justify-center min-h-screen">
        <Card className= "w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Login
                </CardTitle>
                <CardDescription>
                    Login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                 <div className="space-y-2">
                    <Label htmlFor="email" >
                        Email
                    </Label>
                    <Input id="email" type="email" placeholder="enter the email" {...register("email")}/>
                    {
                        errors.email && (
                            <p className="text-sm text">
                                {errors.email.message}
                            </p>
                        )
                    }
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <Input id="password" type="password" placeholder="enter the password"{...register("password")}/>
                    {
                        errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )
                    }
                 </div>

                 <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                 </Button>

                </form>
                <div>
                    <p className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">
                            Don&apos;t have an account?{" "}
                        </span>
                        <Link href="/signup" className="text-primary font-medium underline-offset-4 hover:underline">
                            Signup
                        </Link>
                    </p>
                </div>
            </CardContent>

        </Card>

    </main>
)
}