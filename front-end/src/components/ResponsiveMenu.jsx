import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { NavbarMenu } from '../Utils/NavbarMenu';



const ResponsiveMenu = ({showMenu, setShowMenu}) => {
  return (
    <div className={`${showMenu ? "left-0" : "-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-gray-900/95 backdrop-blur-md px-8 pb-6 pt-16 text-foreground transition-all duration-200 md:hidden rounded-r-xl shadow-md border-r border-gray-800`}>
      <div>
        <div className='flex items-center justify-start gap-3'>
            <FaUserCircle size={50} className='text-foreground'/>
            <div>
                <h1 className='text-foreground'>Hello User</h1>
                <h1 className='text-sm text-gray-400'>Premium User</h1>
            </div>
        </div>
        <nav className='mt-12'>
            <ul className='space-y-4 text-sl text-foreground flex flex-col'>
                {NavbarMenu.map((item, index)=> (
                    <li key={index} onClick={()=>setShowMenu(false)}>
                        <Link to={item.link} className='inline-block text-base font-semibold py-2 px-3 uppercase text-foreground hover:text-blue-400 transition-colors'>
                        {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
      </div>
      <div>
        <h1 className='text-gray-400'>Made with ❤️ by Rajesh</h1>
      </div>
     
    </div>
  )
}
export default ResponsiveMenu
