import { Card } from "@repo/ui/card";
import search from "../lib/recentTrans";

export default async function ReTr({ n }: { n: number }) {
    const data = await search();
    if(n==0) n=4 ;
    else n=data.length;
    
    if (!data || data.length === 0) {
        return (
            <Card title="Add Money Transactions" className=" p-4 shadow-md rounded-xl bg-white m-4">
                <p className="text-gray-500 text-center">No recent transactions found.</p>
            </Card>
        );
    }

    return (
        <Card title="Add Money Transactions" className="p-6 shadow-md rounded-xl">
            <div className="space-y-4">
                {data.slice(0,n).map((d, index) => (
                    <div key={index} className="p-3 border-b rounded-lg bg-gray-50 shadow-sm">
                        <div className="text-lg font-semibold">Amount: ₹{d.amount.toFixed(2)}</div>
                        <div className="text-gray-700">Provider: {d.provider}</div>
                        <div className="text-sm text-gray-500">
                            Time: {new Date(d.startTime).toLocaleTimeString()}
                        </div>
                        <div className={d.status === "Success" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                            {d.status}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
