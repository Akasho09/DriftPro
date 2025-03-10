"use client"
import { Card } from "@repo/ui/card"
import { InputCompo } from "@repo/ui/input-compo"
import { Button } from "@repo/ui/button"
import {SendMoney} from "../../../lib/sendMoney"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Send() {
    const Router = useRouter()
    const [amount,setAmount] = useState(0)
    const [to , setTo] = useState("")
    async function handle () {
        const response = await SendMoney(to, Number(amount));
        console.log(response)
        alert(response.message); // Display transaction response

        // if (response === "Sucessully transfereed") {
            Router.push("/");
        // }
    }1
    return <div className="h-full w-full ">
        <Card title="Send Money " className="">
        <InputCompo label="Mobile of Reciever" inputtype="string" onchange={(e:string)=>{
            setTo(e)
        }}></InputCompo>
        <InputCompo label="Amount" inputtype="number" onchange={(e:number)=>{
            setAmount(e)
        }}></InputCompo>
        <Button onclick={async ()=>{
            handle()
        }} className="mt-4 w-full bg-blue-200 text-white py-2 rounded-md hover:bg-blue-700" >Send</Button>
    </Card>
    </div> 
}