"use client"
import {useForm, useWatch, type FieldErrors} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signupSchema , type SignupInput} from "../../lib/validation/authValidation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card , CardContent , CardDescription  , CardHeader , CardTitle} from "@/components/ui/card";
import {RadioGroup , RadioGroupItem} from "@/components/ui/radio-group";
import Link from "next/link";


export default function SignupPage(){
 
  const {register , handleSubmit , setValue , control , reset,formState: {errors, isSubmitting}} = useForm<SignupInput>({
   resolver: zodResolver(signupSchema),
   defaultValues:{
    name:"",
    email:"",
    password:"",
    role: "Students"
   },
  });

  const selectedRole = useWatch({control, name: "role"});
  const onSubmit = async (data: SignupInput) =>{
    try {
      const response = await fetch("http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Signup Result" , result);
      if (!response.ok)
     {
      console.log("Signup failed:", result);
      return;
    }
      reset();
    
    } catch (error) {
      console.log("Signup Error" , error);
    }
   
  };
 const onError = async (errors: FieldErrors<SignupInput>) =>{
  console.log("Form Errors" , errors);
 }
  
  //backend connection will be added here 

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          Create Account
        </CardTitle>
        <CardDescription>
          Signup as a student or instructor.
        </CardDescription>
      </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
           <div className="space-y-2">
            <Label htmlFor="name">
              Name
            </Label>
            <Input id="name" placeholder="Enter the name" {...register("name")}/>
            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}

           </div>
           <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>
            <Input id="email" placeholder="Enter the email" {...register("email")} type="email"/>
            {
              errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )
            }

           </div>
           <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>
            <Input id="password" type="password" placeholder="Enter the password" {...register("password")}/>
            {
              errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )
            }

           </div>
          <div className="space-y-3">
            <Label>
              Select Role
            </Label>
            <RadioGroup value={selectedRole} onValueChange={(value)=>{
              setValue(
                "role" , value as "Students" | "Instructor" ,
                {
                  shouldValidate: true
                }
              )
            }} className="grid grid-cols-2 gap-4">
              <div className="flex items-center border rounded-full p-3 space-x-2 text-black">
                <RadioGroupItem value="Students" id="Students"/>
                  <Label htmlFor="Students" className="cursor-pointer">
                    Student
                  </Label>
                  
              </div>
              <div className="flex items-center rounded-full border p-2 space-x-2 text-black">
                <RadioGroupItem value="Instructor" id="Instructor"/>
                  <label htmlFor="Instructor" className="cursor-pointer " >
                    Instructor
                  </label>

              </div>

            </RadioGroup>
            {
              errors.role && (
                <p className="text-sm text-red-500">
                  {errors.role.message}
                </p>
              )
            }
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting} >
            {isSubmitting?"Creating Account...": "Create Account"}
          </Button>
          </form>
          <div>
            <p className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link href="/login" className="text-primary font-medium underline-offset-4 hover:underline">
              Login
              </Link>

            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}