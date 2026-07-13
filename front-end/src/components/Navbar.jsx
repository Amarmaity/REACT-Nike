import React, { useContext, useRef, useState } from 'react'
import Logo from '../assets/logo2.png'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi"
import ResponsiveMenu from './ResponsiveMenu'
import { UpdateFollower } from 'react-mouse-follower'
import { ShopContext } from '../context/ShopContext'
import { NavbarMenu } from '../Utils/NavbarMenu'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { confirmAction, showToastSuccess } from '../Utils/alert'
import Profile from '../Pages/user/Profile'
import useToggle from '../hooks/useToggle'
import useClickOutside from '../hooks/useClickOutside'
const followerProps = {
  backgroundColor: "white",
  scale: 5,
  followSpeed: 1.5,
  mixBlendMode: "difference",
  zIndex: 9999,
}

const Navbar = () => {
  const {isOpen ,open, close, toggle} = useToggle()
  const [showMenu, setShowMenu] = useState(false)
  const { getTotalCartItems } = useContext(ShopContext)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)  
  const navigate = useNavigate()
  const ref = useClickOutside(close)

  const handleLogout = async () => {
    const res = await confirmAction({
      title: "Logout",
      text: "Are you sure you want to logout?",
      confirmText: "Yes, logout",
    })
    if (!res.isConfirmed) return
    try {
      const api = (await import("../api/axios")).default;
      await api.post("/logout/");
      navigate("user/login")
      showToastSuccess("Logout Successfully")
    } catch (e) {
      // Ignore backend errors
    }
    dispatch(logout());   
  }
  const userName = user?.username

 

  return (
    <div
      className={`z-10 ${isHome
        ? 'absolute top-0 left-0 w-full bg-transparent text-white'
        : 'bg-gray-900/50 backdrop-blur-md border-b border-gray-800 text-foreground py-2'
        }`}
    >
      <div className="container flex justify-between items-center">

        {/* Logo */}
        <img src={Logo} alt="logo" className="max-w-[100px] invert" />

        {/* Desktop Menu */}
        {/* Desktop Menu */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-4">

            {NavbarMenu.map(item => (
              <li key={item.id}>
                <UpdateFollower mouseOptions={followerProps}>
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `inline-block text-base group relative  py-2 px-3 uppercase ${isActive ? "font-semibold abosulute contents-0 top-0 left-0 right-0 bottom-[-8px] width-[100%%] bg-gray-800 height-[2px] rounded-sm " : "font-normal"
                      }`
                    }
                  >                   
                    {item.title}
                  </NavLink>
                </UpdateFollower>
              </li>
            ))}

            {/* Desktop Cart */}


          </ul>
        </div>
        <div className="hidden md:block">
          <ul className="flex w-full justify-end items-center gap-4">
            <li>
              <UpdateFollower mouseOptions={followerProps}>
                <Link to="/cart" className="relative ps-4 flex items-center">
                  <ShoppingCart />
                  {!isHome && (
                    <span className="bg-[#138695] w-5 h-5 absolute -top-2 -right-2 flex items-center justify-center rounded-full text-xs text-white">
                      {getTotalCartItems()}
                    </span>
                  )}
                </Link>
              </UpdateFollower>
            </li>
            <li>
              <UpdateFollower mouseOptions={followerProps}>
                {user ? (
                  <>
                    <div ref={ref} className="profilewrapper relative">
                      <button
                        onClick={toggle}
                        className="flex items-center gap-1 min-w-[90px]"
                      >
                        Profile <CgProfile />
                      </button>
                      {
                        isOpen &&
                        <div className="profile-options absolute  w-[150px] border-gray-500 bg-gray-900 rounded-sm flex flex-col gap-4 items-center py-5  ">
                          <Link to={`/profile/${userName}`} >View Profile</Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 min-w-[90px]"
                          >
                            Logout <LuLogOut />
                          </button>
                          <button className='text-red-600 flex items-center' onClick={close} >Close <IoClose /></button>

                        </div>

                      }

                    </div>
                  </>

                ) : (
                  <Link
                    to={'/user/login'}
                    className="flex items-center gap-1 min-w-[90px]"
                  >
                    Login <LuLogIn />
                  </Link>
                )}
              </UpdateFollower>
            </li>
          </ul>
        </div>

        <div className="md:hidden">
          <div className="flex items-center gap-6 hidden z-50">

            {/* Cart */}
            <UpdateFollower mouseOptions={followerProps}>
              <Link to="/cart" className="relative">
                <ShoppingCart />
                {!isHome && (
                  <span className="bg-[#138695] w-5 h-5 absolute -top-2 -right-2 flex items-center justify-center rounded-full text-xs text-white">
                    {getTotalCartItems()}
                  </span>
                )}
              </Link>
            </UpdateFollower>

            {/* Hamburger */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="block"
            >
              {showMenu ? <HiMenuAlt1 size={30} /> : <HiMenuAlt3 size={30} />}
            </button>
          </div>
        </div>
      </div>
      <ResponsiveMenu showMenu={showMenu} setShowMenu={setShowMenu} />
    </div>
  )
}

export default Navbar
