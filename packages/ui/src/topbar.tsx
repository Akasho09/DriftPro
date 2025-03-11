interface AppbarProps {
  user?: {
      name?: string | null,
      image?: string | null,
      mobile? : string | null
  },
  onSignin: any,
  onSignout: any,
  update : any
}
// import Image from "next/image"

export const Topbar = ( { user,onSignin,onSignout , update } : AppbarProps ) => {
  console.log("user " , user)
  return (
    <div className=" items-center  p-2 bg-gray-800 text-white shadow-md ">
      <div className="text-base">DriftPro</div>
      <div className=" gap-4 flex justify-end">
      {user?.mobile || "akash"}

    {/* <Image src={user?.image || '/default-image.png'} alt="User Image" width={100} height={100} /> */}

        <button 
        onClick={()=>{
          { user ? onSignout() : onSignin() }
        }}
          className="  rounded-lg hover:bg-blue-600 transition-all text-sm"
        >
          {user ? "Logout" : "Login"}
        </button>
        <button onClick={() => update()}>Refresh Session</button>
      </div>

      <div className="ml-auto">
      </div>
    </div>
  );
};
