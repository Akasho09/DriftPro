import AddMoney from "../../../components/addMoney";
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";
export default function A() {
  return (
    <div className="flex items-center min-h-screen w-full">
        <div className="w-full">
        <AddMoney></AddMoney>
        </div>
        <div className="w-full pr-4">
        <Balance></Balance>
        <ReTr></ReTr>
        </div>
    </div>
  );
}