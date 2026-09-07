"use client"
import {useState} from 'react';
import { useRouter } from 'next/navigation';
import {Plus} from "lucide-react"
import { Button } from '../ui/button';
import {Input} from '../ui/input'
import { Label } from '../ui/label';
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '../ui/dialog'



interface addModuleProps{
    courseId: string
};

export default function AddModuleDialog({
    courseId,
}: addModuleProps){

    const router = useRouter();
    const [open , setOpen] = useState(false);
    const [title , setTitle] = useState("");
    const [error, setError] = useState("");
    const [isLoading , setIsLoading] = useState(false);

    const createModule = async() =>{
        setError("");
        if(title.trim().length < 3)
        {
            setError("Module title must have  3 characters");
            return ;
        }
        try {
            setIsLoading(true);
            const response = await fetch(
             `http://localhost:5000/api/instructor/courses/${courseId}/modules`,
             {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: title.trim()
                })
             }
            );
            const data = await response.json();
            if(!response.ok)
            {
                setError(data.message || "Failed to create module");
                return ;
            }
            setTitle("");
            setError("");
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.log("Create module error:", error);
            setError("Something went wrong");
        }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>
                <Plus className="h-4 w-4"/>
                Add Module
            </Button>
        }
        />
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Module</DialogTitle>
                <DialogDescription>Add a new module to this course</DialogDescription>
            </DialogHeader>
            <div className='space-y-2'>
             <Label htmlFor='module-title'>
             Module title
             </Label>
             <Input id='module-title'
             placeholder='Write title'
             value={title}
             onChange={(e)=> setTitle(e.target.value)}
             />
             {
                error && (
                    <p className='text-sm'>
                      {error}
                    </p>
                )
             }
            </div>
            <DialogFooter>
                <Button variant="outline" type="button" onClick={()=>setOpen(false)} disabled={isLoading}>
                    Cancel
                </Button>
                 <Button
            type="button"
            onClick={createModule}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Module"}
          </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )

    
}