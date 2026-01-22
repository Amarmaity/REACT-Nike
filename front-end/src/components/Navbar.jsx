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

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { getTotalCartItems } = useContext(ShopContext)
  const { pathname } = useLocation()
  const isHome = pathname === '/'  

  return (
    <div
      className={`
        z-10
        ${isHome
          ? 'top-0 left-0 bg-transparent absolute w-full  text-white'
          : 'text-foreground py-2 bg-gray-900/50 backdrop-blur-md border-b border-gray-800'}
      `}
    >
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <img src={Logo} alt="logo" className="max-w-[100px] invert" />

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-4 relative z-40">
            {NavbarMenu.map(item => (
              <li key={item.id}>
                <UpdateFollower
                  mouseOptions={{
                    backgroundColor: "white",
                    zIndex: 9999,
                    followSpeed: 1.5,
                    scale: 5,
                    mixBlendMode: "difference"
                  }}
                >
                  <Link
                    to={item.link}
                    className="inline-block text-base font-semibold py-2 px-3 uppercase"
                  >
                    {item.title}
                  </Link>
                </UpdateFollower>
              </li>
            ))}

            {/* Cart */}
            <UpdateFollower mouseOptions={{ backgroundColor: "white", scale: 5 }}>
              <Link to="/cart">
                <div className="relative ps-8">
                  <ShoppingCart />
                  {!isHome && (
                    <div className="bg-[#138695] w-5 absolute -top-3 -right-2 flex items-center justify-center rounded-full text-white">
                      {getTotalCartItems()}
                    </div>
                  )}
                </div>
              </Link>
            </UpdateFollower>

            {/* User */}
            <UpdateFollower mouseOptions={{ backgroundColor: "white", scale: 5 }}>
              <button className="text-xl ps-8">
                <FaRegUser />
              </button>
            </UpdateFollower>
          </ul>
        </div>

        {/* Mobile */}
        <div className="flex gap-8 md:hidden z-50">
          <Link to="/cart" className="relative">
            <ShoppingCart />
            {!isHome && (
              <div className="bg-[#138695] w-5 absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white">
                {getTotalCartItems()}
              </div>
            )}
          </Link>

          {showMenu ? (
            <HiMenuAlt1 onClick={() => setShowMenu(false)} size={30} />
          ) : (
            <HiMenuAlt3 onClick={() => setShowMenu(true)} size={30} />
          )}
        </div>
      </div>

      <ResponsiveMenu showMenu={showMenu} setShowMenu={setShowMenu} />
    </div>
  )
}

export default Navbar
