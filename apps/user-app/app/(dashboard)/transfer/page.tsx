import AddMoney from "../../../components/addMoney";
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";

export default function A() {
  return (
    <div className="min-h-screen w-full pt-36 pb-10 px-16 flex items-start justify-center">
      <div className="flex flex-col gap-8">
        
        <div className="flex gap-8">
          <AddMoney />
          <div className="w-full"><Balance /></div>
        </div>

          <ReTr n={0} />
      </div>
    </div>
  );
}
