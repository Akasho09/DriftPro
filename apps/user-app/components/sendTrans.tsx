import ts from "../lib/p2ptrans"
import { Card } from "@repo/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
export default async function B () {
    const session = await getServerSession(authOptions)
    const data = await ts()
    return <Card title="Recent Transactions" className="w-full">
        {data.map((d,i)=>(
            <div key={i} className="p-4 border-2 border-slate-400">
                {d.fromNum==session?.user?.email ? <div>Sent To : {d.toNum}</div> : <div>Recieved From : {d.fromNum}</div> }
                <h2>Amount : {d.amount} INR</h2>
                <div>Time: {d.tTime ? new Date(d.tTime).toLocaleString() : "N/A"}</div>
            </div>
        ))}
    </Card>
}