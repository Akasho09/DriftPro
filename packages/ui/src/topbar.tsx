interface AppbarProps {
  user?: {
      name?: string | null,
      image?: string | null,
      email? : string  | null
  },
  onSignin: any,
  onSignout: any
}
import Image from "next/image"

export const Topbar = ( { user,onSignin,onSignout } : AppbarProps ) => {
const i= (user?.image)
  return (
    <div className=" items-center p-2 bg-gray-800 text-white shadow-md ">
      <div className="text-base">DriftPro</div>
      <div className=" gap-4 flex justify-end">
      <div className="border border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
      { !i ? (
<h6>🌸</h6>
) : (
 <Image 
   src={i} 
   alt="User Image" 
   width={40} 
   height={40} 
   className="rounded-full object-cover"
 />
)}

</div>
<h4>{user?.email || ""}</h4>
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
