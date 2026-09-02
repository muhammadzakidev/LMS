"use client"
import { LogOut , User } from "lucide-react" ;
import { SidebarTrigger } from "../ui/sidebar";
import {Avatar , AvatarFallback} from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
 } from "../ui/dropdown-menu";


 interface InstructorHeaderType{
    name: string ,
    email: string
 }

 export default function InstructorHeader({
    name, email,
 }: InstructorHeaderType) {
    return (
        <header className="flex h-16 items-center justify-center border-b px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger/>
                <h2 className="font-semibold">
                    Course Management System
                </h2>

            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 rounded-md p-2 hover:bg-muted">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium">{name}</p>
                            <p className="text-xs text-shadow-muted-foreground">{email}</p>
                        </div>
                        <Avatar>
                            <AvatarFallback>
                                {name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                    </button>

                    
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                    My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                 <DropdownMenuItem>
                    <User/>
                    Profile
                 </DropdownMenuItem>
                 <DropdownMenuItem>
                    <LogOut/>
                    Logout
                 </DropdownMenuItem>
                  
                </DropdownMenuContent>
                
            </DropdownMenu>

        </header>
    );
 }