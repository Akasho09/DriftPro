"use server"
import aksh from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth";

export default async function onRampTrans(amount: number , provider: string) {
    const s = await getServerSession(authOptions);
    const userId = s?.user.id 
    const token = Math.random().toString()
    try {
        await aksh.onRampTransaction.create({
            data:{
                status : "Processing",
                provider,
                amount : Number(amount),
                startTime : new Date(),
                userId : (userId),
                token
            }
        })
        return {
             message: "Done"
        }
    } catch(e){
        return {
             error : e
        }
    }
}