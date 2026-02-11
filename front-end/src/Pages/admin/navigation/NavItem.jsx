import { NavLink } from "react-router-dom"

const NavItem = ({ label, path, icon: Icon }) => {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        `
        group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
        ${isActive
          ? "bg-white/10 text-white"
          : "text-blue-200 hover:bg-white/5"}
        `
      }
    >
      {/* Icon */}
      <div
        className={`
          flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200
          bg-white/10 group-hover:bg-white/20
        `}
      >
        <Icon size={18} />
      </div>

      {/* Label */}
      <span className="text-sm font-medium tracking-wide">
        {label}
      </span>
    </NavLink>
  )
}

export default NavItem
