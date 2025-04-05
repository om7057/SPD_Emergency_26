import { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileDropdown from "./ProfileDropDown";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex overflow-hidden">
      {isSidebarOpen && (
        <div className="w-64 bg-gray-900 text-white">
          <Sidebar />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <nav className="h-16 bg-blue-600 flex items-center justify-between px-4 text-white">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="text-2xl font-bold focus:outline-none"
          >
            ☰
          </button>

          <h1 className="text-lg font-bold">My App</h1>
          <ProfileDropdown />
        </nav>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
