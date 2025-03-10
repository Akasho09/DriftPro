"use client"
import { Card } from "@repo/ui/card";
import { InputCompo } from "@repo/ui/input-compo";
import { DropDown } from "@repo/ui/drop-down";
import { Button } from "@repo/ui/button";
import onRampTrans from "../lib/onRampTransaction";
import {useState} from 'react'

const Banks = [{
    name : "HDFC Bank",
    redirectUrl: "http://localhost:3004/hdfcwebhook"
    },
{
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}]

export default function AddMoney() {
    const [amount , setAmount] = useState(0);
    const [provider,setProvider] = useState("");
    const [redirectUrl,setredirectUrl] = useState(  Banks[0]?.redirectUrl);
  return (
      <Card title="Transfer Page" className="w-[400px] p-6  rounded-lg shadow-md border border-gray-200">
        <div className="space-y-4">
          <InputCompo label="Amount" inputtype="text" className="w-full border border-gray-300 rounded-md p-2" 
          onchange={(e:string)=>{
            setAmount(Number(e))
          }}/>

          <DropDown title="Bank" items={Banks.map((b)=>b.name)} className="w-full border border-gray-300 rounded-md p-2" 
          onselect={(e:string)=>{
            setProvider(e)
            setredirectUrl(Banks.find(x => x.name === e)?.redirectUrl || "")
          }}>
            <div className="text-gray-500 text-sm">Select your bank from the dropdown.</div>
          </DropDown>

          <Button className="w-full bg-blue-200 text-white py-2 rounded-md hover:bg-blue-700" onclick={async ()=>{
            await onRampTrans(amount,provider)
            window.location.href = redirectUrl || "";
            // update balance and payment
          }} >
            Add Money
          </Button>
        </div>
      </Card>
  );
}