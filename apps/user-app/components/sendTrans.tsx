import ts from "../lib/p2ptrans";
import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function B() {
    const session = await getServerSession(authOptions);
    const data = await ts();

    return (
        <Card title="Recent Transactions" className="w-full p-6 shadow-md rounded-xl bg-white m-4">
            {!session?.user?.email ? (
                <p className="text-red-500 font-semibold text-lg">Login First</p>
            ) : !data || data.length === 0 ? (
                <p className="text-gray-500">No transactions found.</p>
            ) : (
                <div className="space-y-4">
                    {data.map((d, i) => (
                        <div key={i} className="p-4 border border-gray-300 rounded-md shadow-sm bg-gray-100">
                            {d.fromNum === session.user.email ? (
                                <div className="text-blue-600 font-semibold">Sent To: {d.toNum}</div>
                            ) : (
                                <div className="text-green-600 font-semibold">Received From: {d.fromNum}</div>
                            )}
                            <h2 className="text-lg font-bold">Amount: ₹{d.amount}</h2>
                            <div className="text-gray-600">
                                Time: {d.tTime ? new Date(d.tTime).toLocaleString() : "N/A"}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
