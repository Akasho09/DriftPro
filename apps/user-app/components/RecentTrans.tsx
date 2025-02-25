import { Card } from "@repo/ui/card";
import search from "../lib/recentTrans";

export default async function ReTr() {
    const data = await search();
    return (
        <Card title="Recent Transactions" className="p-4 border rounded-lg shadow-lg ">
            <div className="">
                {data.map((d, index) => (
                    <div key={index} className="p-3 border-b rounded-lg ">
                        <div className="text-lg font-semibold ">Amount: {d.amount}</div>
                        <div className="">Provider: {d.provider}</div>
                        <div className=" text-sm">Time: {d.startTime.toLocaleTimeString()}</div>
                        <div className="text-red-400">{d.status}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}