"use server"
import aksh from "@repo/db/client"
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export default async function ts() {
    const session = await getServerSession(authOptions)
    console.log(session.user.email)
    const data = await aksh.p2ptransactions.findMany({
        where:{
            OR:[
                {fromNum: String(session.user.email)} ,
                {toNum : String(session.user.email)}
            ]
        } 
    })
    console.log("data  : " , data)
    return data ;
}
