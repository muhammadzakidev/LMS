"use client"
import React, { useState, type SubmitEvent } from 'react'

const Page = () => {
    const [name , setName] = useState("");
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState("");
    const [role , setRole] = useState('Students');
    const [loading , setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState("");
    
    const handleSignUp = (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
      
      try {
        console.log({
            name , 
            email ,
            password ,
            role ,
            loading ,
            message 
        });
        setMessage('Form is Working')
      } catch (error) {
        setMessage(`Form is not working ${error}`);
      }


    }


}

export default Page