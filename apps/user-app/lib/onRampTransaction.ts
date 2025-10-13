"use server"
import aksh from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth";
import redis from "./redis";

export default async function onRampTrans(amount: number , provider: string) {
    const s = await getServerSession(authOptions);
    const userId = s?.user?.id ?? "anonymous"
    
    const token = Math.random().toString()

    try {
        await aksh.onRampTransaction.create({
            data:{
                status : "Processing",
                provider,
                amount : Number(amount)*100,
                startTime : new Date(),
                userId,
                token
            }
        })
        await redis.del(`${s?.user.id}Addmoney`)
        return {
             message: "Done",
             token : token
        }
    } catch(e){
        return {
             error : e
        }
    }
}