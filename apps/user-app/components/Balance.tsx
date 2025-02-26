import { Card } from "@repo/ui/card";
import aksh from "@repo/db/client" 
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function Balance() {
  const session = await getServerSession(authOptions)
  const data = await aksh.balance.findFirst({
    where:{
      userId: session.user.id
    },
    select: {
      amount : true,
      locked : true
    }
  })
  console.log("data" , data)
  return (
        <Card title="Balance" className=" ">
            <div className="divide-y divide-gray-300">
            <div className="flex justify-between">
            <h3>unlocked Balance </h3>
            <h3>{data?.amount}</h3>
            </div>
            <div className="flex justify-between">

            <h3>Total Loacked Balance </h3>
            <h3>{data?.locked}</h3>
            </div>
            <div className="flex justify-between">
            <h3>Total Balance</h3>
            <h3>100</h3>
            </div></div>
        </Card>
  );
}