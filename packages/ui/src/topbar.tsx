interface AppbarProps {
  user?: {
      name?: string | null,
      image?: string | null
  },
  onSignin: any,
  onSignout: any,
}
// import Image from "next/image"

export const Topbar = ( { user,onSignin,onSignout } : AppbarProps ) => {

  return (
    <div className=" items-center  p-2 bg-gray-800 text-white shadow-md ">
      <div className="text-base">DriftPro</div>
      <div className=" gap-4 flex justify-end">
      {user?.name}

    {/* <Image src={user?.image || '/default-image.png'} alt="User Image" width={100} height={100} /> */}

        <button 
        onClick={()=>{
          { user ? onSignout() : onSignin() }
        }}
          className="  rounded-lg hover:bg-blue-600 transition-all text-sm"
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>

      <div className="ml-auto">
      </div>
    </div>
  );
};
