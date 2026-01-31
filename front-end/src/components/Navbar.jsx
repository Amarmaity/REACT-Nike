import React, { useContext, useState } from 'react'
import Logo from '../assets/logo2.png'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { FaRegUser } from "react-icons/fa"
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi"
import ResponsiveMenu from './ResponsiveMenu'
import { UpdateFollower } from 'react-mouse-follower'
import { ShopContext } from '../context/ShopContext'
import { NavbarMenu } from '../Utils/NavbarMenu'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess, logout } from '../features/auth/authSlice'
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import Button from '../Utils/Button'
import { IoClose } from "react-icons/io5";

const followerProps = {
  backgroundColor: "white",
  scale: 5,
  followSpeed: 1.5,
  mixBlendMode: "difference",
  zIndex: 9999,
}

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { getTotalCartItems } = useContext(ShopContext)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const [openProfile, setOpenProfile] = useState(false)
  console.log(user)
  console.log(isAuthenticated)

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
                  <Link
                    to={item.link}
                    className="inline-block text-base font-semibold py-2 px-3 uppercase"
                  >
                    {item.title}
                  </Link>
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
                {isAuthenticated ? (
                  <>
                    <div className="profilewrapper relative">
                      <button
                        onClick={() => setOpenProfile(true)}
                        className="flex items-center gap-1 min-w-[90px]"
                      >
                        Profile <CgProfile />
                      </button>
                      {
                        openProfile &&
                        <div className="profile-options absolute  w-[150px] border-gray-500 bg-gray-900 rounded-sm flex flex-col gap-4 items-center py-5  ">
                          <Link to={"#"} >View Profile</Link>
                          <button
                            onClick={() => {
                              dispatch(logout())
                              setOpenProfile(false)
                            }}
                            className="flex items-center gap-1 min-w-[90px]"
                          >
                            Logout <LuLogOut />
                          </button>
                          <button className='text-red-600 flex items-center' onClick={()=> setOpenProfile(false)} >Close <IoClose/></button>

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
