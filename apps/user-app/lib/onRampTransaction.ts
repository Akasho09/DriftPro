"use server"
import aksh from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth";

export default async function onRampTrans(amount: number , provider: string) {
    const s = await getServerSession(authOptions);
    const token = Math.random().toString()
    try {
        aksh.onRampTransaction.create({
            data:{
                status : "Processing",
                provider,
                amount : Number(amount),
                startTime : new Date,
                userId: s?.user._id ,
                token
            }
        })
    } catch(e){
        return e
    }
}