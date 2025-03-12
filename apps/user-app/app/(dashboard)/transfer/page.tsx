import AddMoney from "../../../components/addMoney";
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";
export default function A() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
        <div className="w-1/2 flex items-center justify-center"><AddMoney></AddMoney></div>
        <div className="w-1/2 pr-4">
        <Balance></Balance>
        <ReTr ></ReTr>
        </div>
    </div>
  );
}