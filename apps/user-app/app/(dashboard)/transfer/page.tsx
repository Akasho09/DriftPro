import AddMoney from "../../../components/addMoney";
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";
export default function A() {
  return (
    <div className="flex items-center h-screen w-full">
        <div className="w-full">
        <AddMoney></AddMoney>
        </div>
        <div className="w-full pr-4 h-full">
        <Balance></Balance>
        <ReTr ></ReTr>
        </div>
    </div>
  );
}