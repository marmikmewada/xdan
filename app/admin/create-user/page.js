"use client";
import { useEffect, } from 'react';

import Register from "@/app/register/page";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default  function CreateUser(){
    const { data: session, status } = useSession();
    const router = useRouter();
    const { user } = session || {};
    const { role } = user || {};
  
    useEffect(() => {
      if (status !== "loading" && role !== "admin"&& role !== "staff") {
        router.back();
      }
    }, [role, router, status]);
    
return (
    <Register isSendMail={true}/>
)
}