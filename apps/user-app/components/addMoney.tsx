"use client";
import { Card } from "@repo/ui/card";
import { InputCompo } from "@repo/ui/input-compo";
import { DropDown } from "@repo/ui/drop-down";
import { Button } from "@repo/ui/button";
import onRampTrans from "../lib/onRampTransaction";
import { useState } from "react";

const Banks = [
  { name: "HDFC Bank", redirectUrl: "http://localhost:3004/hdfcwebhook" },
  { name: "Axis Bank", redirectUrl: "https://www.axisbank.com/" },
];

export default function AddMoney() {
  const [amount, setAmount] = useState<number>(0);
  const [provider, setProvider] = useState<string>(Banks[0]?.name || "");
  const [redirectUrl, setRedirectUrl] = useState<string>(Banks[0]?.redirectUrl || "");

  return (
    <Card title="Transfer Page" className="w-[400px] p-6 rounded-2xl shadow-lg border border-gray-300">
      <div className="space-y-6 pt-8 p-4 border rounded-lg shadow-lg bg-white">
        {/* Amount Input */}
        <InputCompo
          label="Amount"
          inputtype="number"
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setAmount(Number(e))}
        />

        {/* Bank Dropdown with Visible Icon */}
        <div className="relative w-full">
          <DropDown
            title="Select Bank"
            items={Banks.map((b) => b.name)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-grey-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onSelect={(e) => {
              setProvider(e);
              setRedirectUrl(Banks.find((x) => x.name === e)?.redirectUrl || "");
            }}
          >
            <div className="text-blue-500 text-sm ">Choose your bank from the list.</div>
          </DropDown>
        </div>

        <Button
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
          onClick={async () => {
            if (amount <= 0) {
              alert("Please enter a valid amount.");
              return;
            }

            await onRampTrans(amount, provider);

            if (redirectUrl) {
              window.location.href = redirectUrl;
            } else {
              alert("Invalid bank selection.");
            }
          }}
        >
          Add Money
        </Button>
      </div>
    </Card>
  );
}
