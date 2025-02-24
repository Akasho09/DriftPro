"use client"
import { PrismaClient } from '@repo/db/client';
const alask = new PrismaClient();
import {Topbar} from '@repo/ui/topbar';
import { signIn, signOut , useSession } from "next-auth/react";

export default function Home() {
  const s = useSession()
  return (
    <div className="">
    <Topbar user={s.data?.user} onSignin={signIn} onSignout={signOut} ></Topbar>
    user app
    </div>
  );
}
