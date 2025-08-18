"use client"
import { Card } from "@repo/ui/card";
import { InputCompo } from "@repo/ui/input-compo";
import { Button } from "@repo/ui/button";
import SendMoney from "../lib/sendMoney";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendM() {
    const router = useRouter();
    const [amount, setAmount] = useState<number>(0);
    const [to, setTo] = useState<string>("");

    async function handle(to: string, amount: number) {
        console.log("Sending to:", to, "Amount:", amount);

        if (!to || isNaN(amount) || amount < 100) {
            alert("Invalid input: Please enter a valid mobile number and amount.");
            return;
        }

        const response = await SendMoney(to, amount);
        console.log(response);
        alert(response);

        if (response == "Sucessully transfereed") {
            router.push("/");
        }
    }

    return (
        <Card title="Send Money" className="p-6 shadow-md rounded-xl m-4">
            <div className="space-y-6 pt-8 p-4 border rounded-lg shadow-lg bg-gray-100">
                <InputCompo 
                    label="Mobile of Receiver" 
                    inputtype="text" 
                    onChange={(e) => setTo(String(e))} 
                    className="w-full border border-gray-300 rounded-md p-2"
                />
                <InputCompo 
                    label="Amount" 
                    inputtype="text" 
                    onChange={(e) => setAmount(parseFloat(String(e))*100)} 
                    className="w-full border border-gray-300 rounded-md p-2"
                />
                <Button 
                    onClick={async () => handle(to, amount)}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Send
                </Button>
            </div>
        </Card>
    );
}
// "use client"
// import { Card } from "@repo/ui/card"
// import { InputCompo } from "@repo/ui/input-compo"
// import { Button } from "@repo/ui/button"
// import SendMoney from "../lib/sendMoney"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// export default function Send() {
//     const Router = useRouter()
//     const [amount,setAmount] = useState(0)
//     const [to , setTo] = useState("")
//     async function handle (to : string,amount: number) {
//         console.log("to,amount")
//         if (!to || isNaN(amount) || amount <= 0) {
//             alert("Invalid input: Please enter a valid mobile number and amount.");
//             return;
//         }
//         const response = await SendMoney(to,amount);
//         console.log(response)
//         alert(response); // Display transaction response
  
//         if (response == "Sucessully transfereed") {
//             Router.push("/");
//         }
//     }
//     return  <Card title="Send Money " className="">
//         <InputCompo label="Mobile of Reciever" inputtype="text" onChange={(e)=>{
//             setTo(String(e))
//         }}></InputCompo>
//         <InputCompo label="Amount" inputtype="number" onChange={(e)=>{
//             setAmount(Number(e))
//         }}></InputCompo>
//         <Button onClick={async ()=>{
//             handle(to,amount)
//         }} className="mt-4 w-full bg-blue-200 text-white py-2 rounded-md hover:bg-blue-700" >Send</Button>
//     </Card>
// }