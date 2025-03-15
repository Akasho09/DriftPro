"use server"
import aksh from "@repo/db/client"
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export default async function ts() {
    const session = await getServerSession(authOptions)
    if(!session) return null ;
    console.log(session.user.email)
    const data = await aksh.p2ptransactions.findMany({
        where:{
            OR:[
                {fromNum: String(session.user.email)} ,
                {toNum : String(session.user.email)}
            ]
        } 
    })
    return data ;
}
