import RecentT from "../../../components/sendTrans"
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";
import { Card } from "@repo/ui/card";
export default function () {
    return <Card title="Recent Transactions " className="w-full shadow-md rounded-xl gap-2 m-4">
        <div className="mb-4"><Balance></Balance></div>
        <div className="mb-4"><RecentT></RecentT></div>
        <div className="mb-4"><ReTr n={1}></ReTr></div>
        </Card>
}