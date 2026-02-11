import NavItem from "../navigation/NavItem"
import sidebarLinks from "../data/sidebarLinks"
import AdminProfile from "./AdminProfile"

const Sidebar = () => {
  return (
    <aside className="bg-black/30 backdrop-blur-xl h-full border-r border-white/10 p-4">
      
      {/* Admin Profile */}
      <AdminProfile />

      {/* Divider */}
      <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Navigation */}
      <nav className="space-y-2">
        {sidebarLinks.map(link => (
          <NavItem key={link.label} {...link} />
        ))}
      </nav>

    </aside>
  )
}

export default Sidebar
