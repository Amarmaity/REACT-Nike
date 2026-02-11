import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineCreditCard,
  HiOutlineCube,
  HiOutlineGlobeAlt,
} from "react-icons/hi";

const sidebarLinks = [
  {
    label: "Dashboard",
    path: "",
    icon: HiOutlineHome,
  },
  {
    label: "Orders",
    path: "orders",
    icon: HiOutlineClipboardList,
  },
  {
    label: "Customers",
    path: "customers",
    icon: HiOutlineUsers,
  },
  {
    label: "Products",
    path: "products",
    icon: HiOutlineCube,
  },
  {
    label: "Payments",
    path: "payments",
    icon: HiOutlineCreditCard,
  },
  {
    label: "Reports",
    path: "reports",
    icon: HiOutlineChartBar,
  },
  {
    label: "Users",
    path: "users",
    icon: HiOutlineUsers,
  },
  {
    label: "Website Content",
    path: "website-content",
    icon: HiOutlineGlobeAlt,
  },
  {
    label: "Settings",
    path: "settings",
    icon: HiOutlineCog,
  },
];

export default sidebarLinks;
