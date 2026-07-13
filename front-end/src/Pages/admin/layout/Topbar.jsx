import { HiOutlineSearch, HiOutlineBell, HiOutlineCog } from "react-icons/hi"
import images from "../../../assets/images"
import { FaAngleDoubleRight } from "react-icons/fa";
import { logout } from "../../../features/auth/authSlice";
import { confirmAction, showToastSuccess } from "../../../Utils/alert";
import api from "../../../api/axios";
import { useDispatch } from "react-redux";

const Topbar = () => {
  const dispatch = useDispatch()
  const handleLogout = async () => { 
    const res = await confirmAction({
      title: "Logout",
      text: "Are you sure you want to logout?",
      confirmText: "Yes, logout",      
    })
    if (!res.isConfirmed) return
    try {
      await api.post("/logout/")
      dispatch(logout())
      showToastSuccess("succesfully logout")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="
      h-16 w-full
      flex items-center justify-between
      px-6
      bg-black/30 backdrop-blur-xl
      border-b border-white/10
    ">
      {/* Left / Search */}
      <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
        <HiOutlineSearch className="text-white/60" size={18} />
        <input
          type="text"
          placeholder="Type here..."
          className="
            bg-transparent outline-none
            text-sm text-white
            placeholder:text-white/40
            w-48
          "
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* View Frontend */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex gap-1 align-middle items-center justify-center  text-blue-300 hover:text-blue-200 transition"
        >
          View Frontend
          <FaAngleDoubleRight />
        </a>

        {/* Icons */}
        <button className="text-white/70 hover:text-white transition">
          <HiOutlineBell size={20} />
        </button>

        <button className="text-white/70 hover:text-white transition">
          <HiOutlineCog size={20} />
        </button>

        {/* Admin Avatar */}
        <img
          src={images.adminIcon}
          alt="Admin"
          className="w-9 h-9 rounded-full object-cover border border-white/20 cursor-pointer"
        />
        <div className="looutbox">
          <button onClick={handleLogout} >Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Topbar
