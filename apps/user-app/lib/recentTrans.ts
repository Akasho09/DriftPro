import aksh from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export default async function search() {
    const session = await getServerSession(authOptions)
    const data = await aksh.onRampTransaction.findMany({
        orderBy: {
            startTime: 'desc', // Order by createdAt in descending order (most recent first)
          },
        where:{
            userId : (session?.user.id)
        }, select:{
            provider: true,
            amount:true,
            startTime : true,
            status : true
        }
    })
    return data 
}