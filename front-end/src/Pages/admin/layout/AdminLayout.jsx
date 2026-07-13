import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  return (
    <div className=" 
      bg-[radial-gradient(circle_at_top,#0a2a66_0%,#081839_45%,#040e26_100%)]
    ">
      <div className=" h-full">
        <div className="h-screen fixed top-0 bottom-0 left-0 w-[260px] overflow-y-auto ">
          <Sidebar />
        </div>
        <div className="flex flex-col h-full w-[calc(100%-260px)] ml-[260px]">
          <div className="h-16 shrink-0 fixed left-[260px] right-0 top-0 z-50">
            <Topbar />
          </div>
          <div className="flex-1 mt-[70px] overflow-y-auto p-6 min-h-[90vh]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
