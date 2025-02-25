import { Card } from "@repo/ui/card";

export default function Balance() {
  return (
        <Card title="Balance" className=" ">
            <div className="divide-y divide-gray-300">
            <div className="flex justify-between">
            <h3>unlocked Balance </h3>
            <h3>100</h3>
            </div>
            <div className="flex justify-between">

            <h3>Total Loacked Balance </h3>
            <h3>100</h3>
            </div>
            <div className="flex justify-between">
            <h3>Total Balance</h3>
            <h3>100</h3>
            </div></div>
        </Card>
  );
}