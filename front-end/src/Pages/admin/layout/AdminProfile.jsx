import { useSelector } from "react-redux";
import images from "../../../assets/images"
import { RiAdminFill } from "react-icons/ri";
const AdminProfile = () => {
    const {user} = useSelector((state)=>state.auth)
  return (
    <div className="relative group ">
      {/* Profile Row */}
      <div className="flex items-center gap-3 cursor-pointer">        
        <RiAdminFill/>
        <div className="leading-tight">
          <p className="text-white text-sm font-semibold">{user.username}</p>         
        </div>
      </div>
      {/* Hover Popup */}
      <div
        className="
          absolute left-0 top-5 w-52 opacity-0 scale-95 pointer-events-none
          group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
          transition-all duration-200 ease-out
          bg-black/70 backdrop-blur-xl border border-white/10
          rounded-xl shadow-xl z-50
        "
      >
        <div className="p-3 space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition">
            👤 View Details
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition">
            🖼 View Profile Image
          </button>
        </div>
      </div>
    </div>
  )
}
export default AdminProfile
