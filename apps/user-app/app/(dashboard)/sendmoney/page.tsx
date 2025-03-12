import Send from "../../../components/sendMoney"
import B from "../../../components/sendTrans"
export default function () {
    
    return <div className="h-full w-full ">
        <Send></Send>
        <div className="flex">
        <div className="w-2/3"></div>
        <B></B>
        </div>
    </div> 
}