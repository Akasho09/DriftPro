"use client";
import { signIn, signOut ,useSession } from "next-auth/react";

export const Topbar = () => {
  // const s = useSession();

  return (
    <div className=" items-center  p-2 bg-gray-800 text-white shadow-md ">
      <div className="text-base">DriftPro</div>
      <div className=" gap-4 flex justify-end">
         
        <button 
          onClick={() => signIn()} 
          className="  rounded-lg hover:bg-blue-600 transition-all text-sm"
        >
          SIGN IN
        </button>

        <button 
          onClick={() => signOut()} 
          className=" rounded-lg hover:bg-red-600 transition-all text-sm"
        >
          SIGN OUT
        </button>
        <button onClick={()=>{
        }}></button>
       {/* <div> {s.data?.user?.name} </div> */}
      </div>

      <div className="ml-auto">
      </div>
    </div>
  );
};
